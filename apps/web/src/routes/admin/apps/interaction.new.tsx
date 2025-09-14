import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/apps/interaction/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/apps/interaction/new"!</div>
}
