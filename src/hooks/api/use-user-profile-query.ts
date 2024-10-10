import apiClient from "@/lib/kpu-api";
import { useQuery } from "@tanstack/react-query";
import type { UserProfile } from "@/lib/kpu-api/types";

function refineUser(profile?: UserProfile | null): UserProfile | null {
  if (!profile) return null;
  // Yes, I hardcoded my own email to change the name. Deal with it.
  if (profile.email === "andrii.liubkin@student.kpu.ca")
    return { ...profile, greetingName: "Andrew", username: "Andrew Liubkin" };
  return profile;
}

export function useUserProfileQuery(initialUserProfile?: UserProfile) {
  const { data, ...rest } = useQuery({
    queryKey: ["profile"],
    queryFn: () => apiClient.getUserProfile(),
  });

  return {
    data: refineUser(initialUserProfile ?? data),
    ...rest,
  };
}
