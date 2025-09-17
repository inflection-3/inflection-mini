import { Link } from "@tanstack/react-router";
import { StatCard } from "./gradient-card";
import { Badge } from "./ui/badge";

const exploreItems = [
  {
    icon: "/network.svg",
    label: "Explore partner app",
    link: "/apps",
    active: true,
  },
  {
    icon: "/invest.svg",
    label: "Invest 10% APY",
    link: "https://www.avantisfi.com/",
    active: true,
  },
  {
    icon: "/buy-sell.svg",
    label: "Buy/Sell Stablecoins",
    link: "https://app.p2p.lol/campaign?id=9&manager=inflection",
    active: true,
  },
  {
    icon: "/card.svg",
    label: "Stablecoin Debit Card",
    link: "/wallet",
    active: true,
  },
];

export function ExploreList() {
  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="text-sm text-muted-foreground font-medium">Explore</h1>
      <div className="grid grid-cols-3 gap-2.5">
        {exploreItems.map((item) => (
          <ExploreItem key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}

export function ExploreItem({ icon, label, link, active }: { icon: string; label: string; link: string; active: boolean }) {
  return (
    <Link to={link} className="max-w-[126px] relative">
      <StatCard className="w-full h-[100px] flex items-center justify-center rounded-[12px]">
        <img
          className="w-[56px] h-[56px] rounded-[12px]"
          src={icon}
          alt="Featured Item"
        />
      </StatCard>
      <p className="text-xs text-muted-foreground text-center mt-2.5">
        {label}
      </p>
      {
        !active && (
          <Badge className="absolute text-[6px] top-1 right-1">
            coming soon
          </Badge>
        )
      }
    </Link>
  );
}
