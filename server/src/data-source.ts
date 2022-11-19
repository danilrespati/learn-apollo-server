import "reflect-metadata";
import { DataSource } from "typeorm";
import { Book } from "./entity/Book.entity";
import { Member } from "./entity/Member.entity";
import { User } from "./entity/User.entity";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT!),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: false,
  entities: [Book, Member, User],
  migrations: [],
  subscribers: [],
});
