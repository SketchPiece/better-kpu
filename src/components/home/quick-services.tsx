import ServiceCardSkeleton from "./service-card-skeleton";
import ServiceCard from "./service-card";
import { resolveImageUrl } from "@/lib/utils";
import { useFavoriteMutation } from "@/hooks/api/use-favorite-mutation";
import type { Service } from "@/lib/kpu-api/types";
import { useDebouncedCallback } from "@mantine/hooks";

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
  const debouncedUpdateFavorite = useDebouncedCallback(updateFavorite, 500);

  return (
    <div className="my-5 grid grid-cols-1 gap-4 p-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {loading ? (
        <ServiceCardSkeleton amount={8} />
      ) : (
        services?.map(
          ({ title, description, image, uniqueKey, uid, favorite }) => (
            <ServiceCard
              key={uniqueKey}
              devId={uniqueKey}
              title={title}
              image={resolveImageUrl(image)}
              description={description}
              favorite={favorite}
              href={`/launch-task/all/${uid}`}
              onFavoriteChange={(favorite) =>
                debouncedUpdateFavorite({ favorite, uid })
              }
              allowFavorite={allowFavorite}
            />
          ),
        )
      )}
    </div>
  );
}
