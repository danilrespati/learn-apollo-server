import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import { createServer } from "http";
import { buildSchema } from "type-graphql";
import { BookResolver } from "./resolver/Book.resolver";
import { UserResolver } from "./resolver/User.resolver";
import { AppDataSource } from "./data-source";
import { Book } from "./entity/Book.entity";
import { BooksData } from "./sampleData/Book.data";
import { User } from "./entity/User.Entity";
import { UsersData } from "./sampleData/User.data";

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const httpServer = createServer(app);
    const server = new ApolloServer({
      schema: await buildSchema({ resolvers: [BookResolver, UserResolver] }),
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();
    server.applyMiddleware({ app });

    //insert books data from sample data
    const books = await Book.find();
    if (books.length == 0) {
      console.log("Book database is empty! \nAdding from sample data...");
      BooksData.forEach(async (e) => {
        const book = Object.assign(new Book(), e);
        await book.save();
      });
      console.log("Book database is ready!");
    }

    //insert users data from sample data
    const users = await User.find();
    if (users.length == 0) {
      console.log("User database is empty! \nAdding from sample data...");
      UsersData.forEach(async (e) => {
        const user = Object.assign(new User(), e);
        await user.save();
      });
      console.log("User database is ready!");
    }

    app.get("/books", async (_req, res) => {
      const books = await Book.find();
      books.forEach((book) => {
        res.write(JSON.stringify(book, null, 3));
      });
      res.end();
    });

    app.get("/users", async (_req, res) => {
      const users = await User.find();
      users.forEach((user) => {
        res.write(JSON.stringify(user, null, 3));
      });
      res.end();
    });

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: 4000 }, resolve)
    );

    console.log(`🚀 Server ready at: http://localhost:4000/graphql`);
  })
  .catch((error) => {
    console.log(error);
  });
