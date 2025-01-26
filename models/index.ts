import { variables } from "@/constants";
import { Sequelize } from "sequelize";
import envConfig from "@/config";
envConfig()
 

const configModule = require(__dirname + "/../config/db.config.ts");

const config = configModule.default[variables.NODE_ENV];

const sequelize = config?.url
	? new Sequelize(config.url, config)
	: new Sequelize(config.database, config.username, config.password, config);

export { Sequelize, sequelize };
