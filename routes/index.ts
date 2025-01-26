import express from "express";
import authRoute from "./auth.route";
import userRoute from "./user.route";
import expenseRoute from "./expense.route";
import budgetRoute from "./budget.route";
import savingsRoute from "./savings.route";
import savingsHistoryRoute from "./savings-history.route";

const router = express.Router();

export default function () {
	router.use("/auth", authRoute());
	router.use("/users", userRoute());
	router.use("/expenses", expenseRoute());
	router.use("/budgets", budgetRoute());
	router.use("/savings", savingsRoute());
	router.use("/savings-history", savingsHistoryRoute());
	return router;
}
