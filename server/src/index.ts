import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import { json } from "body-parser";
import { buildSchema } from "type-graphql";
import { BookResolver } from "./resolver/Book.resolver";
import { UserResolver } from "./resolver/User.resolver";

const main = async () => {
  const app = express();
  const httpServer = createServer(app);
  const server = new ApolloServer({
    schema: await buildSchema({ resolvers: [BookResolver, UserResolver] }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  app.use("/graphql", cors(), json(), expressMiddleware(server));

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );

  console.log(`🚀 Server ready at: http://localhost:4000/graphql`);
};

main();
