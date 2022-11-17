import { Query, Resolver } from "type-graphql";
import { Book } from "../entity/Book.entity";

@Resolver(Book)
export class BookResolver {
  @Query(() => [Book])
  async books() {
    return await Book.find();
  }
}
