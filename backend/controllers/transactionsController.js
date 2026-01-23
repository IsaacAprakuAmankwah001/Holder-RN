export async function getTransactionByUserId() {
    
        try {
            const{userId} =  req.params;
    
            const transactions = await db`
                SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
            `;
         res.status(200).json(transactions);
        } catch (error) {
            console.log("Error getting the transaction: ", error);
            res.status(500).json({message: "Internal Server Error"});
        }
}