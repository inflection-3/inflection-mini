import { createFileRoute, Link } from "@tanstack/react-router";
import type { PartnerApplication } from "@mini/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useSuspenseQuery } from "@tanstack/react-query";
import { appsQueries } from "@/lib/queries";

// Mock data for UI testing
export const Route = createFileRoute("/_main/apps/")({
  component: RouteComponent,
  loader: async ({context}) => {
    const { queryClient } = context;
    const response =  await queryClient.fetchQuery(appsQueries.listOptions());
    return response ?? [];
  },
});

interface GroupedApps {
  categoryName: string;
  apps: PartnerApplication[];
}

function groupAppsByCategory(apps: PartnerApplication[]): GroupedApps[] {
  const grouped = apps.reduce(
    (acc, app) => {
      const categoryName = app.categoryName || "Uncategorized";

      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }

      acc[categoryName].push(app);
      return acc;
    },
    {} as Record<string, PartnerApplication[]>
  );

  return Object.entries(grouped).map(([categoryName, apps]) => ({
    categoryName,
    apps,
  }));
}

function RouteComponent() {
  // Use mock data for UI testing instead of API call
  const {data: apps = []} = useSuspenseQuery(appsQueries.listOptions());
  const groupedApps = groupAppsByCategory(apps);

  return (
    <div className="">
      {groupedApps.map((group) => (
        <div
          key={group.categoryName}
          className="relative flex flex-col gap-y-5"
        >
          <h2 className="text-lg font-bold">{group.categoryName}</h2>
          <Carousel className="w-full bg-gradient-to-l from-[#0E0E0E] to-[#1A1A1A] rounded-xl  border border-opacity-20 ">
            <CarouselContent className="px-4 gap-4 h-[183px] px-10 flex items-center">
              {group.apps.map((app) => (
                <CarouselItem key={app.id} className="pl-1  basis-1/3  ">
                  <Link
                    to={`/apps/$id`}
                    params={{ id: app.id }}
                    className="flex gap-2 flex-col flex items-center justify-center"
                  >
                    <div className="rounded-md border w-full h-[109px] flex items-center justify-center">
                      <img
                        src={app.appLogo}
                        className="rounded-md"
                        alt={app.appName}
                        width={68}
                        height={66}
                      />
                    </div>
                    <p className="text-xs font-medium text-foreground text-center">
                      {app.appName}
                    </p>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute right-12 -top-10 flex gap-x-2">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      ))}
    </div>
  );
}
