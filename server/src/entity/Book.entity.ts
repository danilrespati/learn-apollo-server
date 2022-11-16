import { Field, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryColumn } from "typeorm";
@Entity()
@ObjectType()
export class Book {
  @PrimaryColumn()
  @Field()
  id: number;

  @Column({ type: "text" })
  @Field()
  title: string;

  @Column()
  @Field()
  author: string;
}
