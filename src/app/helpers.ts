import type { UserProfile } from "@/lib/kpu-api/types";
import { capitalize } from "@/lib/utils";
import { getServerAuthSession } from "@/server/auth";

export function getUsernameFromEmail(email: string) {
  const name = email.split("@")[0] ?? "justin.case";
  const firstName = capitalize(name.split(".")[0] ?? "Justin");
  const lastName = capitalize(name.split(".")[1] ?? "Case");

  return {
    username: `${firstName} ${lastName}`,
    greetingName: firstName,
    initials: firstName.charAt(0) + lastName.charAt(0),
  };
}

export async function getUserProfile(): Promise<UserProfile | undefined> {
  const session = await getServerAuthSession();

  if (!session?.user.email || !session.user.id) return undefined;
  const email = session.user.email;
  const { username, greetingName, initials } = getUsernameFromEmail(email);
  return {
    email,
    username,
    greetingName,
    userId: session.user.id,
    initials,
  };
}
