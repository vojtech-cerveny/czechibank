import { getBankAccountsByUserId } from "@/domain/bankAccount-domain/ba-repository";

import { DELETE, HEAD, OPTIONS, PATCH, POST, PUT, authenticateRequest, handleErrors } from "../routes";

export async function GET(request: Request) {
  try {
    console.log("GET /bank-account/route.ts");
    const user = await authenticateRequest(request);
    console.log(user);
    const bankAccount = await getBankAccountsByUserId(user.id);
    console.log(bankAccount);
    return Response.json({ data: { bankAccount } });
  } catch (error) {
    const err = error as unknown as Error;
    handleErrors(err);
  }
  return Response.json({ error: "Internal Server Error" }, { status: 500 });
}

export { DELETE, HEAD, OPTIONS, PATCH, POST, PUT };
