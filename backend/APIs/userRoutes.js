import exp from 'express';
import { userModel } from '../models/userModel.js';
import { stockModel } from '../models/stock.js';
import { portfolioModel } from '../models/portfolio.js';
import { transactionModel } from '../models/transaction.js';
import { alertModel } from '../models/alertModel.js';
import { Settings } from '../models/Settings.js';
import { followModel } from '../models/follow.js';
import { notificationModel } from '../models/notification.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { compare, hash } from 'bcryptjs';

const userApp = exp.Router();

//get user profile
userApp.get('/users/:id', verifyToken('TRADER'), async(req, res) => {
    try { 
        //console.log(req.params.id);
        const id = req.params.id; 
       // console.log(id);
        const user = await userModel.findById(id).select('-password'); 
        //console.log(user);
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
        //console.log(req.params.id);
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
        //console.log(user);
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
        //console.log(currentPassword, newPassword);
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both current and new passwords are required" });
        }
      //  console.log(id);
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }// console.log(user); 

        const isMatch = await compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password" });
        }
        //console.log(isMatch);

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
    try {
        const { userId, stockId, quantity } = req.body;
       // console.log(userId, stockId, quantity);
        if (!userId || !stockId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: "userId, stockId, and a positive quantity are required" });
        }

        const settings = await Settings.findOne();
        if (settings && !settings.tradingEnabled) {
            return res.status(403).json({ message: "Trading is currently disabled by admin" });
        }
        if (settings && settings.maintenanceMode) {
            return res.status(503).json({ message: "System is under maintenance. Try again later." });
        }
            // console.log(settings);
        const stock = await stockModel.findById(stockId);
        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }

        const totalCost = stock.price * quantity;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // checks whether user has enough balance
        if (user.balance < totalCost) {
            return res.status(400).json({
                message: "Insufficient balance",
                required: totalCost,
                available: user.balance
            });
        }

        user.balance -= totalCost;
        await user.save();

        let portfolio = await portfolioModel.findOne({ userId, stockId });
  //      console.log(portfolio);
        if (portfolio) {
            const totalOldValue = portfolio.avgBuyPrice * portfolio.quantity;
            const totalNewValue = stock.price * quantity;
            const newTotalQuantity = portfolio.quantity + quantity;
            portfolio.avgBuyPrice = (totalOldValue + totalNewValue) / newTotalQuantity;
            portfolio.quantity = newTotalQuantity;
            await portfolio.save();
        } else { 
                //console.log(portfolio);
            portfolio = await portfolioModel.create({
                userId,
                stockId,
                quantity,
                avgBuyPrice: stock.price
            });
        }
         //console.log(portfolio);
        const transaction = await transactionModel.create({
            userId,
            stockId,
            type: "BUY",
            quantity,
            price: stock.price,
            totalAmount: totalCost
        });

        res.status(201).json({
            message: "Stock purchased successfully",
            transaction,
            newBalance: user.balance
        });

        // SOCIAL NOTIFICATION: Notify followers
        const io = req.app.get('io');
        if (io) {
            const followers = await followModel.find({ followingId: userId });
            followers.forEach(async (f) => {
                // Save persistent notification
                await notificationModel.create({
                    userId: f.followerId,
                    title: "New Trade Followed",
                    message: `${user.name} just purchased ${quantity} shares of ${stock.symbol} at ₹${stock.price}`,
                    type: 'TRADE',
                    data: { traderId: userId, stockSymbol: stock.symbol, action: 'BUY' }
                });

                io.to(f.followerId.toString()).emit('socialNotification', {
                    type: 'TRADE',
                    traderName: user.name,
                    traderId: userId,
                    action: 'BUY',
                    stockSymbol: stock.symbol,
                    quantity,
                    timestamp: new Date()
                });
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error buying stock", error: error.message });
    }
});

//sell stock 
userApp.post('/sell', verifyToken('TRADER'), async(req, res) => {
    try {
        const { userId, stockId, quantity } = req.body;

        if (!userId || !stockId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: "userId, stockId, and a positive quantity are required" });
        }

        const settings = await Settings.findOne();
        if (settings && !settings.tradingEnabled) {
            return res.status(403).json({ message: "Trading is currently disabled by admin" });
        }
        if (settings && settings.maintenanceMode) {
            return res.status(503).json({ message: "System is under maintenance. Try again later." });
        }

        const stock = await stockModel.findById(stockId);
        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }

        const portfolio = await portfolioModel.findOne({ userId, stockId });
        if (!portfolio) {
            return res.status(400).json({ message: "You don't own this stock" });
        } 
        // checks whether user has enough shares
        if (portfolio.quantity < quantity) {
            return res.status(400).json({
                message: "Insufficient shares",
                requested: quantity,
                available: portfolio.quantity
            });
        }
//        console.log(portfolio);
        const saleAmount = stock.price * quantity;
        const profit = saleAmount - (portfolio.avgBuyPrice * quantity);
        // Update balance
        const user = await userModel.findById(userId);
        user.balance += saleAmount;
        
        // Update scores
        user.weeklyScore = (user.weeklyScore || 0) + profit;
        user.monthlyScore = (user.monthlyScore || 0) + profit;
        user.totalProfit = (user.totalProfit || 0) + profit;
          //console.log(user);
        await user.save();
//        console.log(user);
        if (portfolio.quantity === quantity) {
            await portfolioModel.deleteOne({ _id: portfolio._id });
        } else {
            portfolio.quantity -= quantity;
            await portfolio.save();
        }

        // Create transaction
        const transaction = await transactionModel.create({
            userId,
            stockId,
            type: "SELL",
            quantity,
            price: stock.price,
            totalAmount: saleAmount
        });
        //console.log(transaction);
        res.status(200).json({
            message: "Stock sold successfully",
            transaction,
            newBalance: user.balance,
            soldAmount: saleAmount
        });

        // SOCIAL NOTIFICATION: Notify followers
        const io = req.app.get('io');
        if (io) {
            const followers = await followModel.find({ followingId: userId });
            followers.forEach(async (f) => {
                // Save persistent notification
                await notificationModel.create({
                    userId: f.followerId,
                    title: "New Trade Followed",
                    message: `${user.name} just sold ${quantity} shares of ${stock.symbol} at ₹${stock.price}`,
                    type: 'TRADE',
                    data: { traderId: userId, stockSymbol: stock.symbol, action: 'SELL' }
                });

                io.to(f.followerId.toString()).emit('socialNotification', {
                    type: 'TRADE',
                    traderName: user.name,
                    traderId: userId,
                    action: 'SELL',
                    stockSymbol: stock.symbol,
                    quantity,
                    timestamp: new Date()
                });
            });
        }

    } catch (error) {
        console.error("Sell error:", error);
        res.status(500).json({ message: "Error selling stock", error: error.message });
    }
});

//add funds to wallet
userApp.post('/add-funds', verifyToken('TRADER'), async(req, res) => {
    try {
        const { userId, amount } = req.body;
        //console.log(userId, amount);
        if (!userId || !amount || amount <= 0) {
            return res.status(400).json({ message: "userId and a positive amount are required" });
        }
//        console.log(userId, amount);
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
//        console.log(user);
        user.balance += amount;
        await user.save();
        //console.log(user);
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
            //console.log(item);
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
        //console.log(totalProfitLoss);
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
        //console.log(req.params);
        const { userId } = req.params;
        //console.log(userId);
        const transactions = await transactionModel
            .find({ userId })
            .populate('stockId', 'stockName symbol')
            .sort({ createdAt: -1 });
//        console.log(transactions);
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
            //console.log(item);
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

//get user's watchlist (stocks they own)
userApp.get('/watchlist/:userId', verifyToken('TRADER'), async(req, res) => {
    try {
        const { userId } = req.params;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
//        console.log(user);
        const portfolio = await portfolioModel
            .find({ userId, quantity: { $gt: 0 } })
            .populate('stockId', 'stockName symbol price priceChange category');
//        console.log(portfolio);
        const watchlist = portfolio
            .filter(p => p.stockId)
            .map(p => ({
                _id: p.stockId._id,
                stockName: p.stockId.stockName,
                symbol: p.stockId.symbol,
                price: p.stockId.price,
                priceChange: p.stockId.priceChange,
                category: p.stockId.category,
                quantity: p.quantity,
                avgBuyPrice: p.avgBuyPrice
            }));

        res.json({
            message: "Watchlist fetched successfully",
            count: watchlist.length,
            watchlist
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching watchlist", error: error.message });
    }
});

// ========================
// PRICE ALERTS
// ========================

//get user's alerts
userApp.get('/alerts/:userId', verifyToken('TRADER'), async(req, res) => {
    try {
        const { userId } = req.params;
        //console.log(userId);
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
        //check direction
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
        //create alert
        const alert = await alertModel.create({
            userId, stockId, targetPrice, direction
        });
         //console.log(alert);
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
        //console.log(req.params);
        const { alertId } = req.params;
        const alert = await alertModel.findByIdAndDelete(alertId);
//        console.log(alert);
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

// Helper to calculate a user's current net worth (balance + holdings).
const calculateNetWorth = (user, userPortfolios) => {
    let holdingsValue = 0; 
    //console.log(userPortfolios);
    if (userPortfolios) {
        userPortfolios.forEach(item => {
            if (item.stockId && item.stockId.price) {
                holdingsValue += item.quantity * item.stockId.price;
            }
        });
    }
    return user.balance + holdingsValue;
};

// get trading leaderboard
userApp.get('/leaderboard', async (req, res) => {
    try {
        const { period = 'all' } = req.query; // 'all', 'weekly', 'monthly'

        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        //console.log(startOfWeek);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);

        // Fetch all portfolios and populate stock data to calculate accurate net worth
        const allPortfolios = await portfolioModel.find().populate('stockId', 'price');
        const groupedPortfolios = {};
        allPortfolios.forEach(p => {
            const uId = p.userId.toString();
            if (!groupedPortfolios[uId]) groupedPortfolios[uId] = [];
            groupedPortfolios[uId].push(p);
        });

        // Lazy snapshot resets – if the stored reset timestamp is older, capture a new snapshot of net worth.
        const allTraders = await userModel.find({ role: "TRADER" });
        for (const trader of allTraders) {
            const netWorth = calculateNetWorth(trader, groupedPortfolios[trader._id.toString()]);
            if (trader.lastWeeklyReset < startOfWeek) {
                trader.weeklyNetWorthSnapshot = netWorth;
                trader.lastWeeklyReset = now;
                await trader.save();
            }
            if (trader.lastMonthlyReset < startOfMonth) {
                trader.monthlyNetWorthSnapshot = netWorth;
                trader.lastMonthlyReset = now;
                await trader.save();
            }
        }

        // Determine which base snapshot to use for ROI.
        let baseField = 'totalDeposited'; // default for all‑time
        if (period === 'weekly') baseField = 'weeklyNetWorthSnapshot';
        if (period === 'monthly') baseField = 'monthlyNetWorthSnapshot';
       
        const traders = await userModel
            .find({ role: "TRADER" })
            .select(`name email balance ${baseField} totalDeposited`)
            .lean();

        const leaderboard = traders
            .map((trader) => {
                const netWorth = calculateNetWorth(trader, groupedPortfolios[trader._id.toString()]);
                const base = trader[baseField] || trader.totalDeposited || 10000;
                const roi = ((netWorth - base) / base) * 100;
                const profitAmount = netWorth - base;
                return {
                    userId: trader._id,
                    name: trader.name,
                    email: trader.email,
                    balance: trader.balance,
                    netWorth: Number(netWorth.toFixed(2)),
                    roi: Number(roi.toFixed(2)),
                    profitAmount: Number(profitAmount.toFixed(2)),
                    period,
                };
            })
            .filter((trader) => trader.roi > 0)
            .sort((a, b) => b.roi - a.roi)
            .slice(0, 20)
            .map((trader, idx) => ({ ...trader, rank: idx + 1 }));

        res.json({
            message: `${period.charAt(0).toUpperCase() + period.slice(1)} leaderboard fetched successfully`,
            period,
            leaderboard,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching leaderboard", error: error.message });
    }
});



// ========================
// AI TRADING BEHAVIOR ANALYZER
// ========================

const analyzeUserTrades = (transactions) => {
    if (!transactions || transactions.length < 3) {
        return {
            behaviorType: "Inconspicuous",
            summary: "Not enough trading data to form a behavioral profile. Keep trading to see your AI insights!",
            mistakes: ["Insufficient data for analysis."],
            suggestions: ["Execute at least 5-10 trades to unlock deep behavioral insights."],
            scores: { discipline: 50, riskManagement: 50, emotionalStability: 50 }
        };
    }

    let discipline = 80;
    let riskManagement = 75;
    let emotionalStability = 70;
    const mistakes = [];
    const suggestions = [];
    
    // Analysis variables
    const sortedTrades = [...transactions].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const recentTrades = sortedTrades.slice(-10);
    
    let fomoCount = 0;
    let panicCount = 0;
    let revengeCount = 0;
    let overtradingCount = 0;

    // Detect Overtrading (High frequency)
    const timeDiffs = [];
    for (let i = 1; i < recentTrades.length; i++) {
        const diff = (new Date(recentTrades[i].createdAt) - new Date(recentTrades[i-1].createdAt)) / (1000 * 60); // minutes
        timeDiffs.push(diff);
        if (diff < 5) overtradingCount++;
    }
    
    if (overtradingCount > 3) {
        discipline -= 20;
        emotionalStability -= 15;
        mistakes.push("Trading too frequently in short bursts.");
        suggestions.push("Wait at least 30 minutes between trades to avoid emotional noise.");
    }

    // Detect Revenge Trading (Buying immediately after a sell/loss - simplified logic)
    for (let i = 1; i < transactions.length; i++) {
        const prev = transactions[i-1];
        const curr = transactions[i];
        const timeDiff = (new Date(curr.createdAt) - new Date(prev.createdAt)) / (1000 * 60);
        
        if (prev.type === "SELL" && curr.type === "BUY" && timeDiff < 10) {
            revengeCount++;
        }
    }

    if (revengeCount > 1) {
        emotionalStability -= 25;
        discipline -= 15;
        mistakes.push("Trying to 'win back' money immediately after closing a position.");
        suggestions.push("If a trade goes against you, step away from the screen for an hour.");
    }

    // Risk Management Check (Position sizing)
    const avgTotalAmount = transactions.reduce((sum, t) => sum + t.totalAmount, 0) / transactions.length;
    const largeTrades = transactions.filter(t => t.totalAmount > avgTotalAmount * 2.5).length;
    
    if (largeTrades > 0) {
        riskManagement -= 30;
        mistakes.push("Allocating too much capital to single trades ('All-in' mentality).");
        suggestions.push("Never risk more than 5-10% of your total balance on one stock.");
    }

    // Behavior Classification
    let behaviorType = "Rational Observer";
    let summary = "You generally maintain a steady hand and follow a consistent pattern.";

    if (revengeCount > 1 || emotionalStability < 50) {
        behaviorType = "Emotional Trader";
        summary = "Your trading is heavily influenced by recent wins or losses, leading to impulsive entries.";
    } else if (overtradingCount > 3) {
        behaviorType = "Over-Active Scalper";
        summary = "You are chasing every micro-movement, which increases your risk and mental fatigue.";
    } else if (riskManagement < 50) {
        behaviorType = "Aggressive Gambler";
        summary = "You take massive positions relative to your balance, risking total wipeout for quick gains.";
    } else if (discipline > 85 && riskManagement > 80) {
        behaviorType = "Disciplined Strategist";
        summary = "You trade with purpose, controlled sizes, and patient timing. Excellent work!";
    }

    return {
        behaviorType,
        summary,
        mistakes: mistakes.length > 0 ? mistakes : ["No major behavioral red flags detected yet."],
        suggestions: suggestions.length > 0 ? suggestions : ["Keep following your current plan and stay patient."],
        scores: { 
            discipline: Math.max(10, discipline), 
            riskManagement: Math.max(10, riskManagement), 
            emotionalStability: Math.max(10, emotionalStability) 
        }
    };
};

userApp.get('/analyze/:userId', verifyToken('TRADER', 'ADMIN'), async (req, res) => {
    try {
        const { userId } = req.params;
        const transactions = await transactionModel.find({ userId }).sort({ createdAt: -1 });
        
        const report = analyzeUserTrades(transactions);
        
        res.json({
            message: "Behavioral analysis completed",
            report
        });
    } catch (error) {
        res.status(500).json({ message: "Error analyzing behavior", error: error.message });
    }
});

// ========================
// SOCIAL & PUBLIC PROFILES
// ========================

// Get public profile
userApp.get('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userModel.findById(userId).select('name email totalProfit totalDeposited balance createdAt');
        if (!user) return res.status(404).json({ message: "User not found" });

        const portfolio = await portfolioModel.find({ userId }).populate('stockId', 'stockName symbol price category');
        
        // Calculate sentiment (based on last 10 trades)
        const recentTrades = await transactionModel.find({ userId }).sort({ createdAt: -1 }).limit(10).populate('stockId', 'symbol stockName');
        const buyCount = recentTrades.filter(t => t.type === 'BUY').length;
        const sentiment = buyCount >= 6 ? 'BULLISH' : buyCount <= 4 ? 'BEARISH' : 'NEUTRAL';

        // Calculate ROI
        const allPortfolios = await portfolioModel.find({ userId }).populate('stockId', 'price');
        let holdingsValue = 0;
        allPortfolios.forEach(p => { if(p.stockId) holdingsValue += p.quantity * p.stockId.price; });
        const netWorth = user.balance + holdingsValue;
        const roi = ((netWorth - user.totalDeposited) / user.totalDeposited) * 100;

        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                joinedAt: user.createdAt,
                sentiment,
                roi: Number(roi.toFixed(2))
            },
            holdings: portfolio.map(p => ({
                symbol: p.stockId?.symbol,
                name: p.stockId?.stockName,
                quantity: p.quantity,
                category: p.stockId?.category
            })).filter(h => h.symbol),
            recentActivity: recentTrades.map(t => ({
                type: t.type,
                symbol: t.stockId?.symbol,
                name: t.stockId?.stockName,
                price: t.price,
                timestamp: t.createdAt
            }))
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
});

// Follow a user
userApp.post('/follow', verifyToken('TRADER'), async (req, res) => {
    try {
        const { followerId, followingId } = req.body;
        if (followerId === followingId) return res.status(400).json({ message: "You cannot follow yourself" });

        await followModel.create({ followerId, followingId });
        res.status(201).json({ message: "Followed successfully" });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ message: "Already following this user" });
        res.status(500).json({ message: "Error following user", error: error.message });
    }
});

// Unfollow a user
userApp.post('/unfollow', verifyToken('TRADER'), async (req, res) => {
    try {
        const { followerId, followingId } = req.body;
        await followModel.deleteOne({ followerId, followingId });
        res.json({ message: "Unfollowed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error unfollowing user", error: error.message });
    }
});

// Check follow status
userApp.get('/follow-status', verifyToken('TRADER', 'ADMIN'), async (req, res) => {
    try {
        const { followerId, followingId } = req.query;
        const follow = await followModel.findOne({ followerId, followingId });
        res.json({ isFollowing: !!follow });
    } catch (error) {
        res.status(500).json({ message: "Error checking status", error: error.message });
    }
});

// Rescue Reset: Reset balance to 1,00,000 if balance < 5000 and portfolio is empty
userApp.post('/rescue-reset', verifyToken('TRADER'), async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check conditions
        const portfolioCount = await portfolioModel.countDocuments({ userId, quantity: { $gt: 0 } });
        if (user.balance >= 5000) {
            return res.status(400).json({ message: "Balance is still above ₹5,000. You don't need a rescue yet!" });
        }
        if (portfolioCount > 0) {
            return res.status(400).json({ message: "You still have active stock holdings. Sell them first!" });
        }

        // Perform Reset
        const INITIAL_FUNDS = 100000;
        user.balance = INITIAL_FUNDS;
        user.totalDeposited = INITIAL_FUNDS;
        user.weeklyNetWorthSnapshot = INITIAL_FUNDS;
        user.monthlyNetWorthSnapshot = INITIAL_FUNDS;
        user.lastWeeklyReset = new Date();
        user.lastMonthlyReset = new Date();
        
        await user.save();

        res.json({ 
            message: "Rescue operation successful! Your balance is restored to ₹1,00,000.", 
            newBalance: user.balance 
        });
    } catch (error) {
        res.status(500).json({ message: "Rescue failed", error: error.message });
    }
});

// Notifications Endpoints
userApp.get('/notifications/:userId', verifyToken('TRADER', 'ADMIN'), async (req, res) => {
    try {
        const notifications = await notificationModel.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json({ notifications });
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications", error: error.message });
    }
});

userApp.delete('/notifications/:id', verifyToken('TRADER'), async (req, res) => {
    try {
        await notificationModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Notification deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting notification", error: error.message });
    }
});

userApp.delete('/notifications/clear/:userId', verifyToken('TRADER'), async (req, res) => {
    try {
        await notificationModel.deleteMany({ userId: req.params.userId });
        res.json({ message: "All notifications cleared" });
    } catch (error) {
        res.status(500).json({ message: "Error clearing notifications", error: error.message });
    }
});

export default userApp;
