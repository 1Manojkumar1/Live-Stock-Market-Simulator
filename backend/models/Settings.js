import { Schema, model } from 'mongoose';
import mongoose from 'mongoose'
const settingsSchema = new Schema({
 tradingEnabled: {
        type: Boolean,
        default: true
    },

    defaultBalance: {
        type: Number,
        default: 10000,
        min: 0
    },

    transactionFeePercent: {
        type: Number,
        default: 1,
        min: 0
    },

    maintenanceMode: {
        type: Boolean,
        default: false
    },

    priceUpdateInterval: {
        type: Number,
        default: 5000   // in milliseconds
    }
}, { timestamps: true });

export const Settings = model("Settings",settingsSchema);