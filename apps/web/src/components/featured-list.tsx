import { Link } from "@tanstack/react-router";
import { StatCard } from "./gradient-card";
import { cn } from "@/lib/utils";

export function FeaturedList() {
  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="text-sm text-muted-foreground font-medium">
        Featured App of the day
      </h1>
      <div className="grid grid-cols-3 gap-2.5">
      <FeaturedItem link="/apps/eebb5e2f-1144-46c8-8cf2-1b140d167691" title="Geodnet" image="/test.svg" active />
      <FeaturedItem link="" className="bg-gradient-to-r from-[#035ADE] to-[#0247CE]" title="Geodnet" image="/scan.svg" />
      </div>
   </div>
  );
}

function FeaturedItem({ title, image, className, link, active }: {
  title: string;
  image: string;
  className?: string;
  link: string;
  active?: boolean;
}) {
  return (
    <Link disabled={!active} to={link} className="max-w-[126px]">
      <StatCard className={cn("w-full h-[100px] flex items-center justify-center rounded-[12px]", className)}>
        <img
          className="w-[56px] h-[56px] rounded-[12px]"
          src={image}
          alt="Featured Item"
        />
      </StatCard>
      <p className="text-sm font-medium text-foreground text-center mt-2.5">{title}</p>
    </Link>
  );
}
