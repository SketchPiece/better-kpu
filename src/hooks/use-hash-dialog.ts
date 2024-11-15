import { useState, useEffect } from "react";

export function useHashDialog(hashValue: string) {
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setShowDialog(window.location.hash === `#${hashValue}`);
    };

    handleHashChange(); // Check initial hash
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [hashValue]);

  return showDialog;
}
