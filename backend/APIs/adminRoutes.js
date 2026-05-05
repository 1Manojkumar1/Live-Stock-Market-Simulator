import exp from 'express';
import { userModel } from '../models/userModel.js';
import { transactionModel } from '../models/transaction.js';
import { stockModel } from '../models/stock.js';
import { Settings } from '../models/Settings.js';
import { verifyToken } from '../middlewares/verifyToken.js';

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
    res.json({
      message: "All Users",
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
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
        maintenanceMode: false
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings", error });
  }
});

//update global system settings (only admin can change app behavior like trading on/off, fees, etc.)
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

//block a user account (used when suspicious or unusual activity is detected)
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


//unblock a user account (admin re-enables access after review)
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