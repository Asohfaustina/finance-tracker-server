import { PaginationFilters } from "@/global.types";
import { ExpenseType } from "@/types/expense.types";
import { Model, Optional } from "sequelize";

export interface ExpenseAttributes {
	_id: string;
	category: ExpenseType;
	comments?: string | undefined;
	createdBy: string;
	amount: number;
	currency: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface ExpenseCreationAttributes
	extends Optional<ExpenseAttributes, "_id" | "createdAt" | "updatedAt"> {}

export interface ExpenseInstance
	extends Model<ExpenseAttributes, ExpenseCreationAttributes>,
		ExpenseAttributes {}

export type ExpenseQueries = PaginationFilters & Pick<ExpenseAttributes, "category" | "createdBy">;
