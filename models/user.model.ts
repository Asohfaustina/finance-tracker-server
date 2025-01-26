import { UserInstance } from "@/interfaces/user.interface";
import { sequelize } from ".";
import { DataTypes } from "sequelize";
import { ExpenseModel } from "./expense.model";
import { BudgetModel } from "./budget.model";
import { SavingsModel } from "./savings.model";
import passwordHasher from "@/lib/password-hasher";
import { UploadModel } from "./upload.model";
import { SessionModel } from "./session.model";

export const UserModel = sequelize.define<UserInstance>(
	"User",
	{
		_id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		isActive: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		isEmailVerified: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		defaultScope: { attributes: { exclude: ["password"] } },
		scopes: {
			withPassword: { attributes: { include: ["password"] } },
		},

		hooks: {
			beforeCreate: async (user: UserInstance) => {
				if (user) {
					const hashedPassword = await passwordHasher.hash(user.password);
					user.password = hashedPassword as string;
				}
			},
		},
	}
);

UserModel.hasMany(ExpenseModel, {
	sourceKey: "_id",
	foreignKey: "createdBy",
	as: "expenses",
});

ExpenseModel.belongsTo(UserModel, {
	foreignKey: "createdBy",
	as: "expenses",
});

UserModel.hasOne(BudgetModel, {
	sourceKey: "_id",
	foreignKey: "userId",
	as: "activeBudget",
});

BudgetModel.belongsTo(UserModel, {
	foreignKey: "userId",
	as: "activeBudget",
});

UserModel.hasMany(SavingsModel, {
	sourceKey: "_id",
	foreignKey: "createdBy",
	as: "savings",
});

SavingsModel.belongsTo(UserModel, {
	foreignKey: "createdBy",
	as: "savings",
});

UserModel.hasOne(UploadModel, {
	sourceKey: "_id",
	foreignKey: "avatar_id",
	as: "avatar",
});

UploadModel.belongsTo(UserModel, {
	foreignKey: "avatar_id",
	as: "avatar",
});

UserModel.hasOne(SessionModel, {
	sourceKey: "_id",
	foreignKey: "session_id",
	as: "session",
});

SessionModel.belongsTo(UserModel, {
	foreignKey: "session_id",
	as: "session",
});
