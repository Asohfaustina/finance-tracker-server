import { _Request, zodPaginationQuery } from "@/global.types";
import { SavingsService } from "@/services/savings.service";
import { Response } from "express";
import { z } from "zod";

export class SavingsController {
	private SavingsService: SavingsService;

	constructor() {
		this.SavingsService = new SavingsService();
	}

	public createSavings = async (req: _Request, res: Response) => {
		const validation = z.object({
			title: z.string(),
			comments: z.string().optional(),
			createdBy: z.string(),
			targetAmount: z.number(),
			currency: z.string(),
			duration: z.string(),
		});

		const payload = validation.parse(req.body);

		const response = await this.SavingsService.createSavings(payload);
		res.json(response);
	};

	public findSavingsById = async (req: _Request, res: Response) => {
		const validation = z.object({
			id: z.string(),
		});

		const payload = validation.parse(req.params);
		const response = await this.SavingsService.findSavingsById(payload.id);
		res.json(response);
	};

	public updateSavings = async (req: _Request, res: Response) => {
		const validation = z.object({
			title: z.string().optional(),
			comments: z.string().optional(),
			createdBy: z.string().optional(),
			amount: z.number().optional(),
			targetAmount: z.number().optional(),
			currency: z.string().optional(),
			duration: z.string().optional(),
		});

		const payload = validation.parse(req.body);

		const response = await this.SavingsService.updateSavings(req.params.id, payload);

		res.json(response);
	};

	public getAllSavings = async (req: _Request, res: Response) => {
		const validation = z
			.object({
				createdBy: z.string().optional(),
			})
			.merge(zodPaginationQuery);

		const payload = validation.parse(req.query);
		const response = await this.SavingsService.getAllSavings(payload);
		res.json(response);
	};

	public dissolveSavings = async (req: _Request, res: Response) => {
		const validation = z.object({
			id: z.string(),
		});
		const payload = validation.parse(req.params);

		const response = await this.SavingsService.dissolveSavings(payload.id);
		res.json({
			message: "dissolved",
			savings: response,
		});
	};

	
}
