import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Book } from "../entity/Book.entity";

@Resolver(Book)
export class BookResolver {
  @Query(() => [Book])
  async books() {
    return await Book.find();
  }

  @Query(() => Book)
  async book(@Arg("id") id: number) {
    return await Book.findOneBy({ id });
  }

  @Mutation(() => Boolean)
  async createBook(@Arg("title") title: string, @Arg("author") author: string) {
    try {
      await Book.insert({
        title,
        author,
      });
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  }
}
