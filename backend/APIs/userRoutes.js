import exp from 'express';
import mongoose from 'mongoose';
import { userModel } from '../models/userModel.js';
import { stockModel } from '../models/stock.js';
import { portfolioModel } from '../models/portfolio.js';
import { transactionModel } from '../models/transaction.js';
import { alertModel } from '../models/alertModel.js';
import { Settings } from '../models/Settings.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { compare, hash } from 'bcryptjs';

const userApp = exp.Router();

//get user profile
userApp.get('/users/:id', verifyToken('TRADER'), async(req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.send(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
});

//get user balance
userApp.get('/users/balance/:id', verifyToken('TRADER'), async(req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.send({ balance: user.balance });
    } catch (error) {
        res.status(500).json({ message: "Error fetching balance", error: error.message });
    }
});

//update user profile
userApp.put('/users/:id', verifyToken('TRADER'), async(req, res) => {
    try {
        const id = req.params.id;
        const { name, email } = req.body;
        const user = await userModel.findByIdAndUpdate(id, { name, email }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.send(user);
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
});

//change password
userApp.put('/users/change-password/:id', verifyToken('TRADER'), async(req, res) => {
    try {
        const id = req.params.id;
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both current and new passwords are required" });
        }

        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password" });
        }

        const hashedPassword = await hash(newPassword, 12);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error changing password", error: error.message });
    }
});





//buy stock
userApp.post('/buy', verifyToken('TRADER'), async(req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId, stockId, quantity } = req.body;

        //validate input
        if (!userId || !stockId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: "userId, stockId, and a positive quantity are required" });
        }

        //check if trading is enabled
        const settings = await Settings.findOne().session(session);
        if (settings && !settings.tradingEnabled) {
            await session.abortTransaction();
            return res.status(403).json({ message: "Trading is currently disabled by admin" });
        }
        if (settings && settings.maintenanceMode) {
            await session.abortTransaction();
            return res.status(503).json({ message: "System is under maintenance. Try again later." });
        }

        //find the stock
        const stock = await stockModel.findById(stockId).session(session);
        if (!stock) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Stock not found" });
        }

        //calculate total cost
        const totalCost = stock.price * quantity;

        //find the user and check balance
        const user = await userModel.findById(userId).session(session);
        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({ message: "User not found" });
        }
        if (user.balance < totalCost) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance",
                required: totalCost,
                available: user.balance
            });
        }

        //deduct balance
        user.balance -= totalCost;
        await user.save({ session });

        //update or create portfolio entry
        let portfolio = await portfolioModel.findOne({ userId, stockId }).session(session);

        if (portfolio) {
            //recalculate weighted average buy price
            const totalOldValue = portfolio.avgBuyPrice * portfolio.quantity;
            const totalNewValue = stock.price * quantity;
            const newTotalQuantity = portfolio.quantity + quantity;
            portfolio.avgBuyPrice = (totalOldValue + totalNewValue) / newTotalQuantity;
            portfolio.quantity = newTotalQuantity;
            await portfolio.save({ session });
        } else {
            //create new portfolio entry
            portfolio = await portfolioModel.create([{
                userId,
                stockId,
                quantity,
                avgBuyPrice: stock.price
            }], { session });
        }

        //record the transaction
        const transaction = await transactionModel.create([{
            userId,
            stockId,
            type: "BUY",
            quantity,
            price: stock.price,
            totalAmount: totalCost
        }], { session });

        //commit all changes
        await session.commitTransaction();

        res.status(201).json({
            message: "Stock purchased successfully",
            transaction: transaction[0],
            newBalance: user.balance,
            portfolio: Array.isArray(portfolio) ? portfolio[0] : portfolio
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Buy error:", error);
        res.status(500).json({ message: "Error buying stock", error: error.message });
    } finally {
        session.endSession();
    }
});

//sell stock
userApp.post('/sell', verifyToken('TRADER'), async(req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId, stockId, quantity } = req.body;

        //validate input
        if (!userId || !stockId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: "userId, stockId, and a positive quantity are required" });
        }

        //check if trading is enabled
        const settings = await Settings.findOne().session(session);
        if (settings && !settings.tradingEnabled) {
            await session.abortTransaction();
            return res.status(403).json({ message: "Trading is currently disabled by admin" });
        }
        if (settings && settings.maintenanceMode) {
            await session.abortTransaction();
            return res.status(503).json({ message: "System is under maintenance. Try again later." });
        }

        //find the stock
        const stock = await stockModel.findById(stockId).session(session);
        if (!stock) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Stock not found" });
        }

        //check if user owns enough shares
        const portfolio = await portfolioModel.findOne({ userId, stockId }).session(session);
        if (!portfolio) {
            await session.abortTransaction();
            return res.status(400).json({ message: "You don't own this stock" });
        }
        if (portfolio.quantity < quantity) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient shares",
                requested: quantity,
                available: portfolio.quantity
            });
        }

        //calculate sale amount
        const saleAmount = stock.price * quantity;

        //add money to user balance
        const user = await userModel.findById(userId).session(session);
        user.balance += saleAmount;
        await user.save({ session });

        //update or remove portfolio entry
        if (portfolio.quantity === quantity) {
            //selling all shares — remove portfolio entry
            await portfolioModel.deleteOne({ _id: portfolio._id }).session(session);
        } else {
            //selling partial — reduce quantity, avgBuyPrice stays the same
            portfolio.quantity -= quantity;
            await portfolio.save({ session });
        }

        //record the transaction
        const transaction = await transactionModel.create([{
            userId,
            stockId,
            type: "SELL",
            quantity,
            price: stock.price,
            totalAmount: saleAmount
        }], { session });

        //commit all changes
        await session.commitTransaction();

        res.status(200).json({
            message: "Stock sold successfully",
            transaction: transaction[0],
            newBalance: user.balance,
            soldAmount: saleAmount
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Sell error:", error);
        res.status(500).json({ message: "Error selling stock", error: error.message });
    } finally {
        session.endSession();
    }
});

//add funds to wallet
userApp.post('/add-funds', verifyToken('TRADER'), async(req, res) => {
    try {
        const { userId, amount } = req.body;

        if (!userId || !amount || amount <= 0) {
            return res.status(400).json({ message: "userId and a positive amount are required" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.balance += amount;
        await user.save();

        res.json({
            message: "Funds added successfully",
            addedAmount: amount,
            newBalance: user.balance
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding funds", error: error.message });
    }
});


// PORTFOLIO & HISTORY

//get user portfolio with P/L
userApp.get('/portfolio/:userId', verifyToken('TRADER'), async(req, res) => {
    try {
        const { userId } = req.params;
        const portfolio = await portfolioModel
            .find({ userId })
            .populate('stockId', 'stockName symbol price priceChange');

        //calculate P/L for each stock
        const portfolioWithPL = portfolio.map(item => {
            const currentPrice = item.stockId?.price || 0;
            const currentValue = currentPrice * item.quantity;
            const investedValue = item.avgBuyPrice * item.quantity;
            const profitLoss = currentValue - investedValue;
            const profitLossPercent = investedValue > 0 ? ((profitLoss / investedValue) * 100).toFixed(2) : 0;

            return {
                _id: item._id,
                stock: item.stockId,
                quantity: item.quantity,
                avgBuyPrice: item.avgBuyPrice,
                currentValue,
                investedValue,
                profitLoss,
                profitLossPercent: Number(profitLossPercent)
            };
        });

        //total portfolio summary
        const totalInvested = portfolioWithPL.reduce((sum, item) => sum + item.investedValue, 0);
        const totalCurrentValue = portfolioWithPL.reduce((sum, item) => sum + item.currentValue, 0);
        const totalProfitLoss = totalCurrentValue - totalInvested;

        res.json({
            message: "Portfolio fetched successfully",
            portfolio: portfolioWithPL,
            summary: {
                totalInvested,
                totalCurrentValue,
                totalProfitLoss,
                totalProfitLossPercent: totalInvested > 0 ? Number(((totalProfitLoss / totalInvested) * 100).toFixed(2)) : 0
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching portfolio", error: error.message });
    }
});

//get user transaction history
userApp.get('/transactions/:userId', verifyToken('TRADER'), async(req, res) => {
    try {
        const { userId } = req.params;
        const transactions = await transactionModel
            .find({ userId })
            .populate('stockId', 'stockName symbol')
            .sort({ createdAt: -1 });

        res.json({
            message: "Transaction history fetched successfully",
            count: transactions.length,
            transactions
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching transactions", error: error.message });
    }
});


//get trader dashboard overview
userApp.get('/dashboard/:userId', verifyToken('TRADER'), async(req, res) => {
    try {
        const { userId } = req.params;

        //get user info
        const user = await userModel.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        //get portfolio with current values
        const portfolio = await portfolioModel
            .find({ userId })
            .populate('stockId', 'stockName symbol price priceChange');

        //calculate portfolio totals
        let totalInvested = 0;
        let totalCurrentValue = 0;

        const holdings = portfolio.map(item => {
            const currentPrice = item.stockId?.price || 0;
            const currentValue = currentPrice * item.quantity;
            const investedValue = item.avgBuyPrice * item.quantity;
            totalInvested += investedValue;
            totalCurrentValue += currentValue;

            return {
                stock: item.stockId,
                quantity: item.quantity,
                avgBuyPrice: item.avgBuyPrice,
                currentValue,
                profitLoss: currentValue - investedValue
            };
        });

        const totalProfitLoss = totalCurrentValue - totalInvested;

        //get recent 5 transactions
        const recentTransactions = await transactionModel
            .find({ userId })
            .populate('stockId', 'stockName symbol')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            message: "Dashboard data fetched successfully",
            dashboard: {
                user: {
                    name: user.name,
                    email: user.email,
                    balance: user.balance
                },
                portfolio: {
                    totalStocksOwned: portfolio.length,
                    totalInvested,
                    totalCurrentValue,
                    totalProfitLoss,
                    totalProfitLossPercent: totalInvested > 0 ? Number(((totalProfitLoss / totalInvested) * 100).toFixed(2)) : 0,
                    holdings
                },
                recentTransactions
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching dashboard", error: error.message });
    }
});

//get user's watchlist
userApp.get('/watchlist/:userId', verifyToken('TRADER'), async(req, res) => {
    try {
        const { userId } = req.params;
        const user = await userModel.findById(userId)
            .populate('watchlist', 'stockName symbol price priceChange category');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Watchlist fetched successfully",
            count: user.watchlist.length,
            watchlist: user.watchlist
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching watchlist", error: error.message });
    }
});

//add stock to watchlist
userApp.post('/watchlist/add', verifyToken('TRADER'), async(req, res) => {
    try {
        const { userId, stockId } = req.body;

        if (!userId || !stockId) {
            return res.status(400).json({ message: "userId and stockId are required" });
        }

        //check stock exists
        const stock = await stockModel.findById(stockId);
        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        //check if already in watchlist
        if (user.watchlist.includes(stockId)) {
            return res.status(400).json({ message: "Stock is already in your watchlist" });
        }

        user.watchlist.push(stockId);
        await user.save();

        res.status(201).json({
            message: "Stock added to watchlist",
            watchlist: user.watchlist
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding to watchlist", error: error.message });
    }
});

//remove stock from watchlist
userApp.delete('/watchlist/remove/:userId/:stockId', verifyToken('TRADER'), async(req, res) => {
    try {
        const { userId, stockId } = req.params;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const index = user.watchlist.indexOf(stockId);
        if (index === -1) {
            return res.status(400).json({ message: "Stock not in your watchlist" });
        }

        user.watchlist.splice(index, 1);
        await user.save();

        res.json({
            message: "Stock removed from watchlist",
            watchlist: user.watchlist
        });
    } catch (error) {
        res.status(500).json({ message: "Error removing from watchlist", error: error.message });
    }
});

// ========================
// PRICE ALERTS
// ========================

//get user's alerts
userApp.get('/alerts/:userId', verifyToken('TRADER'), async(req, res) => {
    try {
        const { userId } = req.params;
        const alerts = await alertModel
            .find({ userId })
            .populate('stockId', 'stockName symbol price')
            .sort({ createdAt: -1 });

        //separate active and triggered
        const active = alerts.filter(a => !a.isTriggered);
        const triggered = alerts.filter(a => a.isTriggered);

        res.json({
            message: "Alerts fetched successfully",
            totalCount: alerts.length,
            activeCount: active.length,
            triggeredCount: triggered.length,
            active,
            triggered
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching alerts", error: error.message });
    }
});

//create a new price alert
userApp.post('/alerts', verifyToken('TRADER'), async(req, res) => {
    try {
        const { userId, stockId, targetPrice, direction } = req.body;

        if (!userId || !stockId || !targetPrice || !direction) {
            return res.status(400).json({ message: "userId, stockId, targetPrice, and direction (ABOVE/BELOW) are required" });
        }

        if (!["ABOVE", "BELOW"].includes(direction)) {
            return res.status(400).json({ message: "direction must be ABOVE or BELOW" });
        }

        if (targetPrice <= 0) {
            return res.status(400).json({ message: "targetPrice must be positive" });
        }

        //check stock exists
        const stock = await stockModel.findById(stockId);
        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }

        //check for duplicate alert
        const existing = await alertModel.findOne({
            userId, stockId, targetPrice, direction, isTriggered: false
        });
        if (existing) {
            return res.status(400).json({ message: "You already have an identical active alert" });
        }

        const alert = await alertModel.create({
            userId, stockId, targetPrice, direction
        });

        res.status(201).json({
            message: `Alert created: notify when ${stock.symbol} goes ${direction.toLowerCase()} ₹${targetPrice}`,
            alert
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating alert", error: error.message });
    }
});

//delete an alert
userApp.delete('/alerts/:alertId', verifyToken('TRADER'), async(req, res) => {
    try {
        const { alertId } = req.params;
        const alert = await alertModel.findByIdAndDelete(alertId);

        if (!alert) {
            return res.status(404).json({ message: "Alert not found" });
        }

        res.json({ message: "Alert deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting alert", error: error.message });
    }
});

// ========================
// LEADERBOARD
// ========================

//get trading leaderboard (top 10 traders by portfolio profit)
userApp.get('/leaderboard', async(req, res) => {
    try {
        //get all traders (exclude admins)
        const traders = await userModel.find({ role: "TRADER" }).select('name email balance');

        const leaderboard = [];

        for (const trader of traders) {
            //get portfolio for this trader
            const portfolio = await portfolioModel
                .find({ userId: trader._id })
                .populate('stockId', 'price');

            //calculate current portfolio value and total invested
            let totalCurrentValue = 0;
            let totalInvested = 0;

            for (const item of portfolio) {
                const currentPrice = item.stockId?.price || 0;
                totalCurrentValue += currentPrice * item.quantity;
                totalInvested += item.avgBuyPrice * item.quantity;
            }

            //calculate realized profit from completed sells
            const sellTransactions = await transactionModel.find({
                userId: trader._id,
                type: "SELL"
            });
            const buyTransactions = await transactionModel.find({
                userId: trader._id,
                type: "BUY"
            });

            const totalSellValue = sellTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
            const totalBuyValue = buyTransactions.reduce((sum, t) => sum + t.totalAmount, 0);

            //total profit = (current portfolio value + cash from sells) - total money spent on buys
            //simplified: unrealized P/L + balance change from initial
            const unrealizedPL = totalCurrentValue - totalInvested;
            const totalProfit = unrealizedPL + (totalSellValue - totalBuyValue) + (totalCurrentValue - totalInvested);

            //simpler calculation: net worth - initial balance (10000)
            const netWorth = trader.balance + totalCurrentValue;
            const profit = netWorth - 10000; //assuming initial balance was 10000

            leaderboard.push({
                userId: trader._id,
                name: trader.name,
                email: trader.email,
                currentBalance: trader.balance,
                portfolioValue: totalCurrentValue,
                netWorth,
                profit,
                totalTrades: sellTransactions.length + buyTransactions.length
            });
        }

        //sort by profit (highest first) and take top 10
        leaderboard.sort((a, b) => b.profit - a.profit);
        const top10 = leaderboard.slice(0, 10);

        //add rank
        top10.forEach((entry, index) => {
            entry.rank = index + 1;
        });

        res.json({
            message: "Leaderboard fetched successfully",
            leaderboard: top10
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching leaderboard", error: error.message });
    }
});

export default userApp;
