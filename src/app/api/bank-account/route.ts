import { getBankAccountsByUserId } from "@/domain/bankAccount-domain/ba-repository";

import { ApiError, DELETE, HEAD, OPTIONS, PATCH, POST, PUT, authenticateRequest, handleErrors } from "../routes";

export async function GET(request: Request) {
  try {
    console.log("GET /bank-account/route.ts");
    const user = await authenticateRequest(request);
    const bankAccount = await getBankAccountsByUserId(user.id);
    return Response.json({ data: { bankAccount } });
  } catch (error) {
    if (error instanceof ApiError) {
      return handleErrors(error);
    } else {
      return Response.json({ error: "Internal Server Error", message: error }, { status: 500 });
    }
  }
}

export { DELETE, HEAD, OPTIONS, PATCH, POST, PUT };
