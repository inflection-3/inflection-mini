import { createFileRoute, redirect } from "@tanstack/react-router";
import { BalanceCard } from "@/components/balance-card";
import { MyPoints } from "@/components/my-points";
import { FeaturedList } from "@/components/featured-list";
import { ExploreList } from "@/components/explore-list";

export const Route = createFileRoute("/")({
  component: App,
  beforeLoad: async ({ context }) => {
    const { auth } = context;
    console.log(auth);
    if (!auth?.isAuthenticated) {
      console.log("redirecting to login");
      throw redirect({
        to: "/login",
      });
    }
    console.log("not redirecting to login");
    return {
      user: auth.user,
      isAuthenticated: auth.isAuthenticated,
    };
  },
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
