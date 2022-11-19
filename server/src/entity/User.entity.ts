import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  _id: number;

  @Column({ unique: true })
  @Field()
  username: string;

  @Column()
  @Field() //remove on prod
  password: string;

  @Column({ default: 1 })
  @Field()
  tokenVersion: number;
}
