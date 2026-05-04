import exp from 'express';
import { userModel } from '../models/userModel.js';
import { Settings } from '../models/Settings.js';

const adminApp = exp.Router();

adminApp.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const loggedInUsers = await User.countDocuments({ isLoggedIn: true });
    const loggedOutUsers = await User.countDocuments({ isLoggedIn: false });

    const users = await User.find()
      .select("name email isLoggedIn lastLogin");
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
    res.status(500).json({ message: "Server Error", error });
  }
});

//list of all users
adminApp.get('/users', async (req, res) => {
  try {
    const users = await User.find().select("-password");
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
adminApp.get('/settings', async (req, res) => {
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

adminApp.put('/settings', async (req, res) => {
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


adminApp.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

adminApp.patch('/users/:id/block', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.status = "blocked";
    await user.save();
    res.json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error blocking user", error });
  }
});

adminApp.patch('/users/:id/unblock', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.status = "active";
    await user.save();
    res.json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unblocking user", error });
  }
});

export default adminApp;