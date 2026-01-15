import express from 'express';
import dotenv from 'dotenv';
import { db } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import transactionRoutes from './routes/transactionRoutes.js';

dotenv.config();

const app = express();
//built-in middleware
app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 5001;

async function initDBConnection() {
  try {
    await db `CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
        );`
        // DECIMAL(10,2) a fixed-pointer number with:
        // 10 digits total & 2 digits after the decimal point so max value is 99999999.99
    console.log("Database initialized successfully");
  } catch (error) {
    console.error('Error initializing DB:', error);
    process.exit(1) // status code 1 means failure, 0 for success
  }
}

app.use("/api/transactions", transactionRoutes);

initDBConnection().then(()=>{
    app.listen(PORT, () => {
        console.log('Server is up and running on PORT:', PORT);
    });
});