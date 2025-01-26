import { PaginationFilters } from "@/global.types";
import { Model, Optional } from "sequelize";

export interface SavingsAttributes {
	_id: string;
	title: string;
	comments: string | undefined;
	createdBy: string;
	amount: number;
	targetAmount: number;
	currency: string;
	duration: string;
}

export interface SavingsCreationAttributes
	extends Optional<SavingsAttributes, "_id" | "comments" | "amount"> {}

export interface SavingsInstance
	extends Model<SavingsAttributes, SavingsCreationAttributes>,
		SavingsAttributes {
	createdAt: Date;
	updatedAt: Date;
}

export type SavingsQueries = PaginationFilters &
	Pick<SavingsAttributes, "createdBy" | "targetAmount">;
