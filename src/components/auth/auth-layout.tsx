import Image from "next/image";
import type { PropsWithChildren } from "react";
import authBackground from "@/assets/auth-background.png";
import OneKpuLogo from "../one-kpu-logo";

// interface AuthLayoutProps extends PropsWithChildren {}
type AuthLayoutProps = PropsWithChildren;

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex h-dvh">
      <Image
        src={authBackground}
        alt="Background"
        fill
        priority
        className="object-cover"
        sizes="100vw"
        quality={100}
      />

      <div className="relative z-10 flex flex-1 items-center justify-center">
        <div className="grid w-full max-w-sm place-items-center rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#111111]">
          <OneKpuLogo disableName className="h-14 w-14" />
          {children}
        </div>
      </div>
    </div>
  );
  // return <div>{children}</div>;
}
