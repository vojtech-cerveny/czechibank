import { authenticateRequest } from "../routes";

export { DELETE, HEAD, OPTIONS, PATCH, POST, PUT } from "../routes";

export async function GET(request: Request, context: { params: { id: string } }) {
  const user = await authenticateRequest(request);

  return Response.json({ data: { user } });
}
