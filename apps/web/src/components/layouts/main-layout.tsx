import { Outlet } from "@tanstack/react-router";
import { SiteHeader } from "../site-header";
import Providers from "@/providers/providers";
import { BottomNavigation } from "../bottom-navigation";

export function MainLayout() {
  return (
    <Providers> 
    <div className="flex flex-col gap-y-4 max-w-7xl mx-auto h-screen">
      <SiteHeader />
      <div className="flex flex-col gap-y-5 max-w-md mx-auto p-4 w-full">
        <Outlet />
      </div>
    </div>
      <BottomNavigation />
    </Providers>
  );
}
