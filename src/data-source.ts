import "dotenv/config";
import "reflect-metadata";
import path from "path";
import { DataSource, DataSourceOptions } from "typeorm";

const setDataSourceOptions = (): DataSourceOptions => {
  const entitiesPath: string = path.join(__dirname, "./entities/*.{ts,js}");
  const migrationsPath: string = path.join(__dirname, "./migrations/*.{ts,js}");

  const nodeEnv = process.env.NODE_ENV;

  if (nodeEnv === "test") {
    return {
      type: "sqlite",
      database: ":memory:",
      synchronize: true,
      entities: [entitiesPath],
    };
  }

  return {
    type: "postgres",
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT),
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    synchronize: false,
    logging: true,
    entities: [entitiesPath],
    migrations: [migrationsPath],
  };
};

const dataSourceOptions = setDataSourceOptions();
export const AppDataSource = new DataSource(dataSourceOptions);
