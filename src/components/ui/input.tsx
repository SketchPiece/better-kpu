import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-2xl border-none bg-[#F0F0F0] px-4 py-3.5 ring-offset-white transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-950 placeholder:font-semibold placeholder:text-[#9B9B9B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-[#2E2E2E] dark:file:text-slate-50 dark:placeholder:text-[#747474] dark:focus-visible:ring-primary dark:focus-visible:ring-offset-[#111111]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
