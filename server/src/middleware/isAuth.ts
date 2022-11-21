import { verify } from "jsonwebtoken";
import { MyContext } from "../utils/MyContext";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const authorization = context.req.headers.authorization;
  if (!authorization) {
    throw new Error("Not authenticated");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!);
    if (!token || typeof payload == "string") {
      throw new Error("Not authenticated");
    }
    context.payload = payload as any;
  } catch (error) {
    console.error(error);
    throw new Error("Not authenticated");
  }

  return next();
};
