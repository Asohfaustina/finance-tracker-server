import App from "@/app";
import { variables } from "@/constants";
import logger from "@/loggers/bunyan-logger";

const server = new App({
	port: variables.SERVER_PORT,
	dataLimit: variables.DATA_LIMIT,
	logger: new logger(),
	whitelist: ["http://localhost:8081"],
});

server.start();
