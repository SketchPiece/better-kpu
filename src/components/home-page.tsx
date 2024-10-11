"use client";
import { useUserProfileQuery } from "@/hooks/api/use-user-profile-query";
import { useColorAppearance } from "@/hooks/use-color-appearance";
import { usePreferences } from "@/hooks/use-preferences";
import useFilterState from "./home/hooks/use-filter-state";
import { useQuickServices } from "@/hooks/api/use-quick-services";
import { useDebouncedValue } from "@mantine/hooks";
import Header from "./header";
import Greeting from "./home/greeting";
import QuickFilters, { type QuickFiltersValue } from "./home/quick-filters";
import { Separator } from "./ui/separator";
import CategoriesFilterDialog from "./home/categories-filter-dialog";
import QuickServices from "./home/quick-services";
import OtherServices from "./home/other-services";
import ScrollToTopButton from "./scroll-to-top-button";
import type { Service, UserProfile } from "@/lib/kpu-api/types";
import SearchInput from "./header/search-input";

interface HomePageProps {
  initialUserProfile?: UserProfile;
  initialQuickServices?: Record<QuickFiltersValue, Service[]>;
  initialServices?: Service[];
}

export default function HomePage({
  initialUserProfile,
  initialQuickServices,
}: HomePageProps) {
  useColorAppearance();
  const { data: userProfile, isLoading: isUserProfileLoading } =
    useUserProfileQuery(initialUserProfile);
  const {
    preferences: { defaultView },
  } = usePreferences();

  const isAuthorized = Boolean(userProfile) && !isUserProfileLoading;
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
      initialQuickServices,
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
      <main className="mt-0 px-6 lg:mt-8">
        <div className="flex flex-col justify-between lg:flex-row">
          <SearchInput
            value={state.searchQuery}
            onChange={(e) => handleSearchQueryChange(e.target.value)}
            mobile
          />
          <Greeting name={userProfile?.greetingName} />
          <div className="w-full overflow-x-auto pb-3 sm:w-auto sm:pb-0">
            <div className="mt-2 flex w-full flex-row-reverse items-center justify-end gap-2 sm:w-auto sm:flex-row sm:justify-start sm:gap-4 lg:mt-0">
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
