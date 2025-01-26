import { Dialect } from "sequelize";
import envConfig from "@/config";

envConfig();

type DatabaseConfig = {
	username: string;
	password: string;
	host: string;
	port: number;
	database: string;
	dialect: Dialect;
};

const JWT_ACCESS_SECRET =
	process.env.JWT_ACCESS_SECRET ||
	"52ac98947f1c37eabe985ff712f4273b355021b2d490935693028df47dc166bc";
const JWT_REFRESH_SECRET =
	process.env.JWT_REFRESH_SECRET ||
	"0a1da9fb354f5569d68ff8af9b0338bea931468ecb1e61967a5f04ee750de450";

const DATA_LIMIT = process.env.DATA_LIMIT || "100mb";
const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;
const NODE_ENV = process.env.NODE_ENV || "development";
const SERVER_PORT = parseInt(process.env.PORT || "8080");

// CLOUDINARY
const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME || "";
const CLOUDINARY_KEY = process.env.CLOUDINARY_KEY || "";
const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET || "";

// TERMI
const TERMII_URL = process.env.TERMII_URL || "";
const TERMII_TOKEN = process.env.TERMII_TOKEN || "";
const TERMII_CONFIG_ID = process.env.TERMII_CONFIG_ID || "";

//LOCAL
const DB_USERNAME_LOCAL = process.env.DB_USERNAME_LOCAL || "postgres";
const DB_PASSWORD_LOCAL = process.env.DB_PASSWORD_LOCAL || "postgres";
const DB_HOST_LOCAL = process.env.DB_HOST_LOCAL || "localhost";
const DB_PORT_LOCAL = parseInt(process.env.DB_PORT_LOCAL || "5434");
const DB_NAME_LOCAL = process.env.DB_NAME_LOCAL || "postgres";

//LIVE
const DB_USERNAME_LIVE = process.env.DB_USERNAME_LIVE || "postgres";
const DB_PASSWORD_LIVE = process.env.DB_PASSWORD_LIVE || "postgres";
const DB_HOST_LIVE = process.env.DB_HOST_LIVE || "localhost";
const DB_PORT_LIVE = parseInt(process.env.DB_PORT_LIVE || "5432");
const DB_NAME_LIVE = process.env.DB_NAME_LIVE || "postgres";

const LOCAL: DatabaseConfig = {
	username: DB_USERNAME_LOCAL,
	password: DB_PASSWORD_LOCAL,
	host: DB_HOST_LOCAL,
	port: DB_PORT_LOCAL,
	database: DB_NAME_LOCAL,
	dialect: "postgres",
};

const LIVE: DatabaseConfig = {
	username: DB_USERNAME_LIVE,
	password: DB_PASSWORD_LIVE,
	host: DB_HOST_LIVE,
	port: DB_PORT_LIVE,
	database: DB_NAME_LIVE,
	dialect: "postgres",
};

const DB = {
	development: LOCAL,
	production: LIVE,
};

const JWT = {
	access_secret: JWT_ACCESS_SECRET,
	refresh_secret: JWT_REFRESH_SECRET,
};

const CLOUDINARY = {
	name: CLOUDINARY_NAME,
	key: CLOUDINARY_KEY,
	secret: CLOUDINARY_SECRET,
};

const TERMII = {
	url: TERMII_URL,
	token: TERMII_TOKEN,
	config_id: TERMII_CONFIG_ID,
};

export { JWT, DATA_LIMIT, SALT_ROUNDS, NODE_ENV, SERVER_PORT, DB, LIVE, LOCAL, CLOUDINARY, TERMII };
