import ILogger from "@/interfaces/logger.interface";

export class ConsoleLogger implements ILogger {
	logError(msg: string): void {
		const date = new Date().toLocaleDateString("en-us", { dateStyle: "medium" });
		const time = new Date().toLocaleTimeString("en-us", { timeStyle: "medium" });
		console.log(date + "; Time: " + time + ": Error: " + msg);
	}
	logInfo(msg: string): void {
		const date = new Date().toLocaleDateString("en-us", { dateStyle: "medium" });
		const time = new Date().toLocaleTimeString("en-us", { timeStyle: "medium" });
		console.log(date + "; Time: " + time + ": Msg: " + msg);
	}
}
