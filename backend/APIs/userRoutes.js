import exp from 'express';
import { userModel } from '../models/userModel.js';
import { stockModel } from '../models/Stock.js';

const userApp = exp.Router();

userApp.get('/users',async(req,res)=>{
    const userList = await userModel.find();
    res.send(userList);
});

userApp.get('/users/balance/:id',async(req,res)=>{
    const id = req.params.id;
    const user = await userModel.findById(id);
    res.send({balance: user.balance});
});

userApp.put('/users/:id',async(req,res)=>{
    const id = req.params.id;
    const {name, email} = req.body;
    const user = await userModel.findByIdAndUpdate(id,{name, email}, {new: true});
    res.send(user);
});

export default userApp;

