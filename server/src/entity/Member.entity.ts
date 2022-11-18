import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
class MemberDetails {
  @Field()
  name: string;

  @Field()
  balance: number;
}

@Entity()
@ObjectType()
export class Member extends BaseEntity {
  @Column({ unique: true })
  @Field()
  _id: string;

  @PrimaryGeneratedColumn()
  @Field()
  index: number;

  @Column()
  @Field()
  guid: string;

  @Column()
  @Field()
  isActive: boolean;

  @Column({ type: "json" })
  @Field(() => [MemberDetails])
  details: MemberDetails[];

  @Column({ type: "text" })
  @Field()
  greeting: string;

  @Column()
  @Field()
  favoriteTransportation: string;
}
