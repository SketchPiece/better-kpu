import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { formAnimationProps } from "./form-animation";
import { useInput, useSubmit } from "./helpers";
import SimpleTooltip from "@/components/ui/simple-tooltip";
import useCooldown from "@/hooks/use-cooldown";

interface CodeFormProps {
  onSubmit?: (code: string) => void;
  onEditEmail?: () => void;
  onResend?: () => void;
  email: string;
}

export default function CodeForm({
  onSubmit,
  onEditEmail,
  onResend,
  email,
}: CodeFormProps) {
  const [handleResend, cooldownRemaining] = useCooldown(() => {
    onResend?.();
  }, 60);
  const [code, inputProps] = useInput();
  const handleSubmit = useSubmit(() => {
    onSubmit?.(code);
  });

  const resendTooltipContent =
    cooldownRemaining > 0
      ? cooldownRemaining > 58
        ? "The code was sent successfully"
        : `Resend in ${cooldownRemaining} seconds`
      : "Click to send the code again";

  return (
    <motion.div
      className="mt-8 grid w-full place-items-center"
      {...formAnimationProps}
    >
      <div className="grid place-items-center gap-2">
        <h2 className="text-2xl font-bold">
          Enter <span className="font-normal">your</span> Code
        </h2>
        <p className="text-center text-sm text-[#888888] dark:text-[#989898]">
          We sent a temporary login code
          <br />
          to {email && <span className="font-semibold">{email}</span>}
        </p>
        <Button
          variant="link"
          onClick={onEditEmail}
          className="p-0 text-sm text-[#888888] underline dark:text-[#989898]"
        >
          Not you?
        </Button>
      </div>
      <form className="mt-8 w-full" onSubmit={handleSubmit}>
        <InputOTP maxLength={6} {...inputProps}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <div className="mt-5">
          <Button variant="default" className="w-full" type="submit">
            Continue
          </Button>
          <p className="mt-2 text-center text-xs text-[#888888] dark:text-[#989898]">
            Didn&apos;t get the code?
            <br />
            Check your junk folder or you can{" "}
            <SimpleTooltip
              content={resendTooltipContent}
              side="top"
              open={cooldownRemaining > 58 ? true : undefined}
            >
              <button
                onClick={handleResend}
                className="text-black dark:text-white hover:underline"
                type="button"
              >
                resend it
              </button>
            </SimpleTooltip>
          </p>
        </div>
      </form>
    </motion.div>
  );
}
