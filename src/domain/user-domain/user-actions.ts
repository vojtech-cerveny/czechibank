"use server";

import { encrypt } from "@/lib/auth";
import { Sex } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import userService from "./user.service";

export async function processUserRegistration(formData: FormData) {
  const userData = {
    email: formData.get("email") as string,
    name: formData.get("name") as string,
    password: formData.get("password") as string,
    sex: formData.get("sex") as Sex,
  };

  const response = await userService.createUser(userData);
  if (!response.success) {
    await processUserSignIn({ email: userData.email, password: userData.password });
  }
  return response;
}

export async function processUserSignIn({ email, password }: { email: string; password: string }) {
  const response = await userService.signInUser(email, password);

  console.log(response.success);
  if (!response.success) {
    return response;
  }
  const user = response.data;
  user.password = "";
  user.apiKey = "";

  const expires = new Date(Date.now() + 60 * 60 * 24 * 10000);
  // TODO: we don't set anything from the props in function :D We need to fix it.
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  (await cookies()).set("session", session, { expires, httpOnly: true });
  redirect("/");
}

export async function processUserSignOut() {
  (await cookies()).delete("session");
}
