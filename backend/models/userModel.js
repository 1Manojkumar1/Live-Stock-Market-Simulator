import { Schema, model } from 'mongoose';
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "NAME IS IMP"]
  },
  email: {
    type: String,
    unique: true,
    required: [true, "EMAIL IS IMP"]
  },
  password: {
    type: String,
    required: [true, "PASSWORD IS IMP"]
  },
  role: {
    type: String,
    enum: ["ADMIN", "TRADER"],
    default: "TRADER"
  },
  balance: {
    type: Number,
    default: 10000
  },
  status: {
    type: String,
    enum: ["active", "blocked"],
    default: "active"
  }
}, { timestamps: true });

export const userModel = model("User", userSchema);