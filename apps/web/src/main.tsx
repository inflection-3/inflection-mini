import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'
import { queryClient } from './lib/query-client.tsx'
import Providers from './providers/providers.tsx'

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient: queryClient,
    auth: {
      user: null,
      isAuthenticated: false,
    }
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <Providers queryClient={queryClient}> 
        <RouterProvider router={router} />
      </Providers>
    </StrictMode>,
  )
}


reportWebVitals()
