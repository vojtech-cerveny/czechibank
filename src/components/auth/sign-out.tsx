import { processUserSignOut } from "@/domain/user-domain/user-actions";
import { Button } from "../ui/button";

export async function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form action={processUserSignOut} className="w-full">
      <Button variant="ghost" type="submit" className="flex w-full" {...props}>
        Sign Out
      </Button>
    </form>
  );
}
