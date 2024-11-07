"use client";
import { Icons } from "../icons";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import type { QuickFiltersValue } from "../home/quick-filters";
import SimpleTooltip from "../ui/simple-tooltip";
import { useClipboard } from "@mantine/hooks";
import { usePreferencesContext } from "../contexts/preferences-context";
import { useRolesSelect } from "./hooks/use-roles-select";
import { useQuickServicesInvalidationFix } from "@/hooks/api/use-quick-services";

interface UserDropdownMenuProps {
  initials: string;
  username: string;
  email: string;
  onDefaultViewChange?: (value: QuickFiltersValue) => void;
  onSignOut?: () => void;
}

export default function UserDropdownMenu({
  initials,
  username,
  email,
  onDefaultViewChange,
  onSignOut,
}: UserDropdownMenuProps) {
  const { preferences, updatePreference } = usePreferencesContext();
  const clipboard = useClipboard({ timeout: 2000 });
  const quickServicesFix = useQuickServicesInvalidationFix();

  const rolesSelectProps = useRolesSelect({
    defaultValue: preferences.roles,
    onChange: (value) => {
      updatePreference("roles", value);
      quickServicesFix(value);
    },
  });

  const handleDefaultViewChange = (value: QuickFiltersValue) => {
    updatePreference("defaultView", value);
    onDefaultViewChange?.(value);
  };

  const copyEmailContent = clipboard.copied
    ? "Copied to your clipboard"
    : "Click to copy email address";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:ring-offset-dark-background">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        collisionPadding={{
          top: 10,
          right: 10,
          bottom: 5,
          left: 6,
        }}
      >
        <DropdownMenuLabel className="flex flex-col">
          <span className="font-medium">{username}</span>
          <SimpleTooltip
            content={copyEmailContent}
            side="bottom"
            open={clipboard.copied ? true : undefined}
          >
            <button onClick={() => clipboard.copy(email)} className="text-sm">
              {email}
            </button>
          </SimpleTooltip>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Icons.eye className="mr-2" />
            <span>Default View</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuLabel className="px-3 py-2.5 font-medium">
                Select Default View
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={preferences.defaultView}
                onValueChange={(value) =>
                  handleDefaultViewChange(value as QuickFiltersValue)
                }
              >
                <DropdownMenuRadioItem value="essentials">
                  <Icons.circleCheck className="mr-2" />
                  Essentials
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="favorites">
                  <Icons.starOutline className="mr-2" />
                  Favorites
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="recents">
                  <Icons.history className="mr-2" />
                  Recents
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Icons.roles className="mr-2" />
            <span>Roles</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuLabel className="px-3 py-2.5 font-medium">
                Select Roles
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={rolesSelectProps.studentValue}
                onCheckedChange={rolesSelectProps.handleStudentChange}
                onSelect={(e) => e.preventDefault()}
              >
                <Icons.graduationCap className="mr-2" /> Student
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={rolesSelectProps.employeeValue}
                onCheckedChange={rolesSelectProps.handleEmployeeChange}
                onSelect={(e) => e.preventDefault()}
              >
                <Icons.briefcaseBusiness className="mr-2" /> Employee
              </DropdownMenuCheckboxItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Icons.appearance className="mr-2" />
            <span>Appearance</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuLabel className="px-3 py-2.5 font-medium">
                Select Appearance
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={preferences.appearance}
                onValueChange={(value) =>
                  updatePreference(
                    "appearance",
                    value as "dark" | "light" | "system",
                  )
                }
              >
                <DropdownMenuRadioItem value="system">
                  <Icons.system className="mr-2" />
                  System
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="light">
                  <Icons.sun className="mr-2" />
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <Icons.moon className="mr-2" />
                  Dark
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem asChild>
          <a href="https://ko-fi.com/betterkpu" target="_blank">
            <Icons.coffee className="mr-2" />
            <span>Buy me a Coffee</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSignOut}>
          <Icons.logout className="mr-2" /> Logout
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex justify-around">
          <a href="https://www.facebook.com/kwantlenU" target="_blank">
            <Icons.facebook className="h-7 w-7 text-[#747474] hover:text-black dark:text-dark-accent/80 dark:hover:text-dark-accent" />
          </a>
          <a href="https://x.com/kwantlenu" target="_blank">
            <Icons.x className="h-7 w-7 text-[#747474] hover:text-black dark:text-dark-accent/80 dark:hover:text-dark-accent" />
          </a>
          <a href="https://www.instagram.com/kwantlenu" target="_blank">
            <Icons.instagram className="h-7 w-7 text-[#747474] hover:text-black dark:text-dark-accent/80 dark:hover:text-dark-accent" />
          </a>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
