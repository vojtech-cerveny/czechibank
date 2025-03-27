import { ApiErrorCode, errorResponse, successResponse } from "@/lib/response";
import { generateRandomAvatarConfig } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import bankAccountService from "../bankAccount-domain/ba-service";
import { processUserSignIn } from "./user-actions";
import * as userRepository from "./user-repository";
import { isEmailUnique } from "./user-repository";
import { UserSchema } from "./user-schema";

const userService = {
  async createUser(userData: Omit<Prisma.UserCreateInput, "avatarConfig">, isAPI: boolean = false) {
    const parsedUser = UserSchema.safeParse(userData);

    if (!parsedUser.success) {
      return errorResponse("Invalid user data", ApiErrorCode.VALIDATION_ERROR, parsedUser.error.errors);
    }

    const user = parsedUser.data;

    if (!(await isEmailUnique(user.email))) {
      return errorResponse("Email already exists", ApiErrorCode.EMAIL_ALREADY_EXISTS);
    }
    const avatarConfig = generateRandomAvatarConfig();

    const registeredUser = await userRepository.registerUser({ ...user, avatarConfig: JSON.stringify(avatarConfig) });

    if ("error" in registeredUser) {
      return registeredUser;
    }

    await bankAccountService.createBankAccount({
      userId: registeredUser.data.id,
      currency: "CZECHITOKEN",
      name: "My Bank Account",
    });
    if (!isAPI) {
      await processUserSignIn({ email: user.email, password: user.password });
    }

    return successResponse("User created successfully", registeredUser.data);
  },

  async getUserById(userId: string) {
    const user = await userRepository.getUserById(userId);

    if (!user) {
      return errorResponse("User not found", ApiErrorCode.NOT_FOUND);
    }

    return successResponse("User found", user);
  },

  async getUserByBearerToken(bearerToken: string) {
    const user = await userRepository.getUserByApiKey(bearerToken);

    if (!user) {
      return errorResponse("User not found", ApiErrorCode.NOT_FOUND);
    }

    return successResponse("User found", user);
  },

  async signInUser(email: string, password: string) {
    const user = await userRepository.signInUser(email, password);

    if (user === null) {
      return errorResponse("User not found", ApiErrorCode.NOT_FOUND);
    }

    if (user.password !== password) {
      return errorResponse("Invalid password", ApiErrorCode.INVALID_PASSWORD);
    }

    return successResponse("User signed in", user);
  },

  async regenerateApiKey(userId: string) {
    const user = await userRepository.regenerateApiKey(userId);

    return successResponse("API key regenerated", user);
  },

  async regenerateAvatarConfig(userId: string) {
    const avatarConfig = generateRandomAvatarConfig();

    const user = await userRepository.regenerateAvatarConfig(userId, JSON.stringify(avatarConfig));

    return successResponse("Avatar config regenerated", user);
  },

  async getAllUsers() {
    const users = await userRepository.getAllUsers();

    return successResponse("Users found", users);
  },
};

export default userService;
