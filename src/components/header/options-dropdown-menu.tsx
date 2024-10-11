import { usePreferences } from "@/hooks/use-preferences";
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
import { excludeValue, includeValue } from "./helpers";

export default function OptionsDropdownMenu() {
  const { preferences, updatePreference } = usePreferences();

  const handleRoleCheckboxChange = (
    role: "student" | "employee",
    checked: boolean,
  ) => {
    updatePreference(
      "roles",
      checked
        ? includeValue(preferences.roles, role)
        : excludeValue(preferences.roles, role),
    );
  };

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
          <span className="font-medium">Settings</span>
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
                checked={preferences.roles.includes("student")}
                onCheckedChange={(checked) =>
                  handleRoleCheckboxChange("student", checked)
                }
                onSelect={(e) => e.preventDefault()}
              >
                <Icons.graduationCap className="mr-2" /> Student
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={preferences.roles.includes("employee")}
                onCheckedChange={(checked) =>
                  handleRoleCheckboxChange("employee", checked)
                }
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
