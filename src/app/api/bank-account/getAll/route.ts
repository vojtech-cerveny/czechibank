import { getAllBankAccounts } from "@/domain/bankAccount-domain/ba-repository";

import { DELETE, HEAD, OPTIONS, PATCH, POST, PUT, authenticateRequest, handleErrors } from "../../routes";

export async function GET(request: Request) {
  try {
    console.log("GET /bank-account/getAll/route.ts");
    const user = await authenticateRequest(request);
    console.log(user);
    const bankAccounts = await getAllBankAccounts();
    console.log(bankAccounts);
    return Response.json({ data: { bankAccount: bankAccounts } });
  } catch (error) {
    const err = error as unknown as Error;
    handleErrors(err);
  }
  return Response.json({ error: "Internal Server Error" }, { status: 500 });
}

export { DELETE, HEAD, OPTIONS, PATCH, POST, PUT };
