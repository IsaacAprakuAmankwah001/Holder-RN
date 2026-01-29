import express from "express";
import {db} from "../config/db.js";
import {createTransaction, deleteTransaction, getTransactionByUserId} from "../controllers/transactionsController.js"


const router = express.Router();

router.post("/", createTransaction);

router.get("/:userId", getTransactionByUserId);

router.delete("/:id", deleteTransaction)

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