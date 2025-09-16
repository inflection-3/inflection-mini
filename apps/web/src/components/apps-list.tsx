
import { StatCard } from "@/components/gradient-card";
import { cn } from "@/lib/utils";
import type { PartnerApplication } from "@mini/types";
import { Link } from "@tanstack/react-router";

export function AppsList({ apps, admin = false }: { apps: PartnerApplication[], admin?: boolean }) {
  
  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="text-sm font-medium text-muted-foreground">
        Partner Apps
      </h1>
      {apps.length === 0 && (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-[100px] w-full bg-gray-200 animate-pulse rounded-[12px]"
            ></div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-3 gap-4">
        {apps?.map((app) => <AppCard key={app.appName} {...app} admin={admin} />)}
      </div>
    </div>
  );
}

export function AppCard(app: PartnerApplication & { admin?: boolean, className?: string }) {
  return (
    <Link to={app.admin ? "/admin/apps/$id" : "/apps/$id"} params={{ id: app?.id }} className={cn("max-w-[126px]", app?.className)}>
      <StatCard className="w-full h-[120px] flex items-center flex-col justify-center rounded-[12px]">
        <img
          className="w-[56px] h-[56px] rounded-[12px]"
          src={app?.appLogo ?? ""}
          alt="Featured Item"
        />
        <p className="text-xs font-medium text-foreground text-center mt-2.5">
          {app?.appName}
        </p>
      </StatCard>
    </Link>
  );
}