import exp from 'express';
import { transactionModel } from '../models/transaction.js';
import { userModel } from '../models/userModel.js';
import { stockModel } from '../models/stock.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const transactionApp = exp.Router();

//get all transactions (admin use — for user-specific, see userRoutes)
transactionApp.get('/transactions', verifyToken('ADMIN'), async(req, res) => {
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
    res.status(500).json({ message: "Error fetching transactions", error });
  }
});

export default transactionApp;