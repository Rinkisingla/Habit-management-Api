import express from "express"
import dotenv from "dotenv"
import connectdb from "./database/index.js";
dotenv.config();
 const app= express()
app.use(express.json())
connectdb();
app.get("/",async(req,res)=>{
    res.send("Welcome  to this");

})
app.listen(process.env.PORT_NO, ()=>{
 console.log(" working file on this port ",process.env.PORT_NO);
})