import { Field, ObjectType } from "type-graphql";

@ObjectType()
class UserDetails {
  @Field()
  name: string;

  @Field()
  balance: number;
}

@ObjectType()
export class User {
  @Field()
  _id: string;

  @Field()
  index: number;

  @Field()
  guid: string;

  @Field()
  isActive: boolean;

  @Field(() => [UserDetails])
  details: UserDetails[];

  @Field()
  greeting: string;

  @Field()
  favoriteTransportation: string;
}
