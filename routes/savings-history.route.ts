import { SavingsHistoryController } from "@/controllers/savings-history.controller";
import { errorMiddleware } from "@/middleware/errors/error-middleware";
import verifyToken from "@/middleware/security/verify-token";
import express from "express";

const router = express.Router();

export default function () {
	const controller = new SavingsHistoryController();

	/** creates savings history */
	router.post("/", verifyToken, errorMiddleware(controller.createSavingsHistory));

	/** gets all savings history */
	router.get("/", verifyToken, errorMiddleware(controller.getAllSavingsHistory));

	return router;
}
