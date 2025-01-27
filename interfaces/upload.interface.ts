import { Model, Optional } from "sequelize";

export interface UploadAttributes {
	_id: string;
	name: string;
	url: string;
	mimetype: string;
	size: number;
	userId: string;
	avatar_id?:string
}

export interface UploadCreationAttributes extends Optional<UploadAttributes, "_id"|"avatar_id"> {}

export interface UploadInstance
	extends Model<UploadAttributes, UploadCreationAttributes>,
		UploadAttributes {
	createdAt: string;
	updatedAt: string;
}
