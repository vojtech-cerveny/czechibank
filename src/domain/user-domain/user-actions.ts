"use server";
import { encrypt } from "@/lib/auth";
import { Sex } from "@prisma/client";
import { cookies } from "next/headers";
import { registerUser, signInUser } from "./user-repository";

export async function processUserRegistration(formData: FormData) {
  const userData = {
    email: formData.get("email") as string,
    name: formData.get("name") as string,
    password: formData.get("password") as string,
    sex: formData.get("sex") as Sex,
  };

  const response = await registerUser(userData);

  return response;
}

export async function processUserSignIn({ email, password }: { email: string; password: string }) {
  const response = await signInUser(email, password);

  console.log(response.success);
  if (!response.success) {
    return response;
  }
  const user = response.data;
  user.password = "";
  user.apiKey = "";

  const expires = new Date(Date.now() + 60 * 60 * 24 * 1000);
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  cookies().set("session", session, { expires, httpOnly: true });

  return response;
}

export async function processUserSignOut() {
  cookies().delete("session");
}
