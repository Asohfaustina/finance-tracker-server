import { ExpenseDal } from "@/dal/expense.dal";
import { Pagination } from "@/global.types";
import { ExpenseCreationAttributes, ExpenseQueries } from "@/interfaces/expense.interface";
import ServerError from "@/lib/server-error";
import { Expense, ExpenseMetrics } from "@/types/expense.types";
import httpStatus from "http-status";

export class ExpenseService {
	private expenseDal: ExpenseDal;

	constructor() {
		this.expenseDal = new ExpenseDal();
	}

	async createExpense(expense: ExpenseCreationAttributes): Promise<Expense> {
		const newExpense = await this.expenseDal.createExpense(expense);

		if (!newExpense)
			throw new ServerError(httpStatus.INTERNAL_SERVER_ERROR, "failed to create expense");

		return newExpense;
	}

	async findExpenseById(id: string): Promise<Expense> {
		const expense = await this.expenseDal.findExpenseById(id);
		if (!expense) throw new ServerError(httpStatus.NOT_FOUND, "record not found");
		return expense;
	}

	async updateExpense(id: string, updates: Partial<Expense>): Promise<Expense> {
		const updated = await this.expenseDal.updateExpense(id, updates);
		if (!updated) throw new ServerError(httpStatus.NOT_FOUND, "record not found");
		return updated;
	}

	async getExpenses(filters: Partial<ExpenseQueries>): Promise<Pagination<Expense>> {
		return this.expenseDal.getAllExpense(filters);
	}

	async deleteExpense(id: string): Promise<boolean> {
		await this.findExpenseById(id);

		return await this.expenseDal.deleteExpense(id);
	}

	async getExpenseMetrics(userId: string, month: string): Promise<ExpenseMetrics> {

		return this.expenseDal.getExpenseMetrics(userId, month);
	}
}
