import { signOut as signOutAuth } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function useAuthentication() {
  const router = useRouter();

  const signIn = () => {
    router.push("/auth/signin");
  };

  const signOut = () => {
    void signOutAuth();
  };

  return {
    signIn,
    signOut,
  };
}
