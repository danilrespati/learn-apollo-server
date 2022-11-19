import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import { createServer } from "http";
import { buildSchema } from "type-graphql";
import cors from "cors";
import { AppDataSource } from "./data-source";
import { Book } from "./entity/Book.entity";
import { Member } from "./entity/Member.entity";
import { initData } from "./utils/initData";
import { BookResolver } from "./resolver/Book.resolver";
import { MemberResolver } from "./resolver/Member.resolver";
import { UserResolver } from "./resolver/User.resolver";
import * as dotenv from "dotenv";

dotenv.config();

AppDataSource.initialize()
  .then(async () => {
    await initData();
    const app = express();

    app.use(
      cors({ origin: "https://studio.apollographql.com", credentials: true })
    );

    const httpServer = createServer(app);
    const server = new ApolloServer({
      schema: await buildSchema({
        resolvers: [BookResolver, MemberResolver, UserResolver],
      }),
      context: ({ req, res }) => ({ req, res }),
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();
    server.applyMiddleware({ app, cors: false });

    app.get("/books", async (_req, res) => {
      const books = await Book.find();
      books.forEach((book) => {
        res.write(JSON.stringify(book, null, 3));
      });
      res.end();
    });

    app.get("/members", async (_req, res) => {
      const members = await Member.find();
      members.forEach((member) => {
        res.write(JSON.stringify(member, null, 3));
      });
      res.end();
    });

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: process.env.PORT }, resolve)
    );

    console.log(
      `🚀 Server ready at: http://localhost:${process.env.PORT}/graphql`
    );
  })
  .catch((error) => {
    console.log(error);
  });
