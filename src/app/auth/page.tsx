import { getServerAuthSession } from "@/server/auth";

export default async function AuthPage() {
  const session = await getServerAuthSession();
  return <div>{JSON.stringify(session)}</div>;
}
