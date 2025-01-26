import { User } from "./user.types";

export type Savings = {
	_id: string;
	title: string;
	comments: string | undefined;
	createdBy: User;
	amount: number;
	targetAmount: number;
	currency: string;
	duration: string;
	createdAt: string;
	updatedAt: string;
};

export type SavingsHistory = {
	_id: string;
	savingsId: string;
	amount: number;
	currency: string;
	amountBeforePayment: number;
	amountAfterPayment: number;
	createdAt: string;
	updatedAt: string;
};
