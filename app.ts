import { type Application } from "express";
import express from "express";
import { Sequelize } from "sequelize";
import { sequelize } from "./models";
import { variables } from "./constants";
import { AppInstanceOptions } from "./global.types";
import compression from "compression";
import cors from "cors";
import routes from "./routes";
import handleNotFoundError from "./middleware/errors/handle-not-found-error";
import convertError from "./middleware/errors/convert-error";
import http from "http";
import morgan from "@/config/morgan.config";
import ip from "ip"

export default class App {
	private sequelize: Sequelize;
	public app: Application;
	public environment: string = variables.NODE_ENV;
	private isDevelopment: boolean = this.environment !== "production";
	private isListening: boolean = false;
	private server: http.Server;
	private address: string = ip.address()
	private serverAddress : string
	public whitelist: string[];
	public limit: string;
	public port: number;

	constructor(options: AppInstanceOptions) {
		this.app = express();
		this.sequelize = sequelize;
		this.whitelist = options.whitelist;
		this.limit = options.dataLimit;
		this.port = options.port;
		this.serverAddress = `http://${this.address}:${this.port}`;
		this.server = new http.Server(this.app);
		this.app.set("port", this.port);

		this.middleware();

		this.server.on("error", this.onError);
		this.server.on("close", () => {
			this.isListening = false;
		});

		this.server.on("listening", () => {
			console.log(`Server is active on ${this.serverAddress}`);
		});
	}

	private middleware() {
		this.app.use(compression());
		this.app.use(cors({ credentials: true, origin: this.whitelist }));
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(express.json({ limit: this.limit }));
		this.app.use(morgan.successHandler);
		this.app.use(morgan.errorHandler);
		this.app.use("/v1/", routes());
		this.app.use(handleNotFoundError);
		this.app.use(convertError);
	}

	public async start() {
		if (!this.isListening)
			try {
				await this.sequelize.authenticate();
				console.log("Connection to the database has been established successfully.");
				await this.sync();

				this.server.listen(this.port, () => {
					this.isListening = true;
				});
			} catch (error) {
				console.error("Database connection error:", error);
				process.exit(1);
			}
	}

	private async sync() {
		await this.sequelize.sync({ alter: false});
		if (this.isDevelopment) {
			console.log("Connection synced successfully");
		}
	}

	public close() {
		this.server.close(() => {
			this.isListening = false;
		});
	}

	private onError(error: NodeJS.ErrnoException) {
		if (error.syscall !== "listen") throw error;
		const bind = `Port ${this.port}`;
		switch (error.code) {
			case "EACCES":
				console.error(`${bind} requires elevated privileges.`);
				process.exit(1);
			case "EADDRINUSE":
				console.error(`${bind} is already in use.`);
				process.exit(1);
			default:
				throw error;
		}
	}
}
