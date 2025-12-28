import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './database/connectDB.js';
import authRouter from './Routes/auth.route.js';


dotenv.config();

const app=express();
const port= process.env.PORT ||8000;
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/api/auth",authRouter);


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
