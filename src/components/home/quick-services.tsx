import ServiceCardSkeleton from "./service-card-skeleton";
import ServiceCard from "./service-card";
import { resolveImageUrl } from "@/lib/utils";
import { useFavoriteMutation } from "@/hooks/api/use-favorite-mutation";
import type { Service } from "@/lib/kpu-api/types";
import { useDebouncedCallback } from "@mantine/hooks";
import { useRecentMutation } from "@/hooks/api/user-recent-mutation";

interface QuickServicesProps {
  services?: Service[];
  loading?: boolean;
  allowFavorite?: boolean;
}

export default function QuickServices({
  services,
  loading,
  allowFavorite,
}: QuickServicesProps) {
  const { mutate: updateFavorite } = useFavoriteMutation();
  const { mutate: updateRecent } = useRecentMutation();
  const debouncedUpdateFavorite = useDebouncedCallback(updateFavorite, 500);

  return (
    <div className="my-5 grid grid-cols-1 gap-4 p-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {loading ? (
        <ServiceCardSkeleton amount={8} />
      ) : (
        services?.map((service) => (
          <ServiceCard
            key={service.uniqueKey}
            devId={service.uniqueKey}
            title={service.title}
            image={resolveImageUrl(service.image)}
            description={service.description}
            favorite={service.favorite}
            onOpen={() => updateRecent({ service })}
            onFavoriteChange={(favorite) =>
              debouncedUpdateFavorite({ service: { ...service, favorite } })
            }
            allowFavorite={allowFavorite}
            href={`/launch-task/all/${service.uniqueKey}`}
          />
        ))
      )}
    </div>
  );
}
