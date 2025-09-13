import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/apps/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/apps/$id"!</div>
}
