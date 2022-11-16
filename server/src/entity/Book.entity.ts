import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Book {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field()
  author: string;
}
