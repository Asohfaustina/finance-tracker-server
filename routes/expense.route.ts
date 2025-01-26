import { ExpenseController } from "@/controllers/expense.controller";
import { errorMiddleware } from "@/middleware/errors/error-middleware";
import verifyToken from "@/middleware/security/verify-token";
import express from "express";

const router = express.Router();

export default function () {
	const controller = new ExpenseController();

	/** creates new expense */
	router.post("/", verifyToken, errorMiddleware(controller.createExpense));

	/** gets expense by id */
	router.get("/:id", verifyToken, errorMiddleware(controller.findExpenseById));

	/** updates expense */
	router.patch("/:id", verifyToken, errorMiddleware(controller.updateExpense));

	/** gets all expense */
	router.get("/", verifyToken, errorMiddleware(controller.getAllExpense));

	/** deletes expense  */
	router.delete("/:id", verifyToken, errorMiddleware(controller.deleteExpense));

	/** gets expense metrics  */
	router.get("/:userId/metrics", verifyToken, errorMiddleware(controller.getExpenseMetrics));

	return router;
}
