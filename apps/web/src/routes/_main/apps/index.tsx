import { createFileRoute, Link } from "@tanstack/react-router";
import { AppCard, AppsList } from "@/components/apps-list";
import type { PartnerApplication } from "@mini/types";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";

// Mock data for UI testing
const mockApps: PartnerApplication[] = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    userId: "123e4567-e89b-12d3-a456-426614174001",
    categoryId: "123e4567-e89b-12d3-a456-426614174002",
    categoryName: "DeFi",
    slug: "geodnet",
    appName: "Geodnet",
    bannerImage: null,
    appLogo: "/test.svg",
    appUrl: "https://geodnet.com",
    appDescription:
      "Decentralized positioning network for high-precision location services",
    openForClaim: true,
    appBadgeLabel: "Featured",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174003",
    userId: "123e4567-e89b-12d3-a456-426614174004",
    categoryId: "123e4567-e89b-12d3-a456-426614174005",
    categoryName: "DeFi",
    slug: "sample-defi-app",
    appName: "Sample DeFi App",
    bannerImage: null,
    appLogo: "/test.svg",
    appUrl: "https://sample-defi.com",
    appDescription: "A sample DeFi application for testing purposes",
    openForClaim: true,
    appBadgeLabel: "New",
    createdAt: "2024-01-16T10:00:00.000Z",
    updatedAt: "2024-01-16T10:00:00.000Z",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174006",
    userId: "123e4567-e89b-12d3-a456-426614174007",
    categoryId: "123e4567-e89b-12d3-a456-426614174008",
    categoryName: "DeFi",
    slug: "sample-nft-app",
    appName: "Sample NFT App",
    bannerImage: null,
    appLogo: "/test.svg",
    appUrl: "https://sample-nft.com",
    appDescription: "A sample NFT marketplace for testing purposes",
    openForClaim: false,
    appBadgeLabel: "Coming Soon",
    createdAt: "2024-01-17T10:00:00.000Z",
    updatedAt: "2024-01-17T10:00:00.000Z",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174009",
    userId: "123e4567-e89b-12d3-a456-426614174010",
    categoryId: "123e4567-e89b-12d3-a456-426614174011",
    categoryName: "DeFi",
    slug: "sample-gaming-app",
    appName: "Sample Gaming App",
    bannerImage: null,
    appLogo: "/test.svg",
    appUrl: "https://sample-gaming.com",
    appDescription: "A sample blockchain gaming application",
    openForClaim: true,
    appBadgeLabel: "Hot",
    createdAt: "2024-01-18T10:00:00.000Z",
    updatedAt: "2024-01-18T10:00:00.000Z",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174012",
    userId: "123e4567-e89b-12d3-a456-426614174013",
    categoryId: "123e4567-e89b-12d3-a456-426614174014",
    categoryName: "DeFi",
    slug: "sample-tools-app",
    appName: "Sample Tools App",
    bannerImage: null,
    appLogo: "/test.svg",
    appUrl: "https://sample-tools.com",
    appDescription: "A sample utility application for blockchain tools",
    openForClaim: true,
    appBadgeLabel: null,
    createdAt: "2024-01-19T10:00:00.000Z",
    updatedAt: "2024-01-19T10:00:00.000Z",
  },
];

export const Route = createFileRoute("/_main/apps/")({
  component: RouteComponent,
  loader: async () => {
    // Use mock data for UI testing instead of API call
    // const { queryClient } = context;
    // const response =  await queryClient.fetchQuery(appsQueries.listOptions());
    // return response ?? [];
    return mockApps;
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
  // const {data: apps = []} = useSuspenseQuery(appsQueries.listOptions());
  const apps = mockApps;
  const groupedApps = groupAppsByCategory(apps);

  return (
    <div className="">
      {groupedApps.map((group) => (
        <div key={group.categoryName} className="relative flex flex-col gap-y-5">
          <h2 className="text-lg font-bold">{group.categoryName}</h2>
          <Carousel className="w-full bg-gradient-to-r from-[#0E0E0E] to-[#1A1A1A] rounded-md  border border-opacity-20 ">
            <CarouselContent className="px-4 gap-4 h-[183px] px-10 flex items-center">
              {group.apps.map((app) => (
                <CarouselItem
                  key={app.id}
                  className="pl-1  basis-1/3  "
                >
                  <Link to={`/apps/$id`} params={{ id: app.id }} className="flex gap-2 flex-col flex items-center justify-center">
                  <div className="rounded-md border w-full h-[109px] flex items-center justify-center" >
                  <img src={app.appLogo} className="rounded-md" alt={app.appName} width={68} height={66} />
                  </div>
                  <p className="text-xs font-medium text-foreground text-center">{app.appName}</p>
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
