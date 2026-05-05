import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const alertSchema = new Schema(
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
    targetPrice: {
      type: Number,
      required: [true, "Target price is required"],
    },
    direction: {
      type: String,
      enum: ["ABOVE", "BELOW"],
      required: [true, "Direction (ABOVE/BELOW) is required"],
    },
    isTriggered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const alertModel = model("Alert", alertSchema);
