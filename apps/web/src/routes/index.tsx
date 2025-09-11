import { createFileRoute } from "@tanstack/react-router";
import { BalanceCard } from "@/components/balance-card";
import { MyPoints } from "@/components/my-points";
import { FeaturedList } from "@/components/featured-list";
import { ExploreList } from "@/components/explore-list";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="flex flex-col gap-y-4 w-full mb-20">
      <BalanceCard />
      <MyPoints />
      <FeaturedList />
      <ExploreList />
    </div>
  );
}
