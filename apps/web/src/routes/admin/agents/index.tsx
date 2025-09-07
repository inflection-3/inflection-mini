import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/agents/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/agents/"!</div>
}
