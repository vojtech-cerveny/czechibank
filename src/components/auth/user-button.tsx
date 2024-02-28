import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserById } from "@/domain/user-domain/user-repository";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { Button } from "../ui/button";
import { UserAvatar } from "../user/avatar";
import { SignIn } from "./auth-components";
import { SignOut } from "./sign-out";

export default async function UserButton() {
  const session = await getSession();

  if (!session?.user) return <SignIn />;
  const user = await getUserById(session.user.id);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="rounded-full border-2 border-solid border-slate-500 hover:border-slate-200">
          <UserAvatar size={8} userAvatarConfig={user!.avatarConfig} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="leading-none">{session.user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem>
          <Link href="/profile" className="w-full">
            <Button className="w-full">Profile</Button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SignOut className="w-full" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
