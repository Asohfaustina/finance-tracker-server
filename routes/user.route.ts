import { UserController } from "@/controllers/user.controller";
import { errorMiddleware } from "@/middleware/errors/error-middleware";
import verifyToken from "@/middleware/security/verify-token";
import express from "express";

const router = express.Router();

export default function () {
	const controller = new UserController();

	/** gets user by id */
	router.get("/:id", verifyToken, errorMiddleware(controller.findUserById));

	/** gets user by email */
	router.get("/search", verifyToken, errorMiddleware(controller.findUserByEmail));

	/** updates user details */
	router.patch("/:id", verifyToken, errorMiddleware(controller.updateUser));

	/** uploads user avatar */
	router.post("/:id/avatar", verifyToken, errorMiddleware(controller.uploadUserAvatar));

	/** updates user avatar */
	router.patch("/:id/avatar", verifyToken, errorMiddleware(controller.updateUserAvatar));

	/** gets all users */
	router.get("/", verifyToken, errorMiddleware(controller.getUsers));

	/** verifies user */
	router.patch("/:id/verify", verifyToken, errorMiddleware(controller.verifyUser));

	/** activates user  */
	router.patch("/:id/activate", verifyToken, errorMiddleware(controller.activateUser));

	/** deactivates user */
	router.patch("/:id/deactivate", verifyToken, errorMiddleware(controller.deactivateUser));

	/** deletes user  */
	router.delete("/:id", verifyToken, errorMiddleware(controller.deleteUser));

	return router;
}
