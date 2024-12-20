/* eslint-disable @next/next/no-img-element */
import { type ComponentProps, useState } from "react";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface ServiceCardProps extends ComponentProps<"a"> {
  devId?: string;
  title: string;
  description: string;
  image: string;
  favorite?: boolean;
  onFavoriteChange?: (favorite: boolean) => void;
  onOpen?: () => void;
  allowFavorite?: boolean;
}

function isDevMode() {
  if (typeof window === "undefined") return false;
  const url = new URL(window.location.href);
  return url.searchParams.get("dev") === "true";
}

export default function ServiceCard({
  devId,
  title,
  description,
  image,
  favorite,
  onFavoriteChange,
  onOpen,
  allowFavorite,
  ...props
}: ServiceCardProps) {
  const [isFavorite, setIsFavorite] = useState(favorite);

  const handleFavoriteChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsFavorite(!isFavorite);
    onFavoriteChange?.(!isFavorite);
  };

  return (
    <a
      className="group relative flex items-center justify-center gap-4 rounded-xl border-[#F0F0F0] px-2 py-3.5 transition-all hover:bg-[#F9F9F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:px-8 sm:py-6 dark:border-[#2E2E2E] dark:ring-offset-dark-background dark:hover:bg-[#2E2E2E]"
      target="_blank"
      onClick={onOpen}
      onMouseDown={(e) => e.button === 1 && onOpen?.()}
      {...props}
    >
      {isDevMode() && <div className="absolute left-3 top-3">{devId}</div>}
      <img
        src={image}
        alt={title}
        className="h-20 w-20 rounded-full border border-[#F0F0F0] object-cover dark:border-[#2E2E2E]"
      />
      <div className="flex flex-1 flex-col">
        <h2 className="font-medium sm:text-lg">{title}</h2>
        <p className="text-xs text-black/70 sm:text-sm dark:text-white/70">
          {description}
        </p>
      </div>
      {allowFavorite && (
        <Button
          tabIndex={-1}
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-3 top-3 opacity-0 transition-all group-hover:opacity-100",
            isFavorite && "opacity-100",
          )}
          onClick={handleFavoriteChange}
        >
          {isFavorite ? (
            <Icons.star className="h-5 w-5 text-yellow-400" />
          ) : (
            <Icons.starOutline className="h-5 w-5" />
          )}
        </Button>
      )}
    </a>
  );
}
