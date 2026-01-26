import express from "express";
import {db} from "../config/db.js";
import {getTransactionByUserId} from "../controllers/transactionsController.js"


const router = express.Router();

router.post("/", async(req, res)=>{
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
    console.log(transaction);
    res.status(201).json(transaction[0])
  } catch(error){
    console.log("Error creating the transaction: ", error);
    res.status(500).json({message: "Internal Server Error"});
  }
});

router.get("/:userId", getTransactionByUserId);

router.delete("/:id", async(req, res)=>{
  try {
    const {id} = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid Transaction ID"})
    }
    const output = await db`
      DELETE FROM transactions WHERE id = ${id} RETURNING *
    `

    if (output.length === 0) {
      return res.status(404).json({ message:"Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log("Error deleting the transaction: ", error);
    res.status(500).json({message: "Internal Server Error"});
  }
})

router.get("/:userId", async(req,res)=>{
  try {
    const {userId} = req.params;

    const balanceResult = await db`
      SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
    `
    const incomeResult = await db`
      SELECT COALESCE(SUM(amount), 0) as income FROM transactions 
      WHERE user_id = ${userId} AND amount > 0
    `
    const expensesResult = await db`
      SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions 
      WHERE user_id = ${userId} AND amount < 0
    `
    res.status(200).json({
      balance : balanceResult[0].balance,
      income : incomeResult[0].income,
      expenses : expensesResult[0].expenses,
    })
    
  } catch (error) {
    console.log("Error getting the summary: ", error);
    res.status(500).json({message: "Internal Server Error"});
  }
})

export default router;