import { Query, Resolver } from "type-graphql";
import { User } from "../entity/User.Entity";

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async users() {
    return await User.find();
  }
}
