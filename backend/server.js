import express from 'express';
import dotenv from 'dotenv';
import { db } from './config/db.js';

dotenv.config();

const app = express();

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
  } catch (error) {
    console.error('Error initializing DB:', error);
    process.exit(1) // status code 1 means failure, 0 for success
  }
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});

initDBConnection().then(()=>{
    app.listen(PORT, () => {
        console.log('Server is up and running on PORT:', PORT);
    });
});