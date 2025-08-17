import type { HttpContext } from '@adonisjs/core/http'
import User from '#modules/user/models/user'
import { loginValidator } from '#validators/auth'

export default class AuthController {
  /**
   * Display login page
   */
  async showLogin({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  /**
   * Handle login request
   */
  async login({ request, response, auth, inertia }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)

      try {
        const user = await User.verifyCredentials(email, password)
        await auth.use('web').login(user)

        return response.redirect('/dashboard')
      } catch (authError) {
        return inertia.render('auth/login', {
          errors: {
            email: ['Invalid email or password'],
          },
        })
      }
    } catch (validationError) {
      return inertia.render('auth/login', {
        errors: validationError.messages || {
          message: 'Validation failed',
        },
      })
    }
  }

  /**
   * Handle logout
   */
  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/login')
  }
}
