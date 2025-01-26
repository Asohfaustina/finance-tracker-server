import { PaginationFilters } from "@/global.types";
import { Model, Optional } from "sequelize";

export interface UserAttributes {
	_id: string;
	name: string;
	email: string;
	password: string;
	isActive: boolean;
	isEmailVerified: boolean;
}

export interface UserCreationAttributes
	extends Optional<UserAttributes, "_id" | "isActive" | "isEmailVerified"> {}

export interface UserInstance
	extends Model<UserAttributes, UserCreationAttributes>,
		UserAttributes {
	createdAt: Date;
	updatedAts: Date;
}

export type UserQueries = PaginationFilters &
	Pick<UserAttributes, "name" | "isActive" | "isEmailVerified">;
