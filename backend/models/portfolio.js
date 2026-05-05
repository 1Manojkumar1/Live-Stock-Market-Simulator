import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const portfolioSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, "quantity is required"],
    },
    avgBuyPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const portfolioModel = model("Portfolio", portfolioSchema);
