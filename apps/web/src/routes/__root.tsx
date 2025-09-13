import {  createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query';
import type { User } from '@mini/types';
import { userQueries } from '@/lib/queries';

export type RouterAppContext = {
  queryClient: QueryClient;
  auth?: {
    user: User | null;
    isAuthenticated: boolean;
  };
};


export const Route = createRootRouteWithContext<RouterAppContext>()({
  beforeLoad: async ({ context }) => {
    const { queryClient } = context;
    
    const token = localStorage.getItem("accessToken");
    
    if (token) {
      try {
        const userData = await queryClient.fetchQuery(userQueries.meOptions());
        return {
          auth: {
            user: {
              ...userData,
              role: "admin",
            },
            isAuthenticated: true,
          },
        };
      } catch (error) {
        return {
          auth: {
            user: null,
            isAuthenticated: false,
          },
        };
      }
    }
    
    return {
      auth: {
        user: null,
        isAuthenticated: false,
      },
    };
  },
  component: () => (
    <>
      <Outlet />
      <TanstackDevtools
        config={{
          position: 'bottom-left',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  ),
})
