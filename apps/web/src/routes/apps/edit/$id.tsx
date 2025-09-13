import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/edit/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/apps/edit/$id"!</div>
}
