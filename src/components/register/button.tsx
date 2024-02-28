import { getSession } from "@/lib/auth";
import Link from "next/link";
import { Button } from "../ui/button";

export async function RegisterButton() {
  const session = await getSession();
  if (session) {
    return;
  }
  return (
    <>
      <Link href={"/register"}>
        <Button>Register</Button>
      </Link>
    </>
  );
}
