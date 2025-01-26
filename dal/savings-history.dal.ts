import { Savings, SavingsHistory } from "@/types/savings.types";
import BaseDAL from ".";
import {
	SavingHistoryInstance,
	SavingsHistoryCreationAttributes,
	SavingsHistoryQueries,
} from "@/interfaces/savings-history.interface";
import { ModelStatic } from "sequelize";
import { SavingsHistoryModel } from "@/models/savings-history.model";
import { Pagination } from "@/global.types";
import { paginate } from "@/lib/paginate";
import { SavingsInstance } from "@/interfaces/savings.interface";
import { SavingsModel } from "@/models/savings.model";
import { sanitizeModel } from "@/lib/sanitize-model";

export class SavingsHistoryDal extends BaseDAL<SavingsHistory, SavingHistoryInstance> {
	private SavingsHistory: ModelStatic<SavingHistoryInstance>;
	private Savings: ModelStatic<SavingsInstance>;

	constructor() {
		super();
		this.SavingsHistory = SavingsHistoryModel;
		this.Savings = SavingsModel;
	}

	/**
	 * this updates the savings amount
	 * @param incomingAmount savings amount
	 * @param savingsId savings ID
	 * @returns void
	 */
	private async updateSavingsAmount(
		incomingAmount: number,
		savingsId: string
	): Promise<Savings | null> {
		const savings = await this.Savings.findByPk(savingsId);
		if (!savings) return null;
		const amount = savings.amount + incomingAmount;
		await savings.update({ amount });
		return sanitizeModel(savings);
	}

	/**
	 * creates a new savings history
	 * @param history Savings history Creation Attributes
	 * @returns Savings history instance
	 */
	async createSavingsHistory(
		history: SavingsHistoryCreationAttributes
	): Promise<SavingsHistory | null> {
		const savings = await this.Savings.findByPk(history.savingsId);
		if (!savings) return null;

		const newAmount = savings.amount + history.amount;

		const newHistory: SavingsHistoryCreationAttributes = {
			...history,
			amountBeforePayment: savings.amount,
			amountAfterPayment: newAmount,
		};

		const savedHistory = await this.SavingsHistory.create(newHistory);

		if (savedHistory) {
			savings.update({ amount: newAmount });
		}

		return this.sanitize(savedHistory);
	}

	/**
	 * gets all the savings history for a saving
	 * @param filters - optional filters for the pagination
	 * @returns A paginated array of savings history
	 */
	async getSavingsHistory(
		filters: Partial<SavingsHistoryQueries>
	): Promise<Pagination<SavingsHistory>> {
		const { page = 1, limit = 10, ...queryFilters } = filters;
		const paginated = await paginate(this.SavingsHistory, queryFilters, page, limit);

		const docs = paginated.docs.map((item) => item && this.sanitize(item)!);

		return {
			...paginated,
			docs,
		};
	}
}
