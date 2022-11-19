import { sign } from "jsonwebtoken";
import { User } from "../entity/User.entity";
import { Response } from "express";

export const createAccessToken = (user: User) => {
  return sign({ userId: user._id }, process.env.JWT_ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXP,
  });
};

export const createRefreshToken = (user: User) => {
  return sign({ userId: user._id }, process.env.JWT_REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXP,
  });
};

export const setRefreshToken = (res: Response, token: string) => {
  res.cookie("kfb", token, {
    path: "/refresh_token",
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
};
