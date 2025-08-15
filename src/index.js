import express from "express"
import dotenv from "dotenv"
import connectdb from "./database/index.js";
import userRouter from "./router/UserRouter.js";
import cookieParser from "cookie-parser";
import habitRouter from "./router/habitRouter.js";
dotenv.config();
const app= express()
app.use(express.json())
app.use(cookieParser())
connectdb();
app.use('/api/user/v1', userRouter);
app.use('/api/habit/v1', habitRouter);
app.listen(process.env.PORT_NO, ()=>{
 console.log(" working file on this port ",process.env.PORT_NO);
})