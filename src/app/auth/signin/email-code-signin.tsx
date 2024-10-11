"use client";
import { AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { useState } from "react";
import CodeForm from "./code-form";
import EmailForm from "./email-form";
import { useMutation } from "@tanstack/react-query";

export default function EmailCodeSignIn() {
  const [email, setEmail] = useState("");
  const [isVerificationStep, setIsVerificationStep] = useState(false);

  const handleCodeSubmit = (code: string) => {
    const authCallback = `/api/auth/callback/email?email=${encodeURIComponent(
      email,
    )}&token=${code}&callbackUrl=/`;
    window.location.href = authCallback;
  };

  const sendVerificationCode = async (emailParam?: string) => {
    const result = await signIn("email", {
      email: emailParam ?? email,
      redirect: false,
    });
    if (result?.error)
      return console.error("Error sending verification code", result);
  };

  const { mutate: handleEmailSubmit, isPending } = useMutation({
    mutationFn: async (email: string) => {
      if (isPending) return;
      setEmail(email);
      await sendVerificationCode(email);
      setIsVerificationStep(true);
    },
  });

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isVerificationStep ? (
        <CodeForm
          key="code"
          email={email}
          onEditEmail={() => setIsVerificationStep(false)}
          onSubmit={handleCodeSubmit}
          onResend={sendVerificationCode}
        />
      ) : (
        <EmailForm
          key="email"
          defaultEmail={email}
          onSubmit={handleEmailSubmit}
          emailPending={isPending}
        />
      )}
    </AnimatePresence>
  );
}
