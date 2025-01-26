import { _Request, zodPaginationQuery } from "@/global.types";
import { ExpenseService } from "@/services/expense.service";
import { ExpenseTypesList } from "@/types/expense.types";
import { Response } from "express";
import { z } from "zod";

export class ExpenseController {
	private expenseService: ExpenseService;

	constructor() {
		this.expenseService = new ExpenseService();
	}

	public createExpense = async (req: _Request, res: Response) => {
		const validation = z.object({
			category: z.enum(ExpenseTypesList, { message: "must be a valid category" }),
			comments: z.string().optional(),
			createdBy: z.string(),
			amount: z.number(),
			currency: z.string(),
		});

		const payload = validation.parse(req.body);

		const response = await this.expenseService.createExpense(payload);

		res.json(response);
	};

	public findExpenseById = async (req: _Request, res: Response) => {
		const validation = z.object({
			id: z.string(),
		});

		const payload = validation.parse(req.params);

		const response = await this.expenseService.findExpenseById(payload.id);
		res.json(response);
	};

	public updateExpense = async (req: _Request, res: Response) => {
		const validation = z.object({
			category: z.enum(ExpenseTypesList).optional(),
			comments: z.string().optional(),
			createdBy: z.string().optional(),
			amount: z.number().optional(),
			currency: z.string().optional(),
		});

		const payload = validation.parse(req.body);

		const response = await this.expenseService.updateExpense(req.params.id, payload);
		res.json(response);
	};

	public getAllExpense = async (req: _Request, res: Response) => {
	
		const validation = z
			.object({
				category: z.enum(ExpenseTypesList).optional(),
				createdBy: z.string().optional(),
			})
			.merge(zodPaginationQuery);

		const payload = validation.parse(req.query);
		const response = await this.expenseService.getExpenses(payload);

		res.json(response);
	};

	public deleteExpense = async (req: _Request, res: Response) => {
		const validation = z.object({
			id: z.string(),
		});
		const payload = validation.parse(req.params);

		await this.expenseService.deleteExpense(payload.id);
		res.json({
			message: "deleted",
		});
	};

	public getExpenseMetrics = async (req: _Request, res: Response) => {
		
		const validation = z.object({
			// userId: z.string(),
			month: z.string(),
		});

		const payload = validation.parse(req.query);
		const response = await this.expenseService.getExpenseMetrics(req.params.userId, payload.month);
		res.json(response);
	};
}
