import { getAllBankAccounts } from "@/domain/bankAccount-domain/ba-repository";

import { ApiError, DELETE, HEAD, OPTIONS, PATCH, POST, PUT, authenticateRequest, handleErrors } from "../../routes";

export async function GET(request: Request) {
  try {
    console.log("GET /bank-account/getAll/route.ts");
    const user = await authenticateRequest(request);
    console.log(user);
    const bankAccounts = await getAllBankAccounts();
    console.log(bankAccounts);
    return Response.json({ data: { bankAccount: bankAccounts } }, { status: 200 });
  } catch (error) {
    if (error instanceof ApiError) {
      return handleErrors(error);
    } else {
      return Response.json({ error: "Internal Server Error", message: error }, { status: 500 });
    }
  }
}

export { DELETE, HEAD, OPTIONS, PATCH, POST, PUT };
