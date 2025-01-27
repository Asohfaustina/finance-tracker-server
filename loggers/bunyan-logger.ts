import type ILogger from "@/interfaces/logger.interface";
import bunyan from "bunyan";

const log = bunyan.createLogger({ name: "server", level: "info" });

export default class BunyanLogger implements ILogger {
	private bunyanLogger: bunyan;
	constructor() {
		this.bunyanLogger = log;
	}
	logError(msg: string): void {
		this.bunyanLogger.error(msg);
	}
	logInfo(msg: string): void {
		this.bunyanLogger.info(msg);
	}
}
