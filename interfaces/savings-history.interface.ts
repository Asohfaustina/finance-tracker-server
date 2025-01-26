import { PaginationFilters } from "@/global.types";
import { Optional, Model } from "sequelize";

export interface SavingsHistoryAttributes {
	_id: string;
	savingsId: string;
	amount: number;
	currency: string;
	amountBeforePayment: number;
	amountAfterPayment: number;
}

export interface SavingsHistoryCreationAttributes
	extends Optional<
		SavingsHistoryAttributes,
		"_id" | "amountAfterPayment" | "amountBeforePayment"
	> {}

export interface SavingHistoryInstance
	extends Model<SavingsHistoryAttributes, SavingsHistoryCreationAttributes>,
		SavingsHistoryAttributes {
	createdAt: string;
	updatedAt: string;
}

export type SavingsHistoryQueries = PaginationFilters & Pick<SavingsHistoryAttributes, "savingsId">;
