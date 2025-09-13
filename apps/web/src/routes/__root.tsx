import {  createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'
import { MainLayout } from '@/components/layouts/main-layout'
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
    console.log("TOKEN", token);
    
    if (token) {
      try {
        const userData = await queryClient.fetchQuery(userQueries.meOptions());
        console.log("User data from query:", userData);
        return {
          auth: {
            user: userData,
            isAuthenticated: true,
          },
        };
      } catch (error) {
        console.log("Error fetching user data:", error);
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
      <MainLayout />
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
