export const ExpenseTypesList = [
	"rent",
	"food",
	"shopping",
	"utilities",
	"education",
	"others",
] as const;

export type ExpenseType = "rent" | "food" | "shopping" | "utilities" | "education" | "others";

export type Expense = {
	_id: string;
	category: ExpenseType;
	comments?: string;
	createdBy: string;
	amount: number;
	currency: string;
	createdAt: string;
	updatedAt: string;
};

export type ExpenseTypes = (typeof ExpenseTypesList)[number];

export type ExpenseMetrics = Record<ExpenseType, number>;
