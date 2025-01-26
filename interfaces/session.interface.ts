import { Model, Optional } from "sequelize";

export interface SessionAttributes {
	_id: string;
	token: string;
	refresh: string;
	userId: string;
	isValid: boolean;
	signedOut: Date | undefined;
}

export interface SessionCreationAttributes
	extends Optional<SessionAttributes, "_id" | "isValid" | "signedOut"> {}

export interface SessionInstance
	extends Model<SessionAttributes, SessionCreationAttributes>,
		SessionAttributes {
	createdAt: Date;
	updatedAt: Date;
}
