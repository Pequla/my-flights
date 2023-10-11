import dotenv from "dotenv"
import { DataSource } from "typeorm"
import { User } from "./entities/User";
import { UserToken } from "./entities/UserToken";
import { UserFlight } from "./entities/UserFlight";

// Connecting to database
dotenv.config();
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DATABASE_HOST,
    port: Number.parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [User, UserToken, UserFlight],
    logging: false,
})