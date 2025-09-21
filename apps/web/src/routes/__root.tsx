import {  createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query';
import type { User } from '@mini/types';
import { userQueries } from '@/lib/queries';
import { Toaster } from 'sonner';

export type RouterAppContext = {
  queryClient: QueryClient;
  auth?: {
    user: User | null;
    isAuthenticated: boolean;
  };
};


export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    title: 'Real time incentivization layer', // Default title (overrides template in child routes)
    meta: [
      // Basic meta
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: 'Real time incentivization layer' },
      { name: 'application-name', content: 'Inflection' },
      { name: 'author', content: 'Inflection' },
      { name: 'generator', content: 'Vite + React + TanStack Router' },
      { name: 'keywords', content: 'web3,Inflection,base,startup,blockchain,zero equity,web3 startups,base chain' },
      { name: 'referrer', content: 'origin-when-cross-origin' },
      { name: 'creator', content: 'inflection' },
      { name: 'publisher', content: 'inflection' },
      // Robots
      {
        name: 'robots',
        content: 'index,follow',
      },
      {
        name: 'googlebot',
        content: 'index,follow',
      },
      // Verification (replace with your actual tokens)
      { name: 'google-site-verification', content: 'your-google-site-verification-token' },
      { name: 'yandex-verification', content: 'your-yandex-verification-token' },
      // OpenGraph
      { property: 'og:title', content: 'Inflection' },
      { property: 'og:description', content: 'Real time incentivization layer' },
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:type', content: 'website' },
      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'inflection' },
      { name: 'twitter:description', content: 'Real time incentivization layer' },
      { name: 'twitter:creator', content: '@inflection' },
      // Format detection
      { name: 'format-detection', content: 'telephone=no' },
    ],
    links: [
      // Canonical
      // Icons (place files in /public)
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'icon', href: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { rel: 'icon', href: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { rel: 'icon', href: '/icon-64x64.png', sizes: '64x64', type: 'image/png' },
      { rel: 'shortcut icon', href: '/shortcut-icon.png' },
      // Apple icons
      { rel: 'apple-touch-icon', href: '/apple-icon.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-icon-180x180.png' },
      // OG/Twitter images (place in /public)
    ],
  }),
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
      <Toaster />
    </>
  ),
})
