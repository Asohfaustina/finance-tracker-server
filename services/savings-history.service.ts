import { SavingsHistoryDal } from "@/dal/savings-history.dal";
import { Pagination } from "@/global.types";
import {
	SavingsHistoryCreationAttributes,
	SavingsHistoryQueries,
} from "@/interfaces/savings-history.interface";
import ServerError from "@/lib/server-error";
import { SavingsHistory } from "@/types/savings.types";
import httpStatus from "http-status";

export class SavingsHistoryService {
	private SavingsHistoryDal: SavingsHistoryDal;
	constructor() {
		this.SavingsHistoryDal = new SavingsHistoryDal();
	}

	async createHistory(history: SavingsHistoryCreationAttributes): Promise<SavingsHistory> {
		const newHistory = await this.SavingsHistoryDal.createSavingsHistory(history);
		if (!newHistory)
			throw new ServerError(httpStatus.INTERNAL_SERVER_ERROR, "failed to create savings history");
		return newHistory;
	}

	async getSavingsHistory(
		filters: Partial<SavingsHistoryQueries>
	): Promise<Pagination<SavingsHistory>> {
		return await this.SavingsHistoryDal.getSavingsHistory(filters);
	}
}
