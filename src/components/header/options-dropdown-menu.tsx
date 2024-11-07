import { useQuickServicesInvalidationFix } from "@/hooks/api/use-quick-services";
import { usePreferencesContext } from "../contexts/preferences-context";
import { Icons } from "../icons";
import { Button } from "../ui/button";
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
import { useRolesSelect } from "./hooks/use-roles-select";

interface OptionsDropdownMenuProps {
  onSignIn?: () => void;
}

export default function OptionsDropdownMenu({
  onSignIn,
}: OptionsDropdownMenuProps) {
  const { preferences, updatePreference } = usePreferencesContext();

  const quickServicesFix = useQuickServicesInvalidationFix();

  const rolesSelectProps = useRolesSelect({
    defaultValue: preferences.roles,
    onChange: (value) => {
      updatePreference("roles", value);
      quickServicesFix(value);
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Icons.settings className="h-6 w-6" />
        </Button>
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
          <span className="font-medium">Preferences</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
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
        <DropdownMenuItem onClick={onSignIn} className="md:hidden">
          <Icons.login className="mr-2" /> Sign In
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
