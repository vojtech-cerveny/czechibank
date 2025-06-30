import { loreleiNeutral } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { User } from "@prisma/client";
import { useMemo } from "react";

export function UserAvatar({ userAvatarConfig, size }: { userAvatarConfig: User["avatarConfig"]; size: number }) {
  const avatar = useMemo(() => {
    return createAvatar(loreleiNeutral, JSON.parse(userAvatarConfig)).toDataUri();
  }, []);
  return <img className={`w-${size} h-${size} rounded-full`} src={avatar} />;
}
