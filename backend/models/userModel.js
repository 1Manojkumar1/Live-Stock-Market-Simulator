import { Schema, model } from "mongoose";
import mongoose from "mongoose";
// import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    name:{
      type: String,
      required: [true, "NAME IS REQUIRED"],
    },
    email:{
      type: String,
      unique: true,
      required: [true, "EMAIL IS REQUIRED"],
    },
    password:{
      type: String,
      required: [true, "PASSWORD IS REQUIRED"],
    },
    role:{
      type: String,
      enum: ["ADMIN", "TRADER"],
      default: "TRADER",
    },
    balance:{
      type: Number,
      default: 100000,
    },
    status:{
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
    isLoggedIn:{
      type: Boolean,
      default: false,
    },
    lastLogin:{
      type: Date,
    },
    watchlist:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stock",
      },
    ],

    // === LEADERBOARD: NET WORTH SNAPSHOT SYSTEM ===

    // Total money ever deposited (initial + add-funds), used for all-time ROI base
    totalDeposited: {
      type: Number,
      default: 100000,
    },

    // Net Worth snapshots taken at the START of each period.
    // ROI = ((currentNetWorth - snapshotNetWorth) / snapshotNetWorth) * 100
    weeklyNetWorthSnapshot: {
      type: Number,
      default: 100000,
    },
    monthlyNetWorthSnapshot: {
      type: Number,
      default: 100000,
    },

    // Timestamps of the last snapshot so we know when to refresh
    lastWeeklyReset: {
      type: Date,
      default: Date.now,
    },
    lastMonthlyReset: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const userModel = model("User", userSchema);
