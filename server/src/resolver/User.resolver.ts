import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "../entity/User.entity";
import { hash, verify } from "argon2";
import {
  createAccessToken,
  createRefreshToken,
  setRefreshToken,
} from "../utils/jwt";
import { MyContext } from "../utils/MyContext";

@ObjectType()
class LoginRespose {
  @Field()
  status: boolean;

  @Field({ defaultValue: "" })
  accessToken: string;

  @Field(() => User, { nullable: true })
  user: User;
}

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async users() {
    return await User.find({ order: { _id: "ASC" } });
  }

  @Query(() => User)
  async user(@Arg("id") _id: number) {
    return await User.findOneBy({ _id });
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("username") username: string,
    @Arg("password") password: string
  ) {
    const hashedPassword = await hash(password);
    try {
      await User.insert({
        username,
        password: hashedPassword,
      });
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  }

  @Mutation(() => LoginRespose)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ) {
    const login = new LoginRespose();
    try {
      if (!username || !password)
        throw new Error("Username and password needed");

      const user = await User.findOneBy({ username });
      if (!user) throw new Error("Could not find user");

      const valid = await verify(user.password, password);
      if (!valid) throw new Error("Bad password");

      login.status = true;
      login.user = user;
      login.accessToken = createAccessToken(user);

      setRefreshToken(res, createRefreshToken(user));
    } catch (error) {
      console.error(error);
      login.status = false;
    }
    return login;
  }

  @Mutation(() => Boolean)
  async revokeRefreshToken(@Arg("userId") id: number) {
    const user = await User.findOneBy({ _id: id });
    if (!user) {
      return false;
    }

    user.tokenVersion++;
    await User.save(user);
    return true;
  }
}
