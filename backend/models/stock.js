import { Schema, model } from "mongoose";

const stockSchema = new Schema(
  {
    stockid: {
      type: Number,
      required: [true, "id is required"],
    },
    stockName: {
      type: String,
      required: [true, "name is required"],
    },
    symbol: {
      type: String,
      required: [true, "symbol is required"],
      unique: true,
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    priceChange: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      default: "General",
    },
    priceHistory: [
      {
        price: Number,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export const stockModel = model("Stock", stockSchema);
