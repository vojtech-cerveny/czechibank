import { RegisterForm } from "@/components/register/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getSession } from "@/lib/auth";
import { AlertCircle } from "lucide-react";

export default async function RegisterPage() {
  const session = await getSession();

  if (session) {
    return (
      <div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>You are already registered</AlertTitle>
          <AlertDescription>
            You are already registered and logged in. If you need to create new account, please logout first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <div>
      <h1 className="my-8 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Register</h1>
      <RegisterForm />
    </div>
  );
}
