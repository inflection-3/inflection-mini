import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold  mb-4">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium ">Total Users</h3>
            <p className="text-xl font-bold text-blue-600 mt-2">1,234</p>
          </div>
          <div className=" p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium ">Active Apps</h3>
            <p className="text-xl font-bold text-green-600 mt-2">56</p>
          </div>
          <div className=" p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium ">Total Rewards</h3>
            <p className="text-xl font-bold text-purple-600 mt-2">$12,345</p>
          </div>
        </div>
      </div>
      
        <div className=" p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium  mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/admin/apps/new" className="block w-full text-left px-4 py-2 text-sm   rounded">
              Create New App
            </Link>
            <Link to="/admin/apps" className="block w-full text-left px-4 py-2 text-sm  rounded">
              Manage Apps
            </Link>
            <Link to="/admin/agents" className="block w-full text-left px-4 py-2 text-sm  rounded">
              View Agents
            </Link>
          </div>
        </div>
      
    </div>
  )
}
