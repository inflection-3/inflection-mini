import { SiteHeader } from "@/components/site-header";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_main")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="flex flex-col gap-y-4 max-w-7xl mx-auto h-screen">
        <SiteHeader />
        <div className="flex flex-col gap-y-5 max-w-md mx-auto p-4 w-full">
          <Outlet />
        </div>
      </div>
    </>
  );
}
