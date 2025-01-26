import { SavingsInstance } from "@/interfaces/savings.interface";
import { sequelize } from ".";
import { DataTypes } from "sequelize";
import { SavingsHistoryModel } from "./savings-history.model";

export const SavingsModel = sequelize.define<SavingsInstance>(
	"Savings",
	{
		_id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		comments: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		createdBy: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		amount: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0
		},

		targetAmount: {
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
	},
	{
		hooks: {
			beforeUpdate(instance, options) {},
		},
	}
);

SavingsModel.hasMany(SavingsHistoryModel, {
	sourceKey: "_id",
	foreignKey: "savingsId",
	as: "history",
});

SavingsHistoryModel.belongsTo(SavingsModel, {
	foreignKey: "savingsId",
	as: "history",
});
