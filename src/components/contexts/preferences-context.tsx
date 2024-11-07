"use client";
import { PREFERENCES_COOKIE_KEY } from "@/lib/constants";
import { useLocalStorage } from "@mantine/hooks";
import Cookies from "js-cookie";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
} from "react";
import { type Preferences, preferencesSchema } from "./types";
import { defaultPreferences } from "./helpers";

const localStorageKey = "better-kpu-preferences";

const PreferencesContext = createContext<{
  preferences: Preferences;
  updatePreference: <T extends keyof Preferences>(
    key: T,
    value: Preferences[T],
  ) => void;
} | null>(null);

interface PreferencesProviderProps extends PropsWithChildren {
  defalutValue?: Preferences;
}

export function PreferencesProvider({
  children,
  defalutValue,
}: PreferencesProviderProps) {
  const [preferences, setPreferences] = useLocalStorage<Preferences>({
    key: localStorageKey,
    defaultValue: defalutValue ?? defaultPreferences,
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    Cookies.set(PREFERENCES_COOKIE_KEY, JSON.stringify(preferences));
  }, [preferences]);

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
