import { createBankAccount } from "@/domain/bankAccount-domain/ba-repository";
import { authenticateRequest, handleErrors } from "../../routes";
import { isError } from "../../transactions/route";

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
    return Response.json({ data: { response } });
  } catch (error) {
    handleErrors(error as Error);
  }
}
