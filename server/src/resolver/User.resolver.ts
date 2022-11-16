import { Query, Resolver } from "type-graphql";
import { User } from "../entity/User.Entity";
import { UsersData } from "../sampleData/User.data";

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  users() {
    return UsersData;
  }
}
