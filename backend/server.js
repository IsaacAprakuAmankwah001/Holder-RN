import express from 'express';
import dotenv from 'dotenv';
import { db } from './config/db.js';

dotenv.config();

const app = express();
//built-in middleware
app.use(express.json())

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

app.post("/api/transactions", async(req, res)=>{
  try{
    const{title, amount, category, user_id} = req.body;

    if (!title || !category || !user_id || amount == undefined) {
      return res.status(400).json({message: "All fields are required"});
    }

    const transaction =  await db`
      INSERT INTO transactions(user_id, title, amount, category)
      VALUES(${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `
  } catch(error){
    console.log("Error creating a transaction: ", error);
    res.status(500).json({message: "Internal Server Error"})
  }
});
initDBConnection().then(()=>{
    app.listen(PORT, () => {
        console.log('Server is up and running on PORT:', PORT);
    });
});