import exp from "express";
import { stockModel } from "../models/stock.js";
import { alertModel } from "../models/alertModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import fetch from 'node-fetch';


const stockApp = exp.Router();

// Helper to generate mock historical data for new stocks
const generateMockHistory = (basePrice, count = 20, period = '1D') => {
    const history = [];
    const now = Date.now();
    let currentPrice = basePrice;
    
    // Adjust volatility based on period
    const volatility = period === '1Y' ? 0.05 : period === '1M' ? 0.03 : period === '1W' ? 0.02 : 0.01;
    const interval = period === '1Y' ? 86400000 : period === '1M' ? 7200000 : period === '1W' ? 3600000 : 60000;

    for (let i = count; i >= 0; i--) {
        const change = (Math.random() - 0.5) * 2 * volatility;
        currentPrice = currentPrice * (1 + change);
        
        if (currentPrice < basePrice * 0.5) currentPrice = basePrice * 0.5;
        if (currentPrice > basePrice * 1.5) currentPrice = basePrice * 1.5;

        history.push({
            price: Number(currentPrice.toFixed(2)),
            timestamp: new Date(now - i * interval)
        });
    }
    return history;
};

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
      //get stocks
    const stocks = await stockModel.find(filter);
    res.json({
      message: "Stocks fetched successfully",
      count: stocks.length,
      stocks,
    }); 
  } catch (error) { 
    //error
    console.log(error.message);
    res.status(500).json({ message: "Error fetching stocks", error });
  }
});

//get single stock detail
stockApp.get("/stocks/:id", async (req, res) => {
  try { 
    //get stock
    const stock = await stockModel.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    res.json({ message: "Stock fetched successfully", stock });
  } catch (error) {
    //  error
    res.status(500).json({ message: "Error fetching stock", error: error.message });
  }
});

//get stock price history (for charts)
stockApp.get("/stocks/:id/history", async (req, res) => {
  try {
    const { period = '1D' } = req.query;
    const stock = await stockModel.findById(req.params.id).select("stockName symbol priceHistory price");
    
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    let history = stock.priceHistory;

    // Filter or generate based on period
    if (period === '1W') {
      history = generateMockHistory(stock.price, 100, '1W');
    } else if (period === '1M') {
      history = generateMockHistory(stock.price, 200, '1M');
    } else if (period === '1Y') {
      history = generateMockHistory(stock.price, 365, '1Y');
    }

    res.json({
      message: "Price history fetched successfully",
      stockName: stock.stockName,
      symbol: stock.symbol,
      priceHistory: history
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching price history", error: error.message });
  }
});

//add new stock (admin only)
stockApp.post("/addStock", verifyToken("ADMIN"), async (req, res) => {
  try { 
    //add stock
    const { stockid, stockName, symbol, price, category } = req.body;
    if (!stockName || !stockid || !symbol || !price) {
      return res.status(400).json({ message: "All fields required" });
    }
    //check if stock already exists
    const existing = await stockModel.findOne({ symbol });
    if (existing) {
      return res.status(400).json({ message: "Stock already exists" });
    }
    //create stock
    const stock = await stockModel.create({
      stockid,
      stockName,
      symbol,
      price,
      category: category || "General",
      priceHistory: generateMockHistory(price)
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
    //get stock
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
    //error
    console.log(error.message);
    res.status(500).json({
      message: "Error updating stock",
      error: error.message,
    });
  }
});

// Helper to fetch a live price from Finnhub
const getFinnhubQuote = async (symbol) => { 
  //fetch from finnhub
    const apiKey = process.env.FINNHUB_API_KEY;
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`; 
    //const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Finnhub request failed with status ${response.status}`);
    }
    return await response.json(); // { c: current, h: high, l: low, ... }
};

// route: GET real-time external price for a symbol (optional check)
stockApp.get('/external-price/:symbol', async (req, res) => {
    try { 
        //fetch from finnhub
        const data = await getFinnhubQuote(req.params.symbol);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching external data", error: err.message });
    }
});

// route: GET search for any ticker globally via Finnhub
stockApp.get('/search-external', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ message: "Search query required" });
        //fetch from finnhub
        const apiKey = process.env.FINNHUB_API_KEY;
        const response = await fetch(`https://finnhub.io/api/v1/search?q=${encodeURIComponent(q)}&token=${apiKey}`);
        const data = await response.json();

        // Filter for equities/stocks only for better UX
        const results = (data.result || []).filter(item => item.type === 'Common Stock' || item.type === 'ADR');
        
        res.json({ results });
    } catch (err) {
        res.status(500).json({ message: "Error searching Finnhub", error: err.message });
    }
});

// route: POST bootstrap a new stock from Finnhub into local DB
stockApp.post('/bootstrap-stock', verifyToken("TRADER"), async (req, res) => {
    try {
        const { symbol } = req.body;
        if (!symbol) return res.status(400).json({ message: "Symbol required" });

        // Check if already exists
        const existing = await stockModel.findOne({ symbol: symbol.toUpperCase() });
        if (existing) return res.json({ message: "Stock already tracked", stock: existing });

        const apiKey = process.env.FINNHUB_API_KEY;
        
        // Fetch quote for current price
        const quoteRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
        const quoteData = await quoteRes.json();
        
        if (!quoteData.c) return res.status(404).json({ message: "Stock price not found on Finnhub" });

        // Fetch profile for stock name
        const profileRes = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`);
        const profileData = await profileRes.json();

        const stock = await stockModel.create({
            stockid: `STK-${Date.now()}`,
            stockName: profileData.name || symbol,
            symbol: symbol.toUpperCase(),
            price: quoteData.c,
            priceChange: quoteData.d || 0,
            category: profileData.finnhubIndustry || "General",
            logo: profileData.logo,
            priceHistory: generateMockHistory(quoteData.c)
        });

        res.status(201).json({ message: "Stock bootstrapped successfully", stock });
    } catch (err) {
        res.status(500).json({ message: "Error bootstrapping stock", error: err.message });
    }
});

// route: GET unique categories from tracked stocks
stockApp.get('/categories', async (req, res) => {
    try { 
      //fetch from finnhub 
        const categories = await stockModel.distinct('category');
        res.json({ categories });
    } catch (err) {
        res.status(500).json({ message: "Error fetching categories", error: err.message });
    }
});

export default stockApp;


