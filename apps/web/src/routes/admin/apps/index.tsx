import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/apps/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/apps/"!</div>
}
