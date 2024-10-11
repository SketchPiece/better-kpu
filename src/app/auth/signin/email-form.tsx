import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formAnimationProps } from "./form-animation";
import { z } from "zod";
import { useInput, useSubmit } from "./helpers";

interface EmailFormProps {
  defaultEmail?: string;
  onSubmit?: (email: string) => void;
  emailPending?: boolean;
}

export default function EmailForm({
  defaultEmail,
  onSubmit,
  emailPending,
}: EmailFormProps) {
  const [email, inputProps] = useInput(defaultEmail);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = useSubmit(() => {
    const emailParseResult = z
      .string()
      .email("Please enter a valid email address")
      .refine((email) => email.endsWith("kpu.ca"), {
        message:
          "Please enter a valid email address ending with @student.kpu.ca, or @kpu.ca if you’re a professor.",
      })
      .safeParse(email);
    if (!emailParseResult.success)
      return setErrorMessage(emailParseResult.error.issues[0]?.message ?? "");
    onSubmit?.(email);
  });

  return (
    <motion.div
      className="mt-8 grid w-full place-items-center"
      {...formAnimationProps}
    >
      <h2 className="text-2xl font-bold">
        Sign In <span className="font-normal">to</span> Better KPU
      </h2>
      <form className="mt-8 w-full" onSubmit={handleSubmit}>
        <div>
          <Input
            placeholder="School email address"
            type="email"
            {...inputProps}
          />
          {errorMessage && (
            <p className="mt-2 text-center text-xs text-primary">
              {errorMessage}
            </p>
          )}
        </div>
        <div className="mt-5">
          <Button
            variant="default"
            className="w-full"
            type="submit"
            disabled={emailPending}
          >
            Continue
          </Button>
          <p className="mt-2 text-center text-xs text-[#888888]">
            Your verification code will be sent to this email
          </p>
        </div>
      </form>
    </motion.div>
  );
}
