import "reflect-metadata";
import { DataSource } from "typeorm";
import { Book } from "./entity/Book.entity";
import { User } from "./entity/User.Entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "learn-apollo-server-test",
  synchronize: true,
  logging: false,
  entities: [Book, User],
  migrations: [],
  subscribers: [],
});
