import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
import { decodeAuthHeader, AuthTokenPayload } from "./utils/auth";
import { Request } from "express";

export interface Context {
  // 1 First you have defined the Context interface, which specifies what objects will be attached to the context object. Right now it’s just an instance of PrismaClient, but this can change as the project grows.

  prisma: PrismaClient;
  userId?: number;
}

export const context = ({ req }: { req: Request }): Context => {
  const token =
    req && req.headers.authorization
      ? decodeAuthHeader(req.headers.authorization)
      : null;

  return {
    prisma,
    userId: token?.userId,
  };
};
