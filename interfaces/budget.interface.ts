import { PaginationFilters } from "@/global.types";
import { Model, Optional } from "sequelize";

export interface BudgetAttributes {
	_id: string;
	userId: string;
	currentExpense: number;
	budget: number;
	currency: string;
	duration: string;
}

export interface BudgetCreationAttributes
	extends Optional<BudgetAttributes, "_id" | "currentExpense"> {}

export interface BudgetInstance
	extends Model<BudgetAttributes, BudgetCreationAttributes>,
		BudgetAttributes {
	createdAt: Date;
	updatedAt: Date;
}

export type BudgetQueries = PaginationFilters & Pick<BudgetAttributes, "userId">;
