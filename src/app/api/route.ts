import { getUserByApiKey } from "@/domain/user-domain/user-repository";
import { User } from "@prisma/client";

export async function HEAD(request: Request) {
  return Response.json({ error: "Method Not Allowed" }, { status: 405 });
}

export async function POST(request: Request) {
  return Response.json({ error: "Method Not Allowed" }, { status: 405 });
}

export async function PUT(request: Request) {
  return Response.json({ error: "Method Not Allowed" }, { status: 405 });
}

export async function DELETE(request: Request) {
  return Response.json({ error: "Method Not Allowed" }, { status: 405 });
}

export async function PATCH(request: Request) {
  return Response.json({ error: "Method Not Allowed" }, { status: 405 });
}

export async function OPTIONS(request: Request) {
  return Response.json({ error: "Method Not Allowed" }, { status: 405 });
}

export async function GET(request: Request) {
  return Response.json({ error: "Method Not Allowed" }, { status: 405 });
}

export async function handleErrors(err: Error) {
  if (err.message === "Bad Request") {
    return new Response(JSON.stringify({ error: "Bad Request" }), { status: 400 });
  } else if (err.message === "Unauthorized") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  } else {
    return new Response(JSON.stringify({ error: "Internal problem :O" }), { status: 500 });
  }
}

export async function authenticateRequest(request: Request): Promise<User> {
  const apiKey = request.headers.get("Authorization")?.split("Bearer ")[1];
  console.log(apiKey);
  if (!apiKey) {
    throw new Error("Bad Request");
  }
  const user = await getUserByApiKey(apiKey);
  if (!user) {
    throw new Error("Unauthorized");
  }
  console.log(user);
  return user;
}
