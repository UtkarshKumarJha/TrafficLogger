import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {connectDB} from './db.js';
dotenv.config();
import {router} from './routes/routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
    origin: 'https://trafficlogger-1.onrender.com', 
}));
app.use(express.json());

app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


