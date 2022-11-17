import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
@Entity()
@ObjectType()
export class Book extends BaseEntity {
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
