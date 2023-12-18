import crypto from "crypto";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { env } from "@/env.mjs";

export const getSelf = async () => {
  const session = await auth();
  const self = session?.user;

  if (!self?.id) {
    throw new Error("Self not found");
  }

  const user = await db.user.findUnique({
    where: { id: self.id },
  });

  if (!user) {
    throw new Error("Not found");
  }

  return user;
};

export const getSelfByUsername = async (username: string) => {
  const session = await auth();
  const self = session?.user;

  if (!self?.id) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (self.id !== user.id) {
    throw new Error("You have no permission to access this user");
  }

  return user;
};

export function passwordToSalt(password: string): string {
  const hash = crypto.createHmac("sha512", env.PASSWORD_SALT);
  return hash.digest("hex");
}

export function authUserByPassword(username: string, password: string) {
  return db.user.findFirst({
    where: {
      username,
      saltedPassword: passwordToSalt(password),
    },
  });
}

export async function addUser(username: string, password: string) {
  const saltedPassword = passwordToSalt(password);
  crypto.createHash;
  return await db.user.create({
    data: {
      username,
      saltedPassword,
    },
  });
}
