import { Icons } from "../icons";
import { Button } from "../ui/button";
import SearchInput from "./search-input";
import UserDropdownMenu from "./user-dropdown-menu";
import { useNotificationsQuery } from "@/hooks/api/use-notifications-query";
import NotificationsPopover from "../notification-popover";
import OneKpuLogo from "../one-kpu-logo";
import useAuthentication from "@/hooks/use-authentication";
import OptionsDropdownMenu from "./options-dropdown-menu";
import type { QuickFiltersValue } from "../home/quick-filters";
import type { UserProfile } from "@/lib/kpu-api/types";

interface HeaderProps {
  searchQuery?: string;
  onDefaultViewChange?: (value: QuickFiltersValue) => void;
  onSearchQueryChange?: (searchQuery: string) => void;
  userProfile?: UserProfile;
}

export default function Header({
  searchQuery,
  onDefaultViewChange,
  onSearchQueryChange,
  userProfile,
}: HeaderProps) {
  const { signIn, signOut } = useAuthentication();
  const { data: notifications } = useNotificationsQuery();

  return (
    <header className="flex items-center justify-between px-6 py-4">
      <div className="flex-1">
        <button
          // href="#"
          className="block w-fit rounded-full p-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onClick={() => onSearchQueryChange?.("")}
        >
          <OneKpuLogo />
        </button>
      </div>

      <SearchInput
        value={searchQuery}
        onChange={(e) => onSearchQueryChange?.(e.target.value)}
      />

      <div className="flex flex-1 items-center justify-end gap-4">
        {userProfile ? (
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
