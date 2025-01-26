import { _Request } from "@/global.types";
import { ActionsService } from "@/services/actions.service";
import { SessionService } from "@/services/session.service";
import { UserService } from "@/services/user.service";
import { Response } from "express";
import { z } from "zod";

export class AuthController {
	private userService: UserService;
	private sessionService: SessionService;
	private actionService: ActionsService;
	constructor() {
		this.userService = new UserService();
		this.sessionService = new SessionService();
		this.actionService = new ActionsService();
	}

	public register = async (req: _Request, res: Response) => {
		const validation = z.object({
			email: z.string().trim().email("email must be a valid email"),
			name: z.string().trim().min(3, "name must be at least 3 characters long"),
			password: z.string().trim().min(8, "password must be at least 8 characters"),
		});

		const payload = validation.parse(req.body);

		const response = await this.userService.createUser(payload);

		res.json(response);
	};

	public loginUser = async (req: _Request, res: Response) => {
		const validation = z.object({
			email: z.string(),
			password: z.string(),
		});

		const payload = validation.parse(req.body);

		const response = await this.sessionService.newSession(payload.email, payload.password);

		res.json(response);
	};

	public loginOutUser = async (req: _Request, res: Response) => {
		await this.sessionService.terminateSession(req.session.token);
		res.json({ message: "signed out" });
	};

	public whoami = async (req: _Request, res: Response) => {
		const session = await this.sessionService.confirmSession(req.session?.token);

		const user = await this.userService.findUserById(session.session.userId);

		res.json(user);
	};

	public sendVerificationEmailOtp = async (req: _Request, res: Response) => {
		const validation = z.object({
			email: z.string().email("Email must be a valid email"),
		});
		const payload = validation.parse(req.query);

		const response = await this.actionService.sendEmailVerificationOtp(payload.email);
		res.json(response);
	};

	public sendOtpToEmail = async (req: _Request, res: Response) => {
		const validation = z.object({
			email: z.string().email("Email must be a valid email"),
		});
		const payload = validation.parse(req.query);

		const response = await this.actionService.sendOtpToEmail(payload.email);
		res.json(response);
	};

	public confirmEmailOtp = async (req: _Request, res: Response) => {
		const validation = z.object({
			email: z.string().email("Email must be a valid email"),
			otp: z.string(),
		});
		const payload = validation.parse(req.query);

		const response = await this.actionService.confirmEmailOtp(payload.email, payload.otp);
		res.json(response);
	};

	public confirmEmailOtpAndVerify = async (req: _Request, res: Response) => {
		const validation = z.object({
			email: z.string().email("Email must be a valid email"),
			otp: z.string(),
		});
		const payload = validation.parse(req.query);

		const response = await this.actionService.confirmEmailOtpAndVerify(payload.email, payload.otp);
		res.json(response);
	};

	public recoverPassword = async (req: _Request, res: Response) => {
		const validation = z.object({
			email: z.string().email("Email must be a valid email"),
			otp: z.string().min(4).max(4),
			newPassword: z.string().min(8),
		});

		const { email, otp, newPassword } = validation.parse(req.body);

		const response = await this.actionService.recoverPasswordReset(email, otp, newPassword);

		res.json(response);
	};

	public restPassword = async (req: _Request, res: Response) => {
		const validation = z.object({
			email: z.string().email("Email must be a valid email"),
			oldPassword: z.string().min(8),
			newPassword: z.string().min(8),
		});

		const { email, oldPassword, newPassword } = validation.parse(req.body);

		const response = await this.actionService.resetPassword(email, oldPassword, newPassword);

		res.json(response);
	};
}
