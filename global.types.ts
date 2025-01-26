import { Request } from "express";
import { z } from "zod";

export type _Request = Request & {
	user?: any;
	session?: any;
};

export type Pagination<T> = {
	hasNextPage: boolean;
	hasPrevPage: boolean;
	limit: number;
	nextPage: number | null;
	docs: T[];
	page: number;
	pagingCounter: number;
	prevPage: number | null;
	totalDocs: number;
	totalPages: number;
};

export type AppInstanceOptions = {
	whitelist: string[];
	port: number;
	dataLimit: string;
};

export type PaginationFilters = {
	page: number;
	limit: number;
};

export const zodPaginationQuery = z.object({
	limit: z.number().optional(),
	page: z.number().optional(),
});
