import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/apps/$id/interaction')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/apps/$id/interaction"!</div>
}
