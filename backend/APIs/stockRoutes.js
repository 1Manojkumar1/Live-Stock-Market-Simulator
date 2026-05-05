import exp from "express";
import { stockModel } from "../models/stock.js";
import { alertModel } from "../models/alertModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const stockApp = exp.Router();

//get all stocks (with optional search & filter)
stockApp.get("/stocks", async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;

    //build dynamic filter
    let filter = {};

    if (search) {
      filter.$or = [
        { stockName: { $regex: search, $options: "i" } },
        { symbol: { $regex: search, $options: "i" } },
      ];
    }
    if (category) {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const stocks = await stockModel.find(filter);
    res.json({
      message: "Stocks fetched successfully",
      count: stocks.length,
      stocks,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error fetching stocks", error });
  }
});

//get single stock detail
stockApp.get("/stocks/:id", async (req, res) => {
  try {
    const stock = await stockModel.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    res.json({ message: "Stock fetched successfully", stock });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock", error: error.message });
  }
});

//get stock price history (for charts)
stockApp.get("/stocks/:id/history", async (req, res) => {
  try {
    const stock = await stockModel.findById(req.params.id).select("stockName symbol priceHistory");
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    res.json({
      message: "Price history fetched successfully",
      stockName: stock.stockName,
      symbol: stock.symbol,
      priceHistory: stock.priceHistory
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching price history", error: error.message });
  }
});

//add new stock (admin only)
stockApp.post("/addStock", verifyToken("ADMIN"), async (req, res) => {
  try {
    const { stockid, stockName, symbol, price, category } = req.body;
    if (!stockName || !stockid || !symbol || !price) {
      return res.status(400).json({ message: "All fields required" });
    }
    const existing = await stockModel.findOne({ symbol });
    if (existing) {
      return res.status(400).json({ message: "Stock already exists" });
    }
    const stock = await stockModel.create({
      stockid,
      stockName,
      symbol,
      price,
      category: category || "General",
      priceHistory: [{ price, timestamp: new Date() }]
    });
    res.status(201).json({ message: "Stock added successfully", stock });
  } catch (error) {
    res.status(500).json({ message: "Error adding stock", error });
  }
});

//update stock price (admin only) — tracks price history + checks alerts + emits socket event
stockApp.put("/updateStock/:id", verifyToken("ADMIN"), async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    const stock = await stockModel.findById(id);
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    //calculate price change
    const oldPrice = stock.price;
    const priceChange = price - oldPrice;

    //push to price history
    stock.priceHistory.push({ price, timestamp: new Date() });
    stock.price = price;
    stock.priceChange = priceChange;
    await stock.save();

    // --- SOCKET.IO: Broadcast price update to all connected clients ---
    const io = req.app.get('io');
    if (io) {
      io.emit('stockPriceUpdate', {
        stockId: stock._id,
        symbol: stock.symbol,
        stockName: stock.stockName,
        oldPrice,
        newPrice: price,
        priceChange,
        timestamp: new Date()
      });
    }

    // --- ALERTS: Check and trigger matching price alerts ---
    const triggeredAlerts = [];
    const activeAlerts = await alertModel.find({ stockId: id, isTriggered: false });

    for (const alert of activeAlerts) {
      let shouldTrigger = false;

      if (alert.direction === "ABOVE" && price >= alert.targetPrice) {
        shouldTrigger = true;
      } else if (alert.direction === "BELOW" && price <= alert.targetPrice) {
        shouldTrigger = true;
      }

      if (shouldTrigger) {
        alert.isTriggered = true;
        await alert.save();
        triggeredAlerts.push(alert);

        //emit alert to the specific user via their room
        if (io) {
          io.to(alert.userId.toString()).emit('alertTriggered', {
            alertId: alert._id,
            stockId: stock._id,
            symbol: stock.symbol,
            stockName: stock.stockName,
            targetPrice: alert.targetPrice,
            currentPrice: price,
            direction: alert.direction,
            message: `${stock.symbol} has gone ${alert.direction.toLowerCase()} your target price of ₹${alert.targetPrice}. Current: ₹${price}`
          });
        }
      }
    }

    res.json({
      message: "Stock updated successfully",
      updatedStock: stock,
      alertsTriggered: triggeredAlerts.length
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Error updating stock",
      error: error.message,
    });
  }
});

export default stockApp;
