import type { HttpContext } from '@adonisjs/core/http'
import User from '#modules/user/models/user'
import vine from '@vinejs/vine'
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
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)

      return response.redirect('/dashboard')
    } catch (error) {
      return inertia.render('auth/login', {
        errors: {
          message: 'Credenciais inválidas',
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
