import express from "express";
import {db} from "../config/db.js";
import {createTransaction, deleteTransaction, getSummaryByUserId, getTransactionByUserId} from "../controllers/transactionsController.js"


const router = express.Router();

router.post("/", createTransaction);

router.get("/:userId", getTransactionByUserId);

router.delete("/:id", deleteTransaction)

router.get("/:userId", getSummaryByUserId)

export default router;