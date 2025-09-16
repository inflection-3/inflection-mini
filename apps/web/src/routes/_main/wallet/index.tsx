
import { BalanceCard } from "@/components/balance-card";
import { StatCard } from "@/components/gradient-card";
import { MyPoints } from "@/components/my-points";
import { Badge } from "@/components/ui/badge";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/wallet/")({
  component: RouteComponent,
});


const walletItems = [
  {
    title: "Savings Balance",
    value: "$0.00",
    icon: "/dollor.svg"
  }, 
  {
    title: "Investments",
    value: "$0.00",
    icon: "/invest.svg"
  },
  {
    title: "Stablecoin Debit Card",
    value: "$0.00",
    icon: "/card.svg"
  },
]



function RouteComponent() {
  return (
    <>
      <BalanceCard action />
      <div className="grid grid-cols-2 gap-5">
        {walletItems.map((item) => (
          <WalletItem key={item.title} {...item} />
        ))}
      </div>
    </>
  );
}


export function WalletItem({title, value, icon}: {
  title: string
  value: string
  icon: string
}) {
  return (
    <StatCard className="flex flex-col gap-4 relative">
      <img src={icon} alt={title} width={51} height={51} />
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="font-medium">{value}</p>
      </div>
      <Badge className="absolute top-2 right-2 text-[6px]">Coming soon</Badge>
    </StatCard>
  );
}