import { AppsList } from '@/components/apps-list';
import { appsQueries } from '@/lib/queries';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/apps/')({
  component: RouteComponent,
  loader: async ({context}) => {
    const apps = await context.queryClient.fetchQuery(appsQueries.listOptions())
    return { apps };
  },
})

function RouteComponent() {
  const { data: apps } = useSuspenseQuery(appsQueries.listOptions())

  return <AppsList apps={apps ?? []} admin={true} />
}
