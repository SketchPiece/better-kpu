"use client";
import { useUserProfileQuery } from "@/hooks/api/use-user-profile-query";
import { useColorAppearance } from "@/hooks/use-color-appearance";
import { usePreferences } from "@/hooks/use-preferences";
import useFilterState from "./home/hooks/use-filter-state";
import { useQuickServices } from "@/hooks/api/use-quick-services";
import { useDebouncedValue } from "@mantine/hooks";
import Header from "./header";
import Greeting from "./home/greeting";
import QuickFilters from "./home/quick-filters";
import { Separator } from "./ui/separator";
import CategoriesFilterDialog from "./home/categories-filter-dialog";
import QuickServices from "./home/quick-services";
import OtherServices from "./home/other-services";
import ScrollToTopButton from "./scroll-to-top-button";
import type { UserProfile } from "@/lib/kpu-api/types";

interface HomePageProps {
  initialUserProfile?: UserProfile;
}

export default function HomePage({ initialUserProfile }: HomePageProps) {
  useColorAppearance();
  const { data: userProfile, isLoading: isUserProfileLoading } =
    useUserProfileQuery(initialUserProfile);
  const {
    preferences: { defaultView },
  } = usePreferences();

  const isAuthorized = Boolean(userProfile) && !isUserProfileLoading;
  console.log("auth", isAuthorized);
  const {
    state,
    quickFiltersDisabledOptions,
    updateEmptyFilters,
    handleQuickFilterChange,
    handleCategoryChange,
    handleSearchQueryChange,
    handleDefaultViewChange,
  } = useFilterState({
    defaultQuickFilter: defaultView,
    authorized: isAuthorized,
  });

  const { data: quickServices, isLoading: isQuickServicesLoading } =
    useQuickServices({
      quickFilter: state.selectedQuickFilter ?? undefined,
      onServicesEmptyUpdate: (emptyFilters) => updateEmptyFilters(emptyFilters),
    });

  const [debouncedSearchQuery] = useDebouncedValue(state.searchQuery, 500);

  const showQuickServices = state.selectedQuickFilter !== null;

  return (
    <div>
      <Header
        searchQuery={state.searchQuery}
        onDefaultViewChange={handleDefaultViewChange}
        onSearchQueryChange={handleSearchQueryChange}
        userProfile={{
          data: userProfile,
          isLoading: isUserProfileLoading,
        }}
      />
      <main className="mt-4 px-6 md:mt-8">
        <div className="flex flex-col justify-between md:flex-row">
          <Greeting name={userProfile?.greetingName} />
          <div className="hidden items-center gap-4 md:flex">
            <QuickFilters
              value={state.selectedQuickFilter}
              onChange={handleQuickFilterChange}
              disabledOptions={quickFiltersDisabledOptions}
            />
            <Separator orientation="vertical" className="h-8" />
            <CategoriesFilterDialog
              value={state.selectedCategory}
              onChange={handleCategoryChange}
            />
          </div>
        </div>
        {showQuickServices && (
          <QuickServices
            services={quickServices}
            loading={isQuickServicesLoading}
          />
        )}
        <OtherServices
          searchQuery={debouncedSearchQuery}
          category={state.selectedCategory}
          quickFilter={state.selectedQuickFilter}
        />
      </main>
      <ScrollToTopButton />
    </div>
  );
}
