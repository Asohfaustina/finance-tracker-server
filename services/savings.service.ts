import { SavingsDal } from "@/dal/savings.dal";
import { Pagination } from "@/global.types";
import { SavingsCreationAttributes, SavingsQueries } from "@/interfaces/savings.interface";
import ServerError from "@/lib/server-error";
import { Savings } from "@/types/savings.types";
import httpStatus from "http-status";

export class SavingsService {
	private SavingsDal: SavingsDal;

	constructor() {
		this.SavingsDal = new SavingsDal();
	}

	async createSavings(savings: SavingsCreationAttributes): Promise<Savings> {
		const newSavings = await this.SavingsDal.createSavings(savings);

		if (!newSavings)
			throw new ServerError(httpStatus.INTERNAL_SERVER_ERROR, "failed to create a savings");

		return newSavings;
	}

	async findSavingsById(id: string): Promise<Savings> {
		const savings = await this.SavingsDal.findSavingsById(id);
		if (!savings) throw new ServerError(httpStatus.NOT_FOUND, "Record not found");
		return savings;
	}

	async updateSavings(id: string, updates: Partial<SavingsCreationAttributes>): Promise<Savings> {
		const updated = await this.SavingsDal.updateSavings(id, updates);
		if (!updated) throw new ServerError(httpStatus.NOT_FOUND, "Record not found");
		return updated;
	}

	async getAllSavings(filters: Partial<SavingsQueries>): Promise<Pagination<Savings>> {
		return this.SavingsDal.getAllSavings(filters);
	}

	async dissolveSavings(id: string): Promise<Savings> {
		const dissolved = await this.SavingsDal.dissolveSavings(id);

		if (!dissolved) throw new ServerError(httpStatus.NOT_FOUND, "Record not found");
		return dissolved;
	}
}
