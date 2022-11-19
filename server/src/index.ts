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
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import * as dotenv from "dotenv";
import { User } from "./entity/User.entity";
import {
  createAccessToken,
  createRefreshToken,
  setRefreshToken,
} from "./utils/jwt";

dotenv.config();

AppDataSource.initialize()
  .then(async () => {
    await initData();
    const app = express();

    app.use(
      cors({ origin: "https://studio.apollographql.com", credentials: true })
    );

    app.use(cookieParser());

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

    app.post("/refresh_token", async (req, res) => {
      try {
        const refreshToken = req.cookies.kfb;
        if (!refreshToken) {
          throw new Error("Token not found");
        }

        const payload = verify(
          refreshToken,
          process.env.JWT_REFRESH_TOKEN_SECRET!
        );
        if (
          typeof payload == "string" ||
          !payload.userId ||
          !payload.tokenVersion
        ) {
          throw new Error("Bad token");
        }

        const user = await User.findOneBy({ _id: payload.userId });
        if (!user || user.tokenVersion !== payload.tokenVersion) {
          throw new Error("Not authenticated");
        }

        setRefreshToken(res, createRefreshToken(user));
        res.send({ ok: true, accessToken: createAccessToken(user) });
      } catch (error) {
        console.error(error);
        res.send({ ok: false, accessToken: `` });
        return;
      }
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
