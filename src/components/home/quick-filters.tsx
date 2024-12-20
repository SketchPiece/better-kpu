import { useEffect, useState } from "react";
import { Icons } from "../icons";
import { cn } from "@/lib/utils";
import type { Nullable } from "@/lib/types";
import SimpleTooltip from "../ui/simple-tooltip";

export type QuickFiltersValue = "essentials" | "favorites" | "recents";

export type QuickFiltersDisabledOptions = Partial<
  Record<QuickFiltersValue, { label: string; disabled: boolean }>
>;

interface QuickFiltersProps {
  value?: Nullable<QuickFiltersValue>;
  onChange?: (value: QuickFiltersValue) => void;
  disabledOptions?: QuickFiltersDisabledOptions;
  authorized?: boolean;
}

export default function QuickFilters({
  value,
  onChange,
  disabledOptions,
  authorized,
}: QuickFiltersProps) {
  const [selectedValue, setSelectedValue] = useState<
    Nullable<QuickFiltersValue>
  >(value ?? null);

  useEffect(() => {
    const isNotEssentials = value !== null && value !== "essentials";

    if (isNotEssentials && !authorized) {
      setSelectedValue("essentials");
      onChange?.("essentials");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorized, selectedValue]);

  const handleClick = (value: QuickFiltersValue) => {
    setSelectedValue(value);
    onChange?.(value);
  };

  useEffect(() => {
    if (value !== selectedValue && value !== undefined) setSelectedValue(value);
  }, [value, selectedValue]);

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <SimpleTooltip
        content={disabledOptions?.essentials?.label ?? "Disabled"}
        disabled={!disabledOptions?.essentials?.disabled}
      >
        <button
          type="button"
          onClick={() =>
            !disabledOptions?.essentials?.disabled && handleClick("essentials")
          }
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[#EFEFEF] px-2.5 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 md:px-4 md:py-2.5 md:text-base dark:ring-offset-dark-background",
            selectedValue === "essentials"
              ? "border-primary bg-primary text-white"
              : "hover:bg-[#F5F5F5] dark:border-[#3D3D3D] dark:hover:bg-[#1E1E1E]",
          )}
        >
          <Icons.circleCheck className="mr-1.5 h-5 sm:mr-2" />
          Essentials
        </button>
      </SimpleTooltip>
      <SimpleTooltip
        content={disabledOptions?.favorites?.label ?? "Disabled"}
        disabled={!disabledOptions?.favorites?.disabled}
      >
        <button
          type="button"
          disabled={disabledOptions?.favorites?.disabled}
          onClick={() =>
            !disabledOptions?.favorites?.disabled && handleClick("favorites")
          }
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[#EFEFEF] px-2.5 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 md:px-4 md:py-2.5 md:text-base dark:ring-offset-dark-background",
            selectedValue === "favorites"
              ? "border-primary bg-primary text-white"
              : "hover:bg-[#F5F5F5] dark:border-[#3D3D3D] dark:hover:bg-[#1E1E1E]",
          )}
        >
          <Icons.starOutline className="mr-1.5 h-5 sm:mr-2" />
          Favorites
        </button>
      </SimpleTooltip>
      <SimpleTooltip
        content={disabledOptions?.recents?.label ?? "Disabled"}
        disabled={!disabledOptions?.recents?.disabled}
      >
        <button
          type="button"
          disabled={disabledOptions?.recents?.disabled}
          onClick={() =>
            !disabledOptions?.recents?.disabled && handleClick("recents")
          }
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[#EFEFEF] px-2.5 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 md:px-4 md:py-2.5 md:text-base dark:ring-offset-dark-background",
            selectedValue === "recents"
              ? "border-primary bg-primary text-white"
              : "hover:bg-[#F5F5F5] dark:border-[#3D3D3D] dark:hover:bg-[#1E1E1E]",
          )}
        >
          <Icons.history className="mr-1.5 h-5 sm:mr-2" />
          Recents
        </button>
      </SimpleTooltip>
    </div>
  );
}
