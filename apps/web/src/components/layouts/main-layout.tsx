import { Outlet } from "@tanstack/react-router";
import { SiteHeader } from "../site-header";
import Providers from "@/providers/providers";
import { BottomNavigation } from "../bottom-navigation";

export function MainLayout() {
  return (
    <Providers> 
    <div className="flex flex-col gap-y-4 max-w-7xl mx-auto">
      <SiteHeader />
      <div className="flex flex-col gap-y-4 max-w-md mx-auto p-4">
        <Outlet />
      </div>
      <BottomNavigation />
    </div>
    </Providers>
  );
}
