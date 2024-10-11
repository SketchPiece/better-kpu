import { Icons } from "../icons";
import { Button } from "../ui/button";
import SearchInput from "./search-input";
import UserDropdownMenu from "./user-dropdown-menu";
import { useNotificationsQuery } from "@/hooks/api/use-notifications-query";
import NotificationsPopover from "../notification-popover";
import OneKpuLogo from "../one-kpu-logo";
import type { QuickFiltersValue } from "../home/quick-filters";
import useAuthentication from "@/hooks/use-authentication";
import type { UserProfile } from "@/lib/kpu-api/types";
import OptionsDropdownMenu from "./options-dropdown-menu";

interface HeaderProps {
  searchQuery?: string;
  onDefaultViewChange?: (value: QuickFiltersValue) => void;
  onSearchQueryChange?: (searchQuery: string) => void;
  userProfile: {
    data: UserProfile | null;
    isLoading: boolean;
  };
}

export default function Header({
  searchQuery,
  onDefaultViewChange,
  onSearchQueryChange,
  userProfile: { data: userProfile, isLoading },
}: HeaderProps) {
  const { signIn, signOut } = useAuthentication();
  const { data: notifications } = useNotificationsQuery();

  return (
    <header className="flex items-center justify-between px-6 py-4">
      <div className="flex-1">
        <a
          href="#"
          className="block w-fit rounded-full p-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <OneKpuLogo />
        </a>
      </div>

      <SearchInput
        value={searchQuery}
        onChange={(e) => onSearchQueryChange?.(e.target.value)}
      />

      <div className="flex flex-1 items-center justify-end gap-4">
        {userProfile && !isLoading ? (
          <>
            <NotificationsPopover notifications={notifications} />
            <UserDropdownMenu
              username={userProfile.username}
              email={userProfile.email}
              initials={userProfile.initials}
              onDefaultViewChange={onDefaultViewChange}
              onSignOut={signOut}
            />
          </>
        ) : (
          <>
            <NotificationsPopover notifications={notifications} />
            <OptionsDropdownMenu onSignIn={signIn} />
            <Button
              variant="ghost"
              onClick={signIn}
              className="hidden md:inline-flex"
            >
              <Icons.login className="mr-2" /> Sign In
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
