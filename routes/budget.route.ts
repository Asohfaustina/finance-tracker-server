import { BudgetController } from "@/controllers/budget.controller";
import { errorMiddleware } from "@/middleware/errors/error-middleware";
import verifyToken from "@/middleware/security/verify-token";
import express from "express";

const router = express.Router();

export default function () {
	const controller = new BudgetController();

	/** create budget */
	router.post("/", verifyToken, errorMiddleware(controller.createBudget));

	/** finds budget */
	router.get("/:id", verifyToken, errorMiddleware(controller.findBudgetById));

	/** updates budget */
	router.patch("/:id", verifyToken, errorMiddleware(controller.updateBudget));

	/** gets all budget */
	router.get("/", verifyToken, errorMiddleware(controller.getAllBudget));

	/** deletes budget */
	router.delete("/:id", verifyToken, errorMiddleware(controller.deleteBudget));

	return router;
}
