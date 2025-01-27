import { ModelStatic, Op } from "sequelize";
import BaseDAL from ".";
import { Expense, ExpenseMetrics, ExpenseType, ExpenseTypesList } from "@/types/expense.types";
import {
	ExpenseCreationAttributes,
	ExpenseInstance,
	ExpenseQueries,
} from "@/interfaces/expense.interface";
import { ExpenseModel } from "@/models/expense.model";
import { paginate } from "@/lib/paginate";
import { Pagination } from "@/global.types";
import updateObject from "@/lib/update-object";
import { BudgetInstance } from "@/interfaces/budget.interface";
import { BudgetModel } from "@/models/budget.model";
import ServerError from "@/lib/server-error";
import { sequelize } from "@/models";

export class ExpenseDal extends BaseDAL<Expense, ExpenseInstance> {
	private Expense: ModelStatic<ExpenseInstance>;
	private Budget: ModelStatic<BudgetInstance>;
	constructor() {
		super();
		this.Expense = ExpenseModel;
		this.Budget = BudgetModel;
	}
	/**
	 * this updates the active budget current expense if there is any
	 * @param newExpenseAmount expense amount
	 * @param userId user ID
	 * @returns void
	 */
	private async updateBudget(newExpenseAmount: number, userId: string) {
		const budget = await this.Budget.findOne({ where: { userId } });
		if (!budget) return;
		const updatedExpense = (budget.currentExpense += newExpenseAmount);
		await budget.update({ currentExpense: updatedExpense });
	}

	/**
	 * Create a new expense.
	 * @param expense - Expense creation attributes
	 * @returns The created expense instance
	 */
	async createExpense(expense: ExpenseCreationAttributes): Promise<Expense | null> {
		const newExpense = await this.Expense.create(expense);

		await this.updateBudget(newExpense.amount, newExpense.createdBy); // updates the budget

		return this.sanitize(newExpense);
	}

	/**
	 * Get an expense by id.
	 * @param id - Expense id
	 * @returns An instances of expense
	 */
	async findExpenseById(id: string): Promise<Expense | null> {
		const expense = await this.Expense.findByPk(id);
		return this.sanitize(expense);
	}

	/**
	 * Get all expenses, with optional filters.
	 * @param filters - Optional filters for querying expenses
	 * @returns An array of expense instances
	 */
	async getAllExpense(filters: Partial<ExpenseQueries> = {}): Promise<Pagination<Expense>> {
		const { page = 1, limit = 10, ...queryFilters } = filters;

		const paginated = await paginate(this.Expense, queryFilters, page, limit);

		const docs = paginated.docs.map((item) => item && this.sanitize(item)!);

		return {
			...paginated,
			docs,
		};
	}

	/**
	 * updates an Expense
	 * @param id - Expense ID
	 * @param updates - expense creation attributes
	 * @returns An array of expense instances
	 */
	async updateExpense(id: string, updates: Partial<Expense>): Promise<Expense | null> {
		const expense = await this.Expense.findByPk(id);

		if (!expense) return null;

		const updated = updateObject(this.sanitize(expense)!, updates);

		await expense.update(updates);
		return updated;
	}

	/**
	 * updates an Expense
	 * @param id - Expense ID
	 * @returns boolean
	 */
	async deleteExpense(id: string): Promise<boolean> {
		const deleted = await this.Expense.destroy({
			where: { _id: id },
		});

		return !!deleted;
	}

	async getExpenseMetrics(userId: string, date: string): Promise<any> {
		const startDate = new Date(`${date}`);
		const endDate = new Date(startDate);
		endDate.setMonth(endDate.getMonth() + 1);

		const metrics = await this.Expense.findAll({
			attributes: ["category", [sequelize.fn("COUNT", sequelize.col("category")), "count"]],
			where: {
				createdBy: userId,
				createdAt: {
					[Op.between]: [startDate, endDate],
				},
			},
			group: ["category"],
			raw: true,
		});

		const expenseMetrics: ExpenseMetrics = ExpenseTypesList.reduce(
			(acc, type) => ({ ...acc, [type]: 0 }),
			{} as ExpenseMetrics
		);

		metrics.forEach((metric: any) => {
			const category = metric.category as ExpenseType;
			expenseMetrics[category] = parseInt(metric.count, 10);
		});

		return expenseMetrics;
	}
}
