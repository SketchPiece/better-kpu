"use client";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

interface GreetingProps extends ComponentProps<"h1"> {
  name?: string;
}

function defineGreeting(name?: string): string {
  if (!name) return "Discover Services";
  const hours = new Date().getHours();
  let greet;

  if (hours < 12) {
    greet = `Good morning, ${name}`;
  } else if (hours < 18) {
    greet = `Good afternoon, ${name}`;
  } else {
    greet = `Good evening, ${name}`;
  }

  return greet;
}

function Greeting({ name, className, ...props }: GreetingProps): JSX.Element {
  const greeting = defineGreeting(name);

  return (
    <h1
      className={cn(
        "ml-1 text-2xl font-medium md:text-3xl lg:text-4xl",
        className,
      )}
      {...props}
    >
      {greeting}
    </h1>
  );
}

export default Greeting;
