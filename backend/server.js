import exp from 'express'
import {connect} from 'mongoose'
import {config} from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userApp from './APIs/userRoutes.js'
import adminApp from './APIs/adminRoutes.js'
import authApp from './APIs/authRoutes.js'

config()
const app=exp()

app.use(cookieParser())

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

//body parser middleware
app.use(exp.json())

//path level middlewares
app.use("/user-api",userApp)
app.use("/admin-api",adminApp)
app.use("/auth",authApp)

//connect to DB
const connectDB=async()=>{
    try{
        await connect(process.env.DB_URL)
        console.log("DB connected")
        //assign port
        const port=process.env.port || 5000
        app.listen(port,()=> console.log(`Server listening on ${port}....`))
    }
    catch(err){
        console.log("Error in connecting to database:",err)
    }
}
connectDB()


//Error handling middleware
app.use((err, req, res, next) => {
  console.log("Error message:", err.message);
  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Error cause:", err.cause);
  console.log("Full error:", JSON.stringify(err, null, 2));
  //ValidationError
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  //CastError
  if (err.name === "CastError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }

  //send server side error
  res.status(err.status || 500).json({ message: "error occurred", error: err.message || "Server side error", fullError: err });
});