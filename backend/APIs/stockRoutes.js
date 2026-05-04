import exp from 'express';
import Stock from '../models/Stock.js';

export const stockApp = exp.Router();

//get all stocks
stockApp.get('/getStock', async (req,res)=>{
try{
const stocks=await Stock.find();
res.json({message:"Stocks fetched successfully",count:stocks.length,stocks});
}catch(error){
res.status(500).json({message:"Error fetching stocks",error});
}
});

//add new stock
stockApp.post('/addStock', async (req,res)=>{
try{
const {name,symbol,price}=req.body;
if(!name||!symbol||!price){
return res.status(400).json({message:"All fields required"});
}
const existing=await Stock.findOne({symbol});
if(existing){
return res.status(400).json({message:"Stock already exists"});
}
const stock=await Stock.create({name,symbol,price});
res.status(201).json({message:"Stock added successfully",stock});
}catch(error){
res.status(500).json({message:"Error adding stock",error});
}
});

//update stock
stockApp.put('/updateStock/:id', async (req,res)=>{
try{
const {name,price}=req.body;
const stock=await Stock.findById(req.params.id);
if(!stock){
return res.status(404).json({message:"Stock not found"});
}
if(name) stock.name=name;
if(price) stock.price=price;
await stock.save();
res.json({message:"Stock updated successfully",stock});
}catch(error){
res.status(500).json({message:"Error updating stock",error});
}
});

//delete stock
stockApp.delete('/deleteStock/:id', async (req,res)=>{
try{
const stock=await Stock.findById(req.params.id);
if(!stock){
return res.status(404).json({message:"Stock not found"});
}
await stock.deleteOne();
res.json({message:"Stock deleted successfully"});
}catch(error){
res.status(500).json({message:"Error deleting stock",error});
}
});