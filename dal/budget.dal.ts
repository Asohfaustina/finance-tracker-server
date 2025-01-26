import {
	BudgetCreationAttributes,
	BudgetInstance,
	BudgetQueries,
} from "@/interfaces/budget.interface";
import BaseDAL from ".";
import { Budget } from "@/types/budget.types";
import { ModelStatic } from "sequelize";
import { BudgetModel } from "@/models/budget.model";
import { paginate } from "@/lib/paginate";
import { Pagination } from "@/global.types";
import ServerError from "@/lib/server-error";
import httpStatus from "http-status";

export class BudgetDal extends BaseDAL<Budget, BudgetInstance> {
	private Budget: ModelStatic<BudgetInstance>;
	constructor() {
		super();
		this.Budget = BudgetModel;
	}
	/**
	 * resets the budget's currentExpense to 0
	 * @param userId user Id
	 * @returns void
	 */
	private async resetBudgetCurrentExpenses(userId: string) {
		const budget = await this.Budget.findOne({ where: { userId } });
		if (!budget) return;

		budget.update({ currentExpense: 0 });
	}

	/**
	 * Create a new budget.
	 * @param budget - Budget creation attributes
	 * @returns The created user instance
	 */
	async createBudget(budget: BudgetCreationAttributes): Promise<Budget | null> {
		const hasBudget = await this.Budget.findOne({ where: { userId: budget.userId } });
		if (hasBudget)
			throw new ServerError(httpStatus.BAD_REQUEST, "User already has an active budget");
		const newBudget = await this.Budget.create(budget);

		return this.sanitize(newBudget);
	}

	/**
	 * Get an budge by id.
	 * @param id - Budget id
	 * @returns An instances of budge
	 */
	async findBudgetById(id: string): Promise<Budget | null> {
		const budget = await this.Budget.findByPk(id);

		return this.sanitize(budget);
	}

	/**
	 * updates an Budget
	 * @param id - Budget ID
	 * @param updates - budget creation attributes
	 * @returns budget instances
	 */
	async updateBudget(
		id: string,
		updates: Partial<BudgetCreationAttributes>
	): Promise<Budget | null> {
		const budget = await this.Budget.findByPk(id);

		if (!budget) return null;

		if (budget.budget !== updates.budget) {
			await this.resetBudgetCurrentExpenses(budget.userId);
		}

		await budget.update(updates);

		return await this.findBudgetById(budget._id);
	}

	/**
	 * Get all budgets, with optional filters.
	 * @param filters - Optional filters for querying budgets
	 * @returns An array of budget instances
	 */
	async getAllBudgets(filters: Partial<BudgetQueries>): Promise<Pagination<Budget>> {
		const { page = 1, limit = 10, ...queryFilters } = filters;
		const paginated = await paginate(this.Budget, queryFilters, page, limit);
		const docs = paginated.docs.map((item) => item && this.sanitize(item)!);

		return {
			...paginated,
			docs,
		};
	}

	/**
	 * updates an Budget
	 * @param id - Budget ID
	 * @returns boolean
	 */
	async deleteBudget(_id: string): Promise<boolean> {
		const deleted = await this.Budget.destroy({ where: { _id } });
		return !!deleted;
	}
}
