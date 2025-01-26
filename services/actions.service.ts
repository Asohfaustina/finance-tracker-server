import ServerError from "@/lib/server-error";
import { UserService } from "./user.service";
import httpStatus from "http-status";
import { User } from "@/types/user.types";
import { EmailConfig } from "@/config/termii.config";
import { UserDAL } from "@/dal/user.dal";

export class ActionsService {
	private UserDal: UserDAL;
	private userService: UserService;
	private Mailer: EmailConfig;
	constructor() {
		this.UserDal = new UserDAL();
		this.userService = new UserService();
		this.Mailer = new EmailConfig();
	}

	async sendEmailVerificationOtp(email: string): Promise<any> {
		const user = await this.UserDal.findUserByEmail(email);

		if (user?.isEmailVerified)
			throw new ServerError(httpStatus.UNPROCESSABLE_ENTITY, "account already verified");

		return this.sendOtpToEmail(email);
	}
	async sendOtpToEmail(email: string): Promise<any> {
		const response = await this.Mailer.sendOtp({ to: email, isEmail: true });
		if (!response) throw new ServerError(httpStatus.INTERNAL_SERVER_ERROR, "failed to send email");
		return response;
	}

	async confirmEmailOtpAndVerify(email: string, otp: string): Promise<any> {
		const response = await this.confirmEmailOtp(email, otp);
		if (response) {
			await this.userService.verifyUser(email);
		}
		return response;
	}
	async confirmEmailOtp(email: string, otp: string): Promise<boolean> {
		const response = await this.Mailer.verifyOtp({ email, pin: otp });
		if (!response)
			throw new ServerError(httpStatus.INTERNAL_SERVER_ERROR, "failed to verify email");

		return response;
	}

	async recoverPasswordReset(email: string, otp: string, newPassword: string): Promise<User> {
		const confirm = await this.confirmEmailOtp(email, otp);
		if (!confirm) throw new ServerError(httpStatus.BAD_REQUEST, "failed to verify email");
		return await this.userService.updateUserPassword(email, newPassword);
	}

	async resetPassword(email: string, oldPassword: string, newPassword: string): Promise<User> {
		if(oldPassword.trim() === newPassword.trim() ) throw new ServerError(httpStatus.BAD_REQUEST, "Cannot previous password pick a new one");
		await this.userService.confirmPassword(email, oldPassword);

		return await this.userService.updateUserPassword(email, newPassword);
	}
}

const actionService = new ActionsService();
export { actionService };
