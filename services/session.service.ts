import JWTUtils from "./jwt.service";
import ServerError from "@/lib/server-error";
import httpStatus from "http-status";
import { SessionDal } from "@/dal/session.dal";
import { NewSession, SessionVerified } from "@/types/session.types";
import { UserService } from "./user.service";

export class SessionService {
	private userService: UserService;
	private sessionDal: SessionDal;
	constructor() {
		this.userService = new UserService();
		this.sessionDal = new SessionDal();
	}

	public async newSession(email: string, password: string): Promise<NewSession> {
		const user = await this.userService.confirmPassword(email, password);

		const payload = { _id: user._id, email: user.email };
		const token = JWTUtils.signToken(payload);
		const refresh = JWTUtils.signRefreshToken(payload);

		await this.sessionDal.saveSession({ token, userId: user._id, refresh });

		return { user, token, refresh };
	}

	public async confirmSession(token: string): Promise<SessionVerified> {
		const session = await this.sessionDal.confirmSession(token);
		const jwtVerified = JWTUtils.confirmToken(token);

		if (!session || !jwtVerified)
			throw new ServerError(httpStatus.UNAUTHORIZED, "Invalid/expired session");

		return { session, jwt: jwtVerified };
	}

	public async terminateSession(token: string): Promise<void> {
		await this.sessionDal.terminateSession(token);
	}
}

const sessionService = new SessionService();
export { sessionService };
