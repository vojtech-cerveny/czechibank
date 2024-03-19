import packageJson from "@/../package.json";
import { DELETE, HEAD, OPTIONS, PATCH, POST, PUT } from "../routes";
export async function GET(request: Request) {
  return Response.json({
    message: "This is the best bank ever!",
    data: {
      date: new Date(),
      name: packageJson.name,
      version: packageJson.version,
    },
  });
}

export { DELETE, HEAD, OPTIONS, PATCH, POST, PUT };
