import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { appsQueries } from '@/lib/queries'
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Plus, ExternalLink, Calendar, DollarSign } from 'lucide-react'

export const Route = createFileRoute('/admin/apps/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  
  const { data: app, isLoading, error } = useQuery(
    appsQueries.detailOptions(id)
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading app details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error loading app: {error.message}</div>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>App not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{app.appName}</h1>
          <p className="text-muted-foreground">{app.appDescription}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/admin/apps/edit/$id" params={{ id }}>
              <Edit className="w-4 h-4" />
              Edit App
            </Link>
          </Button>
          <Button asChild>
            <Link to="/admin/apps/interaction/$id" params={{ id }}>
              <Plus className="w-4 h-4" />
              Add Interaction
            </Link>
          </Button>
        </div>
      </div>

      {/* App Details Card */}
    
          <div className="grid grid-cols-1 gap-6">
            {/* App Logo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">App Logo</label>
              {app.appLogo ? (
                <img 
                  src={app.appLogo} 
                  alt={`${app.appName} logo`}
                  className="w-16 h-16 rounded-lg object-cover border"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">No Logo</span>
                </div>
              )}
            </div>

            {/* Banner Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Banner Image</label>
              {app.bannerImage ? (
                <img 
                  src={app.bannerImage} 
                  alt={`${app.appName} banner`}
                  className="w-full h-24 rounded-lg object-cover border"
                />
              ) : (
                <div className="w-full h-24 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">No Banner</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1  gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">App URL</label>
              <div className="flex items-center gap-2">
                <span className="text-sm break-all">{app.appUrl}</span>
                <Button size="sm" variant="ghost" asChild>
                  <a href={app.appUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between border-b">
              <label className="text-sm font-medium">Slug</label>
              <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{app.slug}</span>
            </div>

            <div className="flex items-center justify-between border-b">
              <label className="text-sm font-medium">Category</label>
              <span className="text-sm">{app.categoryName || 'No Category'}</span>
            </div>

            <div className="flex items-center justify-between border-b">
              <label className="text-sm font-medium">Badge Label</label>
              <span className="text-sm">{app.appBadgeLabel || 'No Badge'}</span>
            </div>

            <div className="flex items-center justify-between border-b">
              <label className="text-sm font-medium">Open for Claim</label>
              <span className={`text-sm px-2 py-1 rounded text-xs font-medium ${
                app.openForClaim 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {app.openForClaim ? 'Yes' : 'No'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Created At</label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(app.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

      {/* Interactions Section */}
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Interactions ({app.interactions?.length || 0})
            </CardTitle>
            <Button size="sm" asChild>
              <Link to="/admin/apps/interaction/$id" params={{ id }}>
                <Plus className="w-4 h-4" />
                Add New
              </Link>
            </Button>
          </div>
          <CardDescription>
            Manage interactions and rewards for this app
          </CardDescription>
        </CardHeader>
        <CardContent className='px-0'>
          {app.interactions && app.interactions.length > 0 ? (
            <div className="space-y-4">
              {app.interactions.map((interaction) => (
                <div 
                  key={interaction.id} 
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div>
                        <p>{interaction?.title}</p>
                        <p>{interaction?.description}</p>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-medium">Interaction URL</span>
                        <Button size="sm" variant="ghost" asChild>
                          <a href={interaction.interactionUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground break-all">
                        {interaction.interactionUrl}
                      </p>
                      
                      <div className="flex flex-col gap-4 text-sm">
                        <div className='flex items-center justify-between'>
                          <span className="font-medium">Verification: </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            interaction.verificationType === 'auto' ? 'bg-blue-100 text-blue-800' :
                            interaction.verificationType === 'manual' ? 'bg-yellow-100 text-yellow-800' :
                            interaction.verificationType === 'api' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {interaction.verificationType}
                          </span>
                        </div>
                        
                        <div>
                          <span className="font-medium">Reward ID: </span>
                          <span className="font-mono text-xs">{interaction.rewardId}</span>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(interaction.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No interactions yet</p>
              <p className="text-sm mb-4">Create your first interaction to start earning rewards</p>
              <Button asChild>
                <Link to="/admin/apps/interaction/$id" params={{ id }}>
                  <Plus className="w-4 h-4" />
                  Add First Interaction
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
    </div>
  )
}
