import express, { json } from 'express'
import { Route } from './Routes/adminRoutes.js';
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

dotenv.config()
const app = express();

app.use(cors({
    origin: 'http://localhost:3001', // Allowed origin
    credentials: true               // Enable credentials
}));

app.use(json())
app.use(cookieParser())
app.use('/',Route);
const port = process.env.port;

app.listen(port,()=>{
    console.log(`server listening to ${port}port`)
})