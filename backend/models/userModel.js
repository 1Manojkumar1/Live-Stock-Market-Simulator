import { Schema, model } from "mongoose";
import mongoose from "mongoose";
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "NAME IS REQUIRED"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "EMAIL IS REQUIRED"],
    },
    password: {
      type: String,
      required: [true, "PASSWORD IS REQUIRED"],
    },
    role: {
      type: String,
      enum: ["ADMIN", "TRADER"],
      default: "TRADER",
    },
    balance: {
      type: Number,
      default: 10000,
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    watchlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stock",
      },
    ],
  },
  { timestamps: true },
);

export const userModel = model("User", userSchema);
