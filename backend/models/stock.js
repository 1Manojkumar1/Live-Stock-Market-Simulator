import { Schema, model } from 'mongoose';
import mongoose from 'mongoose'
const stockSchema = new Schema({
  userid: {
    type:Number,
    required: [true, "NAME IS IMP"]
  },symbol:{
    type:String,
    required:[true,'symbol is imp ']
  },price:{
    type:Number,
  }
}, { timestamps: true });

export const stockModel = model("Stock",stockSchema);