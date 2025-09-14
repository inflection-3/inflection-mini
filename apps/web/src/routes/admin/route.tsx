import { SiteHeader } from "@/components/site-header";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ context }) => {
    const { auth } = context;
    
  
    if (auth.user?.role !== "admin") {
      throw redirect({ 
        to: "/",
        search: {
          error: "Access denied. Admin privileges required."
        }
      });
    }
  },
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="border-b max-w-md mx-auto ">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
      </div>
      <div className="flex flex-col gap-y-5 max-w-md mx-auto p-4 w-full">   
        <Outlet />
      </div>
    </div>
  )
}
