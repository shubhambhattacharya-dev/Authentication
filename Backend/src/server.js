import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './database/connectDB.js';


dotenv.config();

const app=express();
const port= process.env.PORT ||3000;

app.get("/",(req,res)=>{
    res.send("Authentication Backend Server is running");
})

const startServer=async()=>{
    try {
        await connectDB();
        app.listen(port,()=>{
            console.log(`http://localhost:${port}`)

        })

        
    } catch (error) {
        console.error(`Error in starting server: ${error.message}`);
        process.exit(1);
        
    }
}

startServer();
