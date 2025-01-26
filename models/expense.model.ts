import { DataTypes } from "sequelize";
import { sequelize } from ".";
import { ExpenseInstance } from "@/interfaces/expense.interface";
import { ExpenseType } from "@/types/expense.types";

export const ExpenseModel = sequelize.define<ExpenseInstance>("Expense", {
	_id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	category: {
		type: DataTypes.ENUM<ExpenseType>(
			"education",
			"food",
			"others",
			"rent",
			"shopping",
			"utilities"
		),
		allowNull: false,
	},
	comments: {
		type: DataTypes.STRING,
		allowNull: true,
		defaultValue: null,
	},
	createdBy: {
		type: DataTypes.UUID,
		allowNull: false,
	},

	amount: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	currency: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});
