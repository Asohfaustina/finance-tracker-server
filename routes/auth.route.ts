import { AuthController } from "@/controllers/auth.controller";
import { errorMiddleware } from "@/middleware/errors/error-middleware";
import verifyToken from "@/middleware/security/verify-token";
import express from "express";
const router = express.Router();

export default function () {
	const controller = new AuthController();

	/** creates user account */
	router.post("/register", errorMiddleware(controller.register));

	/** logs in user */
	router.post("/login", errorMiddleware(controller.loginUser));

	
	/** sends email verification code */
	router.post("/otp/email", errorMiddleware(controller.sendVerificationEmailOtp));

	/** sends otp to email*/
	router.post("/otp/send", errorMiddleware(controller.sendOtpToEmail));

	/** verifies otp sent to email  and verifies email*/
	router.post("/otp/verify-email", errorMiddleware(controller.confirmEmailOtpAndVerify));

	/** verifies otp sent to email */
	router.post("/otp/verify", errorMiddleware(controller.confirmEmailOtp));
	
	/** recovers password */
	router.patch("/recover", errorMiddleware(controller.recoverPassword));
	
	/** resets password */
	router.patch("/reset", verifyToken, errorMiddleware(controller.restPassword));
	
	/** gets user details */
	router.get("/whoami", verifyToken, errorMiddleware(controller.whoami));
	
	/** logs out user */
	router.post("/logout",verifyToken, errorMiddleware(controller.loginOutUser));

	return router;
}
