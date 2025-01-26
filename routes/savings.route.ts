import { SavingsController } from "@/controllers/savings.controller";
import { errorMiddleware } from "@/middleware/errors/error-middleware";
import verifyToken from "@/middleware/security/verify-token";
import express from "express";

const router = express.Router();

export default function () {
	const controller = new SavingsController();

	/** creates new savings */
	router.post("/", verifyToken, errorMiddleware(controller.createSavings));

	/** gets savings details */
	router.get("/:id", verifyToken, errorMiddleware(controller.findSavingsById));

	/** update savings */
	router.patch("/:id", verifyToken, errorMiddleware(controller.updateSavings));

	/** gets all savings */
	router.get("/", verifyToken, errorMiddleware(controller.getAllSavings));

	/** dissolves savings */
    router.delete("/:id/dissolve", verifyToken, errorMiddleware(controller.dissolveSavings));
    
    return router 
}
