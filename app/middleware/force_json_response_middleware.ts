import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Updating the "Accept" header to always accept "application/json" response
 * from the server. This will force the internals of the framework like
 * validator errors or auth errors to return a JSON response.
 *
 * Skip this for Inertia routes as they need to render HTML/React
 */
export default class ForceJsonResponseMiddleware {
  async handle({ request }: HttpContext, next: NextFn) {
    const headers = request.headers()

    // Don't force JSON for Inertia requests
    const isInertiaRequest = headers['x-inertia'] || headers['x-inertia-version']

    // Only force JSON for API routes and non-Inertia requests
    const isApiRoute = request.url().startsWith('/api')

    if (!isInertiaRequest && isApiRoute) {
      headers.accept = 'application/json'
    }

    return next()
  }
}
