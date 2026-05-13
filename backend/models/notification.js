import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const notificationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["TRADE", "SYSTEM", "ALERT"],
      default: "SYSTEM",
    },
    data: {
      type: Object, // Stores traderId, stockSymbol, etc.
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const notificationModel = model("Notification", notificationSchema);
