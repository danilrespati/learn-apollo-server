import { Field, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
class UserDetails {
  @Field()
  name: string;

  @Field()
  balance: number;
}

@Entity()
@ObjectType()
export class User {
  @PrimaryColumn()
  @Field()
  _id: string;

  @Column()
  @Field()
  index: number;

  @Column()
  @Field()
  guid: string;

  @Column()
  @Field()
  isActive: boolean;

  @Column({ type: "json" })
  @Field(() => UserDetails)
  details: UserDetails;

  @Column({ type: "text" })
  @Field()
  greeting: string;

  @Column()
  @Field()
  favoriteTransportation: string;
}
