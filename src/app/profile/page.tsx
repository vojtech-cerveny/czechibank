import { ApiKeyForm } from "@/components/profile/apikey-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserAvatar } from "@/components/user/avatar";
import { getUserById, regenerateApiKey, regenerateAvatarConfig } from "@/domain/user-domain/user-repository";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect("/signin");
  }
  const user = await getUserById(session.user.id);

  const handleRegenerateApiKey = async () => {
    "use server";
    console.log("regenerateApiKey");
    await regenerateApiKey(session.user.id);
    revalidatePath("/profile");
  };

  const handleRegenerateAvatarConfig = async () => {
    "use server";
    console.log("regenerateAvatarConfig");
    await regenerateAvatarConfig(session.user.id);
    revalidatePath("/profile");
  };

  return (
    <div>
      <h1 className="my-8 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Profile</h1>
      <Card>
        <CardHeader>Information</CardHeader>
        <CardContent>
          <div className="flex flex-row space-x-2">
            <UserAvatar size={10} userAvatarConfig={user!.avatarConfig} />
            <form action={handleRegenerateAvatarConfig}>
              <Button>Generate new avatar</Button>
            </form>
          </div>

          <Label>Name</Label>
          <p>{user?.name}</p>
          <Label>Email</Label>
          <p>{user?.email}</p>
          <div className="flex flex-row items-end space-x-2">
            <ApiKeyForm apiKey={user!.apiKey} />
            <form action={handleRegenerateApiKey}>
              <Button variant={"outline"}>Generate new Bearer token</Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
