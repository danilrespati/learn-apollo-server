import { Query, Resolver } from "type-graphql";
import { Book } from "../entity/Book.entity";
import { BooksData } from "../sampleData/Book.data";

@Resolver(Book)
export class BookResolver {
  @Query(() => [Book])
  books() {
    return BooksData;
  }
}
