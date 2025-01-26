import { Pagination } from "@/global.types";
import { FindAndCountOptions, Model, ModelStatic } from "sequelize";

/**
 * A reusable helper function for paginating Sequelize models.
 *
 * @param model - The Sequelize model to query.
 * @param page - The current page number (default: 1).
 * @param limit - The number of items per page (default: 10).
 * @param filters - Optional filters to apply to the query.
 * @param options - Additional Sequelize query options.
 * @returns A paginated response with the results and metadata.
 */
export async function paginate<T extends Model>(
	model: ModelStatic<T>,
	filters: Record<string, any> = {},
	page: number = 1,
	limit: number = 10,
	options: FindAndCountOptions = {}
): Promise<Pagination<T>> {
	const paginationLimit = Math.max(1, limit); // Ensure limit is at least 1
	const offset = (Math.max(1, page) - 1) * paginationLimit;

	const { rows: docs  , count: totalDocs } = await model.findAndCountAll({
		where: filters,
		limit,
		offset,
		order: [["createdAt", "DESC"]],
		...options,
	});

	const totalPages = Math.ceil(totalDocs / limit);
	const hasNextPage = page < totalPages;
	const hasPrevPage = page > 1;

	return {
		docs,
		totalDocs,
		limit,
		totalPages,
		page,
		pagingCounter: offset + 1,
		hasNextPage,
		hasPrevPage,
		nextPage: hasNextPage ? page + 1 : null,
		prevPage: hasPrevPage ? page - 1 : null,
	};
}
