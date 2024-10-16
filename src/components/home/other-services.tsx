import InfiniteScroll from "react-infinite-scroll-component";
import ServiceCardSkeleton from "./service-card-skeleton";
import { useServicesInfiniteQuery } from "@/hooks/api/use-services-infinite-query";
import { type CategoryValue, mapCategoryValueToName } from "@/lib/categories";
import { useQuickServices } from "@/hooks/api/use-quick-services";
import type { QuickFiltersValue } from "./quick-filters";
import type { Service } from "@/lib/kpu-api/types";
import ServiceCard from "./service-card";
import { cn, resolveImageUrl } from "@/lib/utils";
import type { Nullable } from "@/lib/types";
import { useFavoriteMutation } from "@/hooks/api/use-favorite-mutation";

interface OtherServicesProps {
  searchQuery?: string;
  category?: Nullable<CategoryValue>;
  quickFilter: Nullable<QuickFiltersValue>;
  initialServices?: Service[];
  allowFavorite?: boolean;
}

function defineHeading(searchQuery?: string, category?: CategoryValue) {
  if (searchQuery) return `Search Results for "${searchQuery}"`;
  if (category) return `${mapCategoryValueToName(category)} Category`;
  return "Other Services";
}

function filterOtherServices(services: Service[], ids: number[]) {
  return services.filter((service) => !ids.includes(service.id));
}

export default function OtherServices({
  searchQuery,
  category,
  quickFilter,
  initialServices,
  allowFavorite,
}: OtherServicesProps) {
  const {
    data: otherServices,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useServicesInfiniteQuery({
    searchQuery,
    category,
    initialServices,
  });

  const { mutate: updateFavorite } = useFavoriteMutation();

  const { dataIds: quickServicesIds } = useQuickServices({
    quickFilter: quickFilter ?? undefined,
  });

  const heading = defineHeading(searchQuery, category ?? undefined);

  const otherServicesFiltered = filterOtherServices(
    otherServices ?? [],
    quickServicesIds,
  );

  const increaseMargin = quickFilter !== null;

  return (
    <>
      <h2
        className={cn(
          "ml-1 text-2xl font-medium lg:text-3xl",
          increaseMargin ? "mt-12" : "mt-6",
        )}
      >
        {heading}
      </h2>
      <div>
        {isLoading ? (
          <div className="my-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            <ServiceCardSkeleton amount={16} />
          </div>
        ) : (
          <InfiniteScroll
            className="relative my-5 grid grid-cols-1 gap-4 p-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
            dataLength={otherServicesFiltered.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={<ServiceCardSkeleton amount={8} />}
          >
            {otherServicesFiltered.map(
              ({ id, title, description, image, uniqueKey, uid, favorite }) => (
                <ServiceCard
                  key={uniqueKey}
                  devId={id}
                  title={title}
                  image={resolveImageUrl(image)}
                  description={description}
                  favorite={favorite}
                  href={`/launch-task/all/${uid}`}
                  onFavoriteChange={(favorite) =>
                    updateFavorite({ favorite, uid })
                  }
                  allowFavorite={allowFavorite}
                />
              ),
            )}
          </InfiniteScroll>
        )}
      </div>
    </>
  );
}
