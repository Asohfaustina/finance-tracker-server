import { HealthController } from "@/controllers/health.controller";
import { errorMiddleware } from "@/middleware/errors/error-middleware";
import express from "express";
const router = express.Router();

export default function () {
	const controller = new HealthController();

	/** confirms the health of the server */
	router.get("/", errorMiddleware(controller.healthCheck));

	return router;
}
