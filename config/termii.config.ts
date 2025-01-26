import { variables } from "@/constants";
import ensureError from "@/lib/ensure-error";
import ServerError from "@/lib/server-error";
import axios from "axios";
import httpStatus from "http-status";

export type SendEmailPayload = {
	to: string;
	isEmail: boolean;
};

export type VerifyEmailPayload = {
	pin: string;
	email: string;
};

let PIN_IDS: Record<string, string> = {};

export class EmailConfig {
	private termii_key: string = variables.TERMII.token;
	private termii_url: string = variables.TERMII.url;
	private termii_config_id: string = variables.TERMII.config_id;
	private from: string = "Thirdman";

	//     {
	//     "email_address": "shola.olu@term.ii",
	//     "code": "092471",
	//     "api_key": "Your API key",
	//     "email_configuration_id": "0a53c416-uocj-95af-ab3c306aellc"
	// }

	public async sendOtp(emailPayload: SendEmailPayload): Promise<any> {
		const payload = {
			api_key: this.termii_key,
			code: this.generateCode(),
			email_configuration_id: this.termii_config_id,
			email_address: "ax3fqu@gmail.com",
		};
		// const payload = {
		// 	api_key: this.termii_key,
		// 	message_type: "NUMERIC",
		// 	to: emailPayload.to,
		// 	from: this.termii_config_id,
		// 	channel: "email",
		// 	pin_attempts: 10,
		// 	pin_time_to_live: 5,
		// 	pin_length: 6,
		// 	pin_placeholder: "< 1234 >",
		// 	message_text: "Your pin is < 1234 >",
		// 	pin_type: "NUMERIC",
		// };

		const response = await this.makeRequest("/email/otp/send", payload);
		if (response) {
			this.storePinId(emailPayload.to, response.pinId);
		}
		return response;
	}

	public async verifyOtp(verifyPayload: VerifyEmailPayload): Promise<any> {
		const payload = {
			api_key: this.termii_key,
			pin_id: PIN_IDS[verifyPayload.email],
			...verifyPayload,
		};
		const response = await this.makeRequest("/sms/otp/verify", payload);
		if (!response) return false;
		delete PIN_IDS[verifyPayload.email];
		return true;
	}

	private async makeRequest(path: string, payload: object): Promise<any> {
		try {
			const response = await axios.post(path, payload, {
				baseURL: this.termii_url,
				headers: {
					"Content-Type": ["application/json", "application/json"],
				},
			});
			console.log(response.data);
			return response.data;
		} catch (error) {
			const e = ensureError(error);
			const err = new ServerError(httpStatus.INTERNAL_SERVER_ERROR, "error sending email", {
				context: JSON.stringify(error),
				cause: ensureError(error),
			});

			throw err;
		}
	}

	private storePinId(email: string, pin_id: string) {
		PIN_IDS[email] = pin_id;
	}

	private generateCode(): string {
		return Math.floor(Math.random() * 999999).toString();
	}
}
