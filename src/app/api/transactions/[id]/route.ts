import { getTransactionDetailById } from "@/domain/transaction-domain/transaction-repository";
import { authenticateRequest } from "../../route";

export { DELETE, HEAD, OPTIONS, PATCH, POST, PUT } from "../route";

export async function GET(request: Request, context: { params: { id: string } }) {
  const user = await authenticateRequest(request);

  const transaction = await getTransactionDetailById(context.params.id, user.id);

  return Response.json({ data: { transaction } });
}
