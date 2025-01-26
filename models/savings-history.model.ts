import { SavingHistoryInstance } from "@/interfaces/savings-history.interface";
import { sequelize } from ".";
import { DataTypes } from "sequelize";

export const SavingsHistoryModel = sequelize.define<SavingHistoryInstance>("SavingsHistory", {
	_id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	savingsId: {
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
	amountBeforePayment: {
		type: DataTypes.INTEGER,
		allowNull: true,
		defaultValue: 0,
	},
	amountAfterPayment: {
		type: DataTypes.INTEGER,
		allowNull: true,
		defaultValue: 0,
	},
});
