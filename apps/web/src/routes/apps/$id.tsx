import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/apps/$id"!</div>
}
