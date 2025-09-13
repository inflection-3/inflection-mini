import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/apps/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/apps/$id/edit"!</div>
}
