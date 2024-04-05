import { sendMoneyToBankNumber } from "@/domain/transaction-domain/transaction-repository";
import { isError } from "../../lib";
import { ApiError, authenticateRequest, handleErrors } from "../../routes";

export async function POST(request: Request) {
  try {
    const user = await authenticateRequest(request);

    const body = await request.json();
    const { amount, to }: { amount: number; to: string } = body;
    if (!amount || !to) {
      return Response.json({ error: "amount and to are required" }, { status: 400 });
    }
    const response = await sendMoneyToBankNumber({
      amount,
      toBankNumber: to,
      userId: user.id,
      currency: "CZECHITOKEN",
      applicationType: "api",
    });
    if (isError(response)) {
      return Response.json({ error: response }, { status: 400 });
    }
    return Response.json({ data: { response } }, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return handleErrors(error);
    } else {
      return Response.json({ error: "Internal Server Error", message: error }, { status: 500 });
    }
  }
}
