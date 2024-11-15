/* eslint-disable react-hooks/rules-of-hooks */
import { isExtension } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function useAuthentication() {
  if (isExtension()) {
    return useExtensionAuthentication();
  } else {
    return useNextAuthentication();
  }
}

function useExtensionAuthentication() {
  const signIn = () => {
    window.location.href = "/?login=true";
  };

  const signOut = async () => {
    chrome.runtime.sendMessage(
      {
        type: "SIGN_OUT",
      },
      () => (window.location.href = "/"),
    );
  };

  return {
    signIn,
    signOut,
  };
}

function useNextAuthentication() {
  const router = useRouter();

  const signIn = () => {
    router.push("/auth/signin");
  };

  const signOut = async () => {
    const { signOut: signOutAuth } = await import("next-auth/react");
    void signOutAuth();
  };

  return {
    signIn,
    signOut,
  };
}
