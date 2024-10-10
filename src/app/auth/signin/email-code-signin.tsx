"use client";
import { AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { useState } from "react";
import CodeForm from "./code-form";
import EmailForm from "./email-form";

export default function EmailCodeSignIn() {
  const [email, setEmail] = useState("");
  const [isVerificationStep, setIsVerificationStep] = useState(false);

  const handleCodeSubmit = (code: string) => {
    const authCallback = `/api/auth/callback/email?email=${encodeURIComponent(
      email,
    )}&token=${code}&callbackUrl=/`;
    window.location.href = authCallback;
  };

  const sendVerificationCode = async () => {
    const result = await signIn("email", {
      email,
      redirect: false,
    });
    if (result?.error) return console.log(result.error);
  };

  const handleEmailSubmit = async (email: string) => {
    setEmail(email);
    setIsVerificationStep(true);
    await sendVerificationCode();
    setIsVerificationStep(true);
  };

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
        />
      )}
    </AnimatePresence>
  );
}
