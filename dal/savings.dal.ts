import { Savings } from "@/types/savings.types";
import BaseDAL from ".";
import {
	SavingsCreationAttributes,
	SavingsInstance,
	SavingsQueries,
} from "@/interfaces/savings.interface";
import { ModelStatic } from "sequelize";
import { SavingsModel } from "@/models/savings.model";
import ServerError from "@/lib/server-error";
import httpStatus from "http-status";
import { paginate } from "@/lib/paginate";
import { Pagination } from "@/global.types";

export class SavingsDal extends BaseDAL<Savings, SavingsInstance> {
	private Savings: ModelStatic<SavingsInstance>;

	private max_savings_count: number;

	constructor() {
		super();
		this.Savings = SavingsModel;

		this.max_savings_count = 5;
	}

	/**
	 * checks if user has passed max savings count
	 * @param createdBy user Id
	 */
	private async checkMaxSavings(createdBy: string) {
		const userSavingsCount = await this.Savings.count({ where: { createdBy } });
		if (userSavingsCount === this.max_savings_count)
			throw new ServerError(
				httpStatus.UNPROCESSABLE_ENTITY,
				"Max savings exceeded dissolve some savings to create new savings"
			);
	}

	/**
	 * creates a new savings
	 * @param savings Savings Creation Attributes
	 * @returns Savings instance
	 */
	async createSavings(savings: SavingsCreationAttributes): Promise<Savings | null> {
		await this.checkMaxSavings(savings.createdBy);

		const newSavings = await this.Savings.create(savings);

		return this.sanitize(newSavings);
	}

	/**
	 * finds savings by id
	 * @param id savings ID
	 * @returns Savings instance
	 */
	async findSavingsById(id: string): Promise<Savings | null> {
		const savings = await this.Savings.findByPk(id);

		return this.sanitize(savings);
	}

	/**
	 * updates a particular savings
	 * @param id savings ID
	 * @param updates savings creation attributes
	 * @returns instance of savings
	 */
	async updateSavings(
		id: string,
		updates: Partial<SavingsCreationAttributes>
	): Promise<Savings | null> {
		const savings = await this.Savings.findByPk(id);
		if (!savings) return null;

		await savings.update(updates);

		return this.findSavingsById(savings._id);
	}

	/**
	 * gets all the savings
	 * @param filters - optional filters for the pagination
	 * @returns A paginated array of savings
	 */
	async getAllSavings(filters: Partial<SavingsQueries>): Promise<Pagination<Savings>> {
		const { page = 1, limit = 10, ...queryFilters } = filters;
		const paginated = await paginate(this.Savings, queryFilters, page, limit);

		const docs = paginated.docs.map((item) => item && this.sanitize(item)!);

		return {
			...paginated,
			docs,
		};
	}

	async dissolveSavings(id: string): Promise<Savings | null> {
		const savings = await this.Savings.findByPk(id);
		if (!savings) return null;

		const copiedSavings = this.sanitize(savings)!;
		const allSavings = await this.Savings.findAll({
			where: { createdBy: savings.createdBy },
		});

		if (allSavings.length > 1) {
			const match = allSavings.find((item) => item._id !== savings._id);
			if (match) {
				const savingsToMergeWith = await this.Savings.findByPk(match._id);

				if (savingsToMergeWith) {
					savingsToMergeWith.update({
						...savingsToMergeWith,
						amount: savingsToMergeWith.amount + copiedSavings?.amount,
					});
				}
			}
		}
		await savings.destroy();
		return copiedSavings;
	}
}
