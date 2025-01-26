import { _Request, zodPaginationQuery } from "@/global.types";
import { BudgetService } from "@/services/budget.service";
import { Response } from "express";
import { z } from "zod";

export class BudgetController {
	private BudgetService: BudgetService;

	constructor() {
		this.BudgetService = new BudgetService();
	}

	public createBudget = async (req: _Request, res: Response) => {
		const validation = z.object({
			userId: z.string(),
			budget: z.number(),
			currency: z.string(),
			duration: z.string(),
		});

		const payload = validation.parse(req.body);

		const response = await this.BudgetService.createBudget(payload);

		res.json(response);
	};

	public findBudgetById = async (req: _Request, res: Response) => {
		const validation = z.object({
			id: z.string(),
		});

		const payload = validation.parse(req.params);

		const response = await this.BudgetService.findBudgetById(payload.id);
		res.json(response);
	};

	public updateBudget = async (req: _Request, res: Response) => {
		const validation = z.object({
			userId: z.string().optional(),
			budget: z.number().optional(),
			currency: z.string().optional(),
			duration: z.string().optional(),
		});

		const { duration, ...payload } = validation.parse(req.body);
		const payloadWithDuration = {
			...payload,
			duration: new Date(duration ?? ""),
		};

		const response = await this.BudgetService.updateBudget(
			req.params.id,
			duration ? payloadWithDuration : payload
		);

		res.json(response);
	};

	public getAllBudget = async (req: _Request, res: Response) => {
		const validation = z
			.object({
				userId: z.string().optional(),
			})
			.merge(zodPaginationQuery);

		const payload = validation.parse(req.query);
		const response = await this.BudgetService.getAllBudget(payload);

		res.json(response);
	};

	public deleteBudget = async (req: _Request, res: Response) => {
		const validation = z.object({
			id: z.string(),
		});
		const payload = validation.parse(req.params);
		await this.BudgetService.deleteBudget(payload.id);
		res.json({
			message: "deleted",
		});
	};
}
