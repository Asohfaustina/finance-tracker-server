import { UploadInstance } from "@/interfaces/upload.interface";
import { sequelize } from ".";
import { DataTypes } from "sequelize";

export const UploadModel = sequelize.define<UploadInstance>("Uploads", {
	_id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	url: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	mimetype: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	size: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	userId: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});
