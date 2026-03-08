import { DataSource } from "typeorm";
import { config } from "dotenv";
import * as path from "node:path";

config();

const dataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    schema: "public",
    entities: [path.join(__dirname, "..", "**", "*.entity.js")],
    migrations: [path.join(__dirname, "migrations", "*.js")],
    synchronize: false,
},
);

export default dataSource;