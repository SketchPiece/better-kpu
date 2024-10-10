import { signOut as signOutAuth } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function useAuthentication() {
  const router = useRouter();

  const signIn = () => {
    // if extension
    // window.location.href = "/?login=true";
    // else
    router.push("/auth/signin");
  };

  const signOut = () => {
    // console.log("sign out");
    void signOutAuth();
  };

  return {
    signIn,
    signOut,
  };
}
