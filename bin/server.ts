import App from "@/app";
import { variables } from "@/constants";

const server = new App({
	port: variables.SERVER_PORT,
	dataLimit: variables.DATA_LIMIT,
	whitelist: ["http://localhost:8081"],
});

server.start();
