import ServiceCardSkeleton from "./service-card-skeleton";
import ServiceCard from "./service-card";
import { resolveImageUrl } from "@/lib/utils";
import { useFavoriteMutation } from "@/hooks/api/use-favorite-mutation";
import type { Service } from "@/lib/kpu-api/types";
import { KPU_API_URL } from "@/lib/kpu-api/dangerous-kpu-api-instance";

interface QuickServicesProps {
  services?: Service[];
  loading?: boolean;
}

export default function QuickServices({
  services,
  loading,
}: QuickServicesProps) {
  const { mutate: updateFavorite } = useFavoriteMutation();

  return (
    <div className="my-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {loading ? (
        <ServiceCardSkeleton amount={8} />
      ) : (
        services?.map(
          ({ id, title, description, image, uniqueKey, uid, favorite }) => (
            <ServiceCard
              key={uniqueKey}
              devId={id}
              title={title}
              image={resolveImageUrl(image)}
              description={description}
              favorite={favorite}
              href={`${KPU_API_URL}/launch-task/all/${uniqueKey}`}
              onFavoriteChange={(favorite) => updateFavorite({ favorite, uid })}
            />
          ),
        )
      )}
    </div>
  );
}
