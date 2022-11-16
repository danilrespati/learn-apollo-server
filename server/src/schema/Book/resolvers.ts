import { Query, Resolver } from "type-graphql";
import { Book } from "./types";
import { BooksData } from "./data";

@Resolver(Book)
export class BookResolver {
  @Query(() => [Book])
  books() {
    return BooksData;
  }
}
