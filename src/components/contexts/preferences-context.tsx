"use client";
import { useLocalStorage } from "@mantine/hooks";
import { createContext, useContext } from "react";
import { z } from "zod";

const preferencesSchema = z.object({
  defaultView: z.enum(["essentials", "favorites", "recents"]),
  roles: z.array(z.enum(["student", "employee"])),
  appearance: z.enum(["dark", "light", "system"]),
});

type Preferences = z.infer<typeof preferencesSchema>;

const defaultPreferences: Preferences = {
  defaultView: "essentials",
  roles: ["student", "employee"],
  appearance: "system",
};

const localStorageKey = "better-kpu-preferences";

const PreferencesContext = createContext<{
  preferences: Preferences;
  updatePreference: <T extends keyof Preferences>(
    key: T,
    value: Preferences[T],
  ) => void;
}>({
  preferences: defaultPreferences,
  updatePreference: () => {
    return;
  },
});

export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preferences, setPreferences] = useLocalStorage<Preferences>({
    key: localStorageKey,
    defaultValue: defaultPreferences,
    getInitialValueInEffect: true,
  });

  const validatedPreferences = preferencesSchema.safeParse(preferences);
  if (!validatedPreferences.success) setPreferences(defaultPreferences);

  const updatePreference = <T extends keyof Preferences>(
    key: T,
    value: Preferences[T],
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        updatePreference,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferencesContext() {
  const context = useContext(PreferencesContext);
  if (!context)
    throw new Error("usePreferences must be used within a Provider");
  return context;
}
