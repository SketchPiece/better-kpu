import AuthLayout from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AuthErrorProps {
  searchParams: {
    error: "Configuration" | "AccessDenied" | "Verification" | "Default";
  };
}

export default function AuthError({ searchParams: { error } }: AuthErrorProps) {
  return (
    <AuthLayout>
      <div className="mt-8 grid w-full place-items-center">
        {error === "Verification" ? (
          <>
            <h2 className="text-2xl font-bold">Wrong Code</h2>
            <p className="text-center text-sm text-[#888888] dark:text-[#989898]">
              Oops! The code you entered is incorrect
              <br />
              Please try again
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="text-center text-sm text-[#888888] dark:text-[#989898]">
              Oops! Something unexpected happened
              <br />
              Please try again
            </p>
          </>
        )}
        <div className="mt-8 w-full">
          <div>
            <Button variant="default" className="w-full" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <p className="mt-2 text-center text-xs text-[#888888]">
              What a bummer! Let’s give it another shot
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
