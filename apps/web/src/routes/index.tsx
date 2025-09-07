import { createFileRoute } from "@tanstack/react-router";
import { BalanceCard } from "@/components/balance-card";
import { ParternerApps, partnerApps } from "@/components/partner-apps";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="flex flex-col gap-y-4 w-full">
      <BalanceCard />
      <ParternerApps data={partnerApps} />
    </div>
  );
}
