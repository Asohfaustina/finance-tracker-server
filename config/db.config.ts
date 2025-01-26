import { variables } from "@/constants";

export default{
  "development": {
    "username": variables.DB.development.username,
    "password": variables.DB.development.password,
    "database": variables.DB.development.database,
    "host": variables.DB.development.host,
    "port": variables.DB.development.port,
    "dialect": variables.DB.development.dialect
  },
  "production": {
    "username": variables.DB.production.username,
    "password": variables.DB.production.password,
    "database": variables.DB.production.database,
    "host": variables.DB.production.host,
    "port": variables.DB.production.port,
    "dialect": variables.DB.production.dialect
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
}
