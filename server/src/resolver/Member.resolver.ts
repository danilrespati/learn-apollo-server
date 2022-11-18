import { Member } from "../entity/Member.entity";
import { Query, Resolver } from "type-graphql";

@Resolver(Member)
export class MemberResolver {
  @Query(() => [Member])
  async Members() {
    return await Member.find({ order: { index: "ASC" } });
  }
}
