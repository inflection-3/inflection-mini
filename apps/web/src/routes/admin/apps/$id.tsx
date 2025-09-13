import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/apps/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/apps/$id"!</div>
}
