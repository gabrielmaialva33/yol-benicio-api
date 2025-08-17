import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    auth: async (ctx) => {
      await ctx.auth.check()
      if (!ctx.auth.user) {
        return { user: null }
      }

      // Preload user with roles and permissions
      await ctx.auth.user.load('roles', 'permissions')

      return {
        user: {
          id: ctx.auth.user.id,
          name: ctx.auth.user.name,
          email: ctx.auth.user.email,
          avatar: ctx.auth.user.avatar,
          roles: ctx.auth.user.roles?.map((role) => role.slug) || [],
          permissions: ctx.auth.user.permissions?.map((permission) => permission.name) || [],
        },
      }
    },
  },

  /**
   * Options for the server-side rendering
   * Disable SSR in development to avoid renderOnServer issues
   */
  ssr: {
    enabled: false, // Set to true for production builds
    entrypoint: 'inertia/app/ssr.tsx',
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
