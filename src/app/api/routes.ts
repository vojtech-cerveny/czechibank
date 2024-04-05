import { getUserByApiKey } from "@/domain/user-domain/user-repository";
import { User } from "@prisma/client";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

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

export async function handleErrors(err: ApiError) {
  if (err.status === 9400) {
    return Response.json(
      { error: "Bad Request. Did you provide apiKey in the right format?" },
      {
        status: 400,
      },
    );
  }
  if (err.status === 400) {
    return Response.json(
      { error: "Bad Request. Did you provide all required fields?" },
      {
        status: 400,
      },
    );
  } else if (err.status === 401) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  } else {
    return Response.json({ error: "Internal problem :O", message: { err } }, { status: 500 });
  }
}

export async function authenticateRequest(request: Request): Promise<User> {
  const apiKey = request.headers.get("Authorization")?.split("Bearer ")[1];
  if (!apiKey) {
    throw new ApiError("Bad Request - no apiKey provided", 9400);
  }
  const user = await getUserByApiKey(apiKey);
  console.log(user ? "User found" : "User not found");
  if (!user) {
    throw new ApiError("Unauthorized", 401);
  }
  return user;
}
