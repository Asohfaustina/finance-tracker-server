import { variables } from "@/constants";
import jwt, { SignOptions } from "jsonwebtoken";

type Payload = { _id: string; email: string };

export default class JWTUtils {
	static signToken(payload: Payload, options: SignOptions = {}) {
		const { expiresIn = "1d" } = options;
		return jwt.sign(payload, variables.JWT.access_secret, { expiresIn });
	}

	static signRefreshToken(payload: Payload) {
		return jwt.sign(payload, variables.JWT.refresh_secret);
	}

	static confirmToken(accessToken: string) {
		return jwt.verify(accessToken, variables.JWT.access_secret);
	}

	static confirmRefreshToken(accessToken: string) {
		return jwt.verify(accessToken, variables.JWT.refresh_secret);
	}
}
