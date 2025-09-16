import { Link } from "@tanstack/react-router";
import { StatCard } from "./gradient-card";

const exploreItems = [
  {
    icon: "/network.svg",
    label: "Explore partner app",
    link: "/apps",
  },
  {
    icon: "/invest.svg",
    label: "Invest 10% APY",
    link: "/wallet",
  },
  {
    icon: "/buy-sell.svg",
    label: "Buy/Sell Stablecoins",
    link: "/wallet",
  },
  {
    icon: "/card.svg",
    label: "Stablecoin Debit Card",
    link: "/wallet",
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

export function ExploreItem({ icon, label, link }: { icon: string; label: string; link: string }) {
  return (
    <Link to={link} className="max-w-[126px]">
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
    </Link>
  );
}
