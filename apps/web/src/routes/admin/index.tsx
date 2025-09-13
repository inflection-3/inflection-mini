import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const { auth } = context;
    if (!auth?.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
    // TODO: Add admin role check here
    return {
      user: auth.user,
      isAuthenticated: auth.isAuthenticated,
    };
  },
})

function RouteComponent() {
  return <div>Hello "/admin/"!</div>
}
