import { DataSource } from "typeorm";
import { config } from "dotenv";
import * as path from "node:path";

config();

const connection = process.env.DATABASE_URL
    ? {
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    }
    : {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    };

const dataSource = new DataSource({
    type: "postgres",
    ...connection,
    schema: "public",
    entities: [path.join(__dirname, "..", "**", "*.entity.ts")],
    migrations: [path.join(__dirname, "migrations", "*.ts")],
    synchronize: false,
},
);

export default dataSource;