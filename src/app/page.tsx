import HomePage from "@/components/home-page";
import type { UserProfile } from "@/lib/kpu-api/types";
import { getUsernameFromEmail } from "@/lib/utils";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";

async function getUserProfile(): Promise<UserProfile | undefined> {
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

export default async function Home() {
  const userProfile = await getUserProfile();
  const quickServices = await api.kpu.getQuickServices({
    roles: ["employee", "student"],
  });

  return (
    <HomePage
      initialUserProfile={userProfile}
      initialQuickServices={quickServices}
    />
  );
}
