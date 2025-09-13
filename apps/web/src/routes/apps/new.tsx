import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/apps/new"!</div>
}
