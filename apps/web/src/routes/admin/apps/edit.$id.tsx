import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { appsQueries } from '@/lib/queries'
import { AppForm } from '@/components/app-form'

export const Route = createFileRoute('/admin/apps/edit/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const navigate = useNavigate()

  const { data: app, isLoading, error } = useQuery(appsQueries.detailOptions(id))

  const handleSuccess = () => {
    // Navigate back to app detail page after successful update
    navigate({ to: '/admin/apps/$id', params: { id } })
  }

  const handleCancel = () => {
    navigate({ to: '/admin/apps/$id', params: { id } })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading app details...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !app) {
    return (
      <div className="container mx-auto py-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading App</h2>
            <p className="text-muted-foreground mb-4">
              {error?.message || 'App not found or failed to load.'}
            </p>
            <button
              onClick={() => navigate({ to: '/admin/apps' })}
              className="text-primary hover:underline"
            >
              Back to Apps
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit App</h1>
          <p className="text-muted-foreground">Update the details of {app.appName}.</p>
        </div>
        <AppForm 
          editMode={true} 
          defaultData={app} 
          onSuccess={handleSuccess} 
          onCancel={handleCancel} 
        />
      </div>
    </div>
  )
}
