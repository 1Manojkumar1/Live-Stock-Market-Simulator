import exp from 'express';
import { userModel } from '../models/userModel.js';
import { transactionModel } from '../models/transaction.js';
import { stockModel } from '../models/stock.js';
import { Settings } from '../models/Settings.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { apiStatus } from '../services/marketSync.js';

const adminApp = exp.Router();

adminApp.get('/dashboard',verifyToken('ADMIN'),async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const loggedInUsers = await userModel.countDocuments({ isLoggedIn: true });
    const loggedOutUsers = await userModel.countDocuments({ isLoggedIn: false });

    const users = await userModel.find()
      .select("name email isLoggedIn lastLogin status balance");
    res.json({
      message: "Admin Dashboard",
      stats: {
        totalUsers,
        loggedInUsers,
        loggedOutUsers
      },
      users
    });

  } catch (error) { 
    console.error(error); 
    res.status(500).json({ message: "Server Error", error });
  }
});

//list of all users
adminApp.get('/users',verifyToken('ADMIN'),async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.json({ message: "All Users", count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

//active users
adminApp.get('/users/active',verifyToken('ADMIN'),async (req, res) => {
  try {
    const users = await userModel.find({ isLoggedIn: true }).select("-password");
    res.json({ message: "Active Users", count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching active users", error });
  }
});

//idle users
adminApp.get('/users/idle',verifyToken('ADMIN'),async (req, res) => {
  try {
    const users = await userModel.find({ isLoggedIn: false }).select("-password");
    res.json({ message: "Idle Users", count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching idle users", error });
  }
});

//restricted users
adminApp.get('/users/restricted',verifyToken('ADMIN'),async (req, res) => {
  try {
    const users = await userModel.find({ status: "blocked" }).select("-password");
    res.json({ message: "Restricted Users", count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching restricted users", error });
  }
});


//admin Settings
adminApp.get('/settings',verifyToken('ADMIN'),async (req, res) => {
  try {
    let settings = await Settings.findOne();

    // If no settings exist, create default
    if (!settings) {
      settings = await Settings.create({
        tradingEnabled: true,
        defaultBalance: 10000,
        transactionFeePercent: 1,
        maintenanceMode: false,
        weeklyReward1st: 1000,
        weeklyReward2nd: 500,
        weeklyReward3rd: 250,
        weeklyDistributionDay: 0,
        monthlyReward1st: 5000,
        monthlyReward2nd: 2500,
        monthlyReward3rd: 1000,
        monthlyDistributionDate: 1
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings", error });
  }
});

//update global system settings
adminApp.put('/settings',verifyToken('ADMIN'),async (req, res) => {
  try {
    const updated = await Settings.findOneAndUpdate( {},req.body,{ new: true, upsert: true });
    res.json({
      message: "Settings updated successfully",
      settings: updated
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating settings", error });
  }
});

// Distribute Rewards (Weekly or Monthly)
adminApp.post('/rewards/distribute', verifyToken('ADMIN'), async (req, res) => {
  try {
    const { type } = req.body; // 'weekly' or 'monthly'
    if (!['weekly', 'monthly'].includes(type)) {
        return res.status(400).json({ message: "Invalid reward type" });
    }

    const settings = await Settings.findOne();
    const rewards = type === 'weekly' 
        ? [settings?.weeklyReward1st || 1000, settings?.weeklyReward2nd || 500, settings?.weeklyReward3rd || 250]
        : [settings?.monthlyReward1st || 5000, settings?.monthlyReward2nd || 2500, settings?.monthlyReward3rd || 1000];

    // Fetch all users with their portfolios to calculate net worth
    const users = await userModel.find();
    const stocks = await stockModel.find();
    
    const stockPriceMap = stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price }), {});

    const userPerformances = users.map(user => {
      let portfolioValue = 0;
      user.portfolio.forEach(holding => {
        portfolioValue += holding.quantity * (stockPriceMap[holding.symbol] || 0);
      });
      const netWorth = user.balance + portfolioValue;
      return { userId: user._id, netWorth };
    });

    // Sort by net worth and take top 3
    const topTraders = userPerformances
      .sort((a, b) => b.netWorth - a.netWorth)
      .slice(0, 3);

    // Apply tiered rewards
    for (let i = 0; i < topTraders.length; i++) {
      await userModel.findByIdAndUpdate(topTraders[i].userId, {
        $inc: { balance: rewards[i] }
      });
    }

    // Update last distribution date
    const updateField = type === 'weekly' ? 'lastWeeklyDistribution' : 'lastMonthlyDistribution';
    await Settings.findOneAndUpdate({}, { [updateField]: new Date() });

    res.json({
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} rewards distributed successfully to top ${topTraders.length} traders`,
      rewards: {
        '1st': rewards[0],
        '2nd': rewards[1],
        '3rd': rewards[2]
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error distributing rewards", error });
  }
});


// System Health (API Rate Limits)
adminApp.get('/health', verifyToken('ADMIN'), async (req, res) => {
  try {
    res.json({
      finnhub: apiStatus,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching system health", error });
  }
});

//view all transactions (admin)
adminApp.get('/transactions', verifyToken('ADMIN'), async (req, res) => {
  try {
    const transactions = await transactionModel
      .find()
      .populate('userId', 'name email')
      .populate('stockId', 'stockName symbol')
      .sort({ createdAt: -1 });

    res.json({
      message: "All transactions fetched successfully",
      count: transactions.length,
      transactions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching transactions", error });
  }
});

//block a user account
adminApp.patch('/users/:id/block', verifyToken('ADMIN'), async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.status = "blocked";
    await user.save();
    res.json({ message: "User blocked successfully" });
  } catch (error) { 
    console.error(error); 
    res.status(500).json({ message: "Error blocking user", error });
  }
});


//unblock a user account
adminApp.patch('/users/:id/unblock', verifyToken('ADMIN'), async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.status = "active";
    await user.save();
    res.json({ message: "User unblocked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error unblocking user", error });
  }
});

export default adminApp;