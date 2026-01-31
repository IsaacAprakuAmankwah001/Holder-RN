import express from 'express';
import dotenv from 'dotenv';
import { initDBConnection } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import transactionRoutes from './routes/transactionRoutes.js';

dotenv.config();

const app = express();
//built-in middleware
app.use(rateLimiter);
app.use(express.json());



const PORT = process.env.PORT || 5001;


app.use("/api/transactions", transactionRoutes);

initDBConnection().then(()=>{
    app.listen(PORT, () => {
        console.log('Server is up and running on PORT:', PORT);
    });
});