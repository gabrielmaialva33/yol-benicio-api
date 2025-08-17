/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

// Import Tailwind CSS styles
import '../css/app.css'
import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const appName = import.meta.env.VITE_APP_NAME || 'YOL Benício'

// Create a query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(`../pages/${name}.tsx`, import.meta.glob('../pages/**/*.tsx'))
  },

  setup({ el, App, props }) {
    // Clear the element content first to avoid hydration issues when SSR is disabled
    el.innerHTML = ''
    
    const root = createRoot(el)
    root.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <App {...props} />
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </StrictMode>
    )

    // Mark body as hydrated to prevent flash of unstyled content
    document.body.classList.add('hydrated')

    // Enable MSW in development after hydration is complete
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      import('../mocks/browser').then(({ worker }) => {
        worker.start({
          onUnhandledRequest: 'bypass',
        })
      })
    }
  },
})
