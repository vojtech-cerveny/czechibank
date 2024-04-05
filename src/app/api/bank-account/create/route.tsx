import { createBankAccount } from "@/domain/bankAccount-domain/ba-repository";
import { isError } from "../../lib";
import { ApiError, authenticateRequest, handleErrors } from "../../routes";

export async function POST(request: Request) {
  try {
    const user = await authenticateRequest(request);

    const body = await request.json();
    const { name }: { name: string | undefined } = body;

    const response = await createBankAccount({
      currency: "CZECHITOKEN",
      userId: user.id,
      name: name,
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
