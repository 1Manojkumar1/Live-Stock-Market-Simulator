import { Schema, model } from "mongoose"; 
import { userModel } from "./userModel.js";
import { stockModel } from "./stock.js";
import mongoose from 'mongoose'
const transactionSchema = new Schema({
  userId: {
   type:  mongoose.Schema.Types.ObjectId ,
    ref:userModel
   },stockid:{
 type:  mongoose.Schema.Types.ObjectId ,
   ref:stockModel
  },
 type:{
    type:String,
    enum:["BUY","SELL"]
  }, quantity:{
    type: Number,
    required:[true,"quantity  is mandatory "]
    
  }, price:{
     type:Number
  },totalAmount:{
    type:Number
  }
}, { timestamps: true });

export const transactionModel = model("transaction", transactionSchema);