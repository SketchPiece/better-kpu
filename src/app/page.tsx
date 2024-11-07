import { PreferencesProvider } from "@/components/contexts/preferences-context";
import HomePage from "@/components/home-page";
import { api } from "@/trpc/server";
import { getUserProfile } from "./helpers";
import { cookies } from "next/headers";
import { PREFERENCES_COOKIE_KEY } from "@/lib/constants";
import { preferencesSchema } from "@/components/contexts/types";
import { defaultPreferences } from "@/components/contexts/helpers";

function getUserPreferences() {
  try {
    const preferencesCookie = cookies().get(PREFERENCES_COOKIE_KEY);
    if (!preferencesCookie) return defaultPreferences;
    return preferencesSchema.parse(JSON.parse(preferencesCookie.value));
  } catch {
    return defaultPreferences;
  }
}

export default async function Home() {
  const userProfile = await getUserProfile();
  const userPreferences = getUserPreferences();

  const quickServices = await api.kpu.getQuickServices({
    roles: userPreferences.roles,
  });
  const { data: services } = await api.kpu.getAllServices({
    roles: userPreferences.roles,
  });

  return (
    <PreferencesProvider defalutValue={userPreferences}>
      <HomePage
        initialUserProfile={userProfile}
        initialQuickServices={quickServices}
        initialServices={services}
      />
    </PreferencesProvider>
  );
}
