
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { StatCard } from "./gradient-card";

export type ParternerAppCardProps = {
  name: string;
  logo: string;
  url: string;
  description: string;
  badgeLabel?: string;
};

export const partnerApps: ParternerAppCardProps[] = [
  {
    name: "Offramp USDC",
    logo: "/p2p.svg",
    url: "https://app.p2p.lol/campaign?id=9&manager=inflection",
    description:
      "Withdraw your stablecoins with P2P.me into your local currency. Currently supported INR, IDR, BRL",
  },
  {
    name: "Lending Yield",
    logo: "/y.svg",
    url: "https://app.morpho.org/ethereum/earn",
    description:
      "Deposit your stablecoins to earn higher yield. on your stablecoin savings account",
  },
  {
    name: "Buy DePIN Device ",
    logo: "/geod.svg",
    url: "https://buy.copperx.io/payment/payment-link/a096c4c6-f468-40fa-a50f-31b58089ea1bm",
    description:
      "Buy a DePIN device and start earning today.earn attractive yield with DePIN devices",
  },
  {
    name: "Use Truflation Calculator",
    logo: "https://storage.googleapis.com/inflection-image/Website%20logos/Truflation.png",
    url: "https://inflection.network/app/truflation",
    description:
      "Use Truflation CPI to get real-time inflation data for your investments",
  },
];

export function ParternerAppCard({
  name,
  logo,
  url,
  description,
  badgeLabel,
}: ParternerAppCardProps) {
  return (
    <a href={url} target="_blank">
      <StatCard
        className="flex flex-col  gap-3.5 border-[0.5px] px-0 py-4"
        style={{
          background: "linear-gradient(180deg, #0E0E0E 0%, #1A1A1A 100%)",
        }}
      >
        <div className="px-6">
          <p>{badgeLabel}</p>
        </div>
        <div className="border-b border-dashed h-10 px-6 flex items-center text-lg">
          <h4>{name}</h4>
        </div>
        <div className="flex px-4 justify-between">
          <p className="max-w-[300px] text-[#717171] text-sm ">{description}</p>
          <Avatar className="w-[32px] h-[32px] rounded-xl">
            <AvatarImage src={logo} />
            <AvatarFallback className="text-base rounded-xl">
              {name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
      </StatCard>
    </a>
  );
}

export function ParternerApps({
  data,
}: {
  data: ParternerAppCardProps[];
}) {
  return (
    <div className="flex flex-col gap-y-4">
      {data.map((item) => (
        <ParternerAppCard key={item.name} {...item} />
      ))}
    </div>
  );
}