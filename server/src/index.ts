import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import { createServer } from "http";
import { buildSchema } from "type-graphql";
import { BookResolver } from "./resolver/Book.resolver";
import { AppDataSource } from "./data-source";
import { Book } from "./entity/Book.entity";
import { BooksData } from "./sampleData/Book.data";
import { Member } from "./entity/Member.entity";
import { MembersData } from "./sampleData/Member.data";
import { MemberResolver } from "./resolver/Member.resolver";

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const httpServer = createServer(app);
    const server = new ApolloServer({
      schema: await buildSchema({ resolvers: [BookResolver, MemberResolver] }),
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
        await Book.save(book);
      });
      console.log("Book database is ready!");
    }

    //insert users data from sample data
    const members = await Member.find();
    if (members.length == 0) {
      console.log("Member database is empty! \nAdding from sample data...");
      MembersData.forEach(async (e) => {
        const member = Object.assign(new Member(), e);
        await member.save();
      });
      console.log("Member database is ready!");
    }

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
      httpServer.listen({ port: 4000 }, resolve)
    );

    console.log(`🚀 Server ready at: http://localhost:4000/graphql`);
  })
  .catch((error) => {
    console.log(error);
  });
