"use server";
import prisma from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/response";
import { generateRandomAvatarConfig } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { createBankAccount } from "../bankAccount-domain/ba-repository";
import { processUserSignIn } from "./user-actions";
import { UserSchema } from "./user-schema";

export async function registerUser(userData: Omit<Prisma.UserCreateInput, "avatarConfig">) {
  const parsedUser = UserSchema.safeParse(userData);

  if (!parsedUser.success) {
    return errorResponse("Invalid user data", parsedUser.error);
  }

  const user = parsedUser.data;

  if (!(await isEmailUnique(user.email))) {
    return errorResponse("Email already exists");
  }

  try {
    const avatarConfig = generateRandomAvatarConfig();

    const prismaUser = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
        sex: user.sex,
        avatarConfig: JSON.stringify(avatarConfig),
      },
    });
    await createBankAccount({ userId: prismaUser.id, currency: "CZECHITOKEN" });
    await processUserSignIn({ email: prismaUser.email, password: prismaUser.password });
    // redirect("/");

    return successResponse("User created successfully", prismaUser);
  } catch (e) {
    return errorResponse("An error occurred while creating the user");
  }
}

export async function isEmailUnique(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  return user === null;
}

export async function signInUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (user === null) {
    return errorResponse("User not found");
  }

  if (user.password !== password) {
    return errorResponse("Invalid password");
  }

  return successResponse("User signed in", user);
}

export async function getAllUsers() {
  const users = await prisma.user.findMany({ include: { BankAccount: true } });

  return successResponse("Users found", users);
}

export async function regenerateApiKey(userId: string) {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      apiKey: Math.random().toString(36).substring(2),
    },
  });

  return successResponse("API key regenerated", user);
}

export async function regenerateAvatarConfig(userId: string) {
  const avatarConfig = generateRandomAvatarConfig();

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      avatarConfig: JSON.stringify(avatarConfig),
    },
  });

  return successResponse("Avatar config regenerated", user);
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
}

export async function getUserByApiKey(apiKey: string) {
  const user = await prisma.user.findFirst({
    where: {
      apiKey: apiKey,
    },
  });

  return user;
}
