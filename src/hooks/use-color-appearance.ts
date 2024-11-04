import { useEffect } from "react";
import { usePreferencesContext } from "@/components/contexts/preferences-context";

export function useColorAppearance() {
  const {
    preferences: { appearance },
  } = usePreferencesContext();

  useEffect(() => {
    if (
      appearance === "dark" ||
      (appearance !== "light" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [appearance]);
}
