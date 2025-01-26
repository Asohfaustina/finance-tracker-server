import { BudgetDal } from "@/dal/budget.dal";
import { Pagination } from "@/global.types";
import { BudgetCreationAttributes, BudgetQueries } from "@/interfaces/budget.interface";
import ServerError from "@/lib/server-error";
import { Budget } from "@/types/budget.types";
import httpStatus from "http-status";

export class BudgetService {
	private BudgetDal: BudgetDal;

	constructor() {
		this.BudgetDal = new BudgetDal();
	}

	async createBudget(budget: BudgetCreationAttributes): Promise<Budget> {
		const newBudget = await this.BudgetDal.createBudget(budget);
		if (!newBudget)
			throw new ServerError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create budget");

		return newBudget;
	}

	async findBudgetById(id: string): Promise<Budget> {
		const budget = await this.BudgetDal.findBudgetById(id);

		if (!budget) throw new ServerError(httpStatus.NOT_FOUND, "Record not found");

		return budget;
	}

	async updateBudget(id: string, updates: Partial<BudgetCreationAttributes>): Promise<Budget> {
		const updated = await this.BudgetDal.updateBudget(id, updates);
		if (!updated) throw new ServerError(httpStatus.NOT_FOUND, "Record not found");

		return updated;
	}

	async getAllBudget(filters: Partial<BudgetQueries>): Promise<Pagination<Budget>> {
		return await this.BudgetDal.getAllBudgets(filters);
	}

	async deleteBudget(id: string): Promise<boolean> {
		await this.findBudgetById(id)
		return await this.BudgetDal.deleteBudget(id);
	}
}
