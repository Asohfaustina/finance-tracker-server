import { JwtPayload } from "jsonwebtoken";
import { User } from "./user.types";

export type Session = {
	_id: string;
	token: string;
	refresh: string;
	userId: string;
	isValid: boolean;
	signedOut: string | undefined;
	createdAt: string;
	updatedAt: string;
};

export type NewSession = { user: User; token: string; refresh: string };

export type SessionVerified = {
	session: Session;
	jwt: JwtPayload | string;
};
