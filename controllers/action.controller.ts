import { _Request } from "@/global.types";
import { ActionsService } from "@/services/actions.service";
import { Response } from "express";
import { z } from "zod";

export class ActionController {
	private actionService: ActionsService;
	constructor() {
		this.actionService = new ActionsService();
	}

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
			otp: z.string().min(5).max(5),
		});
		const payload = validation.parse(req.body);

		const response = await this.actionService.confirmEmailOtp(payload.email, payload.otp);
		res.json(response);
	};

	public recoverPassword = async (req: _Request, res: Response) => {
		const validation = z.object({
			email: z.string().email("Email must be a valid email"),
			otp: z.string().min(5).max(5),
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
	// public async loginUser= async (req: _Request, res: Response) =>{}
	// public async loginUser= async (req: _Request, res: Response) =>{}
}
