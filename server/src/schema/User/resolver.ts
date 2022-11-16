import { Query, Resolver } from "type-graphql";
import { User } from "./types";
import { UsersData } from "./data";

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  users() {
    return UsersData;
  }
}
