"use client";
import { useHotkeys, useOs } from "@mantine/hooks";
import { type ComponentProps, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "../icons";
import { cn } from "@/lib/utils";

interface SearchInputProps extends ComponentProps<"input"> {
  mobile?: boolean;
}

interface KbdProps extends ComponentProps<"kbd"> {
  modKey: "command" | "ctrl";
}

function Kbd({ modKey, children, className, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center gap-0.5 space-x-0.5 rounded-lg border border-gray-200 bg-[#F4F4F5] px-1.5 py-0.5 text-center font-sans text-sm font-medium text-gray-600 shadow-md rtl:space-x-reverse dark:border-[#333336] dark:bg-[#27272A] dark:text-[#D3D3D3] dark:ring-offset-dark-background",
        className,
        // "font-inter",
      )}
      {...props}
    >
      {modKey === "command" ? (
        <abbr className="no-underline" title="Command">
          ⌘
        </abbr>
      ) : (
        <abbr className="no-underline" title="Control">
          Ctrl +
        </abbr>
      )}
      <span>{children}</span>
    </kbd>
  );
}

export default function SearchInput({ mobile, ...props }: SearchInputProps) {
  const os = useOs();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useHotkeys([["mod+k", () => searchInputRef.current?.focus()]]);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") searchInputRef.current?.blur();
    });
  }, []);

  return (
    <div
      className={cn(
        "relative",
        mobile ? "mb-4 block lg:hidden" : "hidden lg:block",
      )}
    >
      <Icons.search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 lg:h-6 lg:w-6" />
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search for service..."
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full rounded-full border-none bg-[#F0F0F0] px-6 py-3 pl-11 text-base font-medium transition-all placeholder:text-[#989898] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:py-3.5 lg:w-[37.5rem] lg:pl-16 lg:text-base dark:bg-[#2E2E2E] dark:placeholder:text-[#747474] dark:focus:ring-offset-dark-background"
        {...props}
      />

      <AnimatePresence>
        {!isFocused && !mobile && (
          <motion.div
            key="kbd-focus"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ willChange: "initial" }}
          >
            <Kbd
              data-hide-on-focus={isFocused}
              modKey={os === "macos" ? "command" : "ctrl"}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              K
            </Kbd>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
