import { SessionCreationAttributes, SessionInstance } from "@/interfaces/session.interface";
import BaseDAL from ".";
import { Session } from "@/types/session.types";
import { ModelStatic } from "sequelize";
import { SessionModel } from "@/models/session.model";

export class SessionDal extends BaseDAL<Session, SessionInstance> {
	private Session: ModelStatic<SessionInstance>;
	constructor() {
		super();
		this.Session = SessionModel;
	}

	public async saveSession(session: SessionCreationAttributes): Promise<Session | null> {
		const hasSession = await this.Session.findOne({ where: { userId: session.userId } });

		if (hasSession)
			return this.updateSession(hasSession.userId, {
				...session,
				isValid: true,
				signedOut: undefined,
			});

		const newSession = await this.Session.create(session);

		return this.sanitize(newSession);
	}

	public async confirmSession(token: string): Promise<Session | null> {
		const session = await this.findSessionByToken(token);
		if (!session || !session.isValid) return null;
		return session;
	}

	public async findSessionByToken(token: string): Promise<Session | null> {
		const session = await this.Session.findOne({ where: { token } });
		return this.sanitize(session);
	}

	public async findSessionById(id: string): Promise<Session | null> {
		const session = await this.Session.findByPk(id);

		return this.sanitize(session);
	}
	public async findSessionByUserId(userId: string): Promise<Session | null> {
		const session = await this.Session.findOne({ where: { userId } });

		return this.sanitize(session);
	}

	public async updateSession(
		userId: string,
		updates: Partial<SessionCreationAttributes>
	): Promise<Session | null> {
		const session = await this.Session.findOne({ where: { userId } });
		if (!session) return null;

		await session.update(updates);

		return await this.findSessionById(session._id);
	}

	public async terminateSession(token: string): Promise<Session | null> {
		const session = await this.Session.findOne({ where: { token } });

		if (!session) return null;

		const signedOut = new Date();

		return await this.updateSession(session.userId, { isValid: false, signedOut });
	}
}
