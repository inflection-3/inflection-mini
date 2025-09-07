import { createFileRoute } from "@tanstack/react-router";
import { BalanceCard } from "@/components/balance-card";
import { ParternerApps, partnerApps } from "@/components/partner-apps";
import { MyPoints } from "@/components/my-points";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="flex flex-col gap-y-4 w-full">
      <BalanceCard />
      <MyPoints />
      <ParternerApps data={partnerApps} />
    </div>
  );
}
