import { SessionInstance } from "@/interfaces/session.interface";
import { sequelize } from ".";
import { DataTypes } from "sequelize";

export const SessionModel = sequelize.define<SessionInstance>("Session", {
	_id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},

	token: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	refresh: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	userId: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	isValid: {
		type: DataTypes.BOOLEAN,
		allowNull: true,
		defaultValue: true,
	},
	signedOut: {
		type: DataTypes.DATE,
		allowNull: true,
		defaultValue: undefined,
	},
});
