import { Link } from "@tanstack/react-router";
import { StatCard } from "./gradient-card";

export function FeaturedList() {
  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="text-sm text-muted-foreground font-medium">
        Featured App of the day
      </h1>
      <FeaturedItem />
    </div>
  );
}

function FeaturedItem() {
  return (
    <Link to="/" className="max-w-[126px]">
      <StatCard className="w-full h-[100px] flex items-center justify-center rounded-[12px]">
        <img
          className="w-[56px] h-[56px] rounded-[12px]"
          src="/test.svg"
          alt="Featured Item"
        />
      </StatCard>
      <p className="text-sm font-medium text-foreground text-center mt-2.5">Geodnet</p>
    </Link>
  );
}
