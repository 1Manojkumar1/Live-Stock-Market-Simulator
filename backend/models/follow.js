import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const followSchema = new Schema(
  {
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Prevent duplicate follows
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export const followModel = model("Follow", followSchema);
