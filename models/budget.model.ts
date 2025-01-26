import { DataTypes } from "sequelize";
import { sequelize } from ".";
import { BudgetInstance } from "@/interfaces/budget.interface";

export const BudgetModel = sequelize.define<BudgetInstance>("Budget", {
	_id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	userId: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	currentExpense: {
		type: DataTypes.INTEGER,
		allowNull: true,
		defaultValue: 0,
	},
	budget: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	currency: {
		type: DataTypes.STRING,
		allowNull: false,
	},

	duration: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});
