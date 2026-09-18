import express from "express";
import dotenv from "dotenv"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/" , (req , res)=>{
    res.send("Portfolio Backend is running");
});

app.listen(PORT, ()=>{
    console.log("Server running on port 3000");
});