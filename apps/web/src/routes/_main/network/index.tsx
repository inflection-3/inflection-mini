import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/network/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/network/"!</div>
}
