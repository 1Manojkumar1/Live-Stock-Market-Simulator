import { Schema, model } from 'mongoose';
import mongoose from 'mongoose'
const portfolioSchema = new Schema({
 userId: {
   type:  mongoose.Schema.Types.ObjectId ,
   ref:User
  },stockid:{
    type:mongoose.Schema.Types.ObjectId ,
    ref:Stock
  }, quantity:{
    type: Number,
    required:[true,"quantity  is mandatory "]
  }
},{ timestamps: true });

export const portfolioModel = model("portfolio", portfolioSchema);