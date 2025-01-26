import { _Request, zodPaginationQuery } from "@/global.types";
import { SavingsHistoryService } from "@/services/savings-history.service";
import { Response } from "express";
import { z } from "zod";

export class SavingsHistoryController {
	private SavingsHistoryService: SavingsHistoryService;

	constructor() {
		this.SavingsHistoryService = new SavingsHistoryService();
	}

	public createSavingsHistory = async (req: _Request, res: Response) => {
		const validation = z.object({
			savingsId: z.string(),
			amount: z.number(),
			currency: z.string(),
		});

		const payload = validation.parse(req.body);
		const response = await this.SavingsHistoryService.createHistory(payload);
		res.json(response);
	};

	public getAllSavingsHistory = async (req: _Request, res: Response) => {
		const validation = z
			.object({
				savingsId: z.string(),
			})
			.merge(zodPaginationQuery);

		const payload = validation.parse(req.query);
		const response = await this.SavingsHistoryService.getSavingsHistory(payload);
		res.json(response);
	};
}
