import { Member } from "../entity/Member.entity";
import { Arg, Query, Resolver } from "type-graphql";

@Resolver(Member)
export class MemberResolver {
  @Query(() => [Member])
  async members() {
    return await Member.find({ order: { index: "ASC" } });
  }

  @Query(() => Member)
  async member(@Arg("id") _id: string) {
    return await Member.findOneBy({ _id });
  }
}
