import { Schema, model } from "mongoose";

const settingsSchema = new Schema(
  {
    tradingEnabled: {
      type: Boolean,
      default: true,
    },

    defaultBalance: {
      type: Number,
      default: 10000,
      min: 0,
    },

    transactionFeePercent: {
      type: Number,
      default: 1,
      min: 0,
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    priceUpdateInterval: {
      type: Number,
      default: 5000, // in milliseconds
    },

    // Weekly Rewards
    weeklyReward1st: { type: Number, default: 1000 },
    weeklyReward2nd: { type: Number, default: 500 },
    weeklyReward3rd: { type: Number, default: 250 },
    weeklyDistributionDay: { type: Number, default: 0 }, // 0 = Sunday
    lastWeeklyDistribution: { type: Date },

    // Monthly Rewards
    monthlyReward1st: { type: Number, default: 5000 },
    monthlyReward2nd: { type: Number, default: 2500 },
    monthlyReward3rd: { type: Number, default: 1000 },
    monthlyDistributionDate: { type: Number, default: 1 }, // 1st of the month
    lastMonthlyDistribution: { type: Date },



  },
  { timestamps: true },
);

export const Settings = model("Settings", settingsSchema);
