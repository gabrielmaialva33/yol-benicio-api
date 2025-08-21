import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import redis from '@adonisjs/redis/services/main'
import { DateTime } from 'luxon'

export default class HealthController {
  /**
   * Health check endpoint
   * Returns the health status of the application and its dependencies
   */
  async check({ response }: HttpContext) {
    const startTime = DateTime.now()
    const checks: Record<string, any> = {}

    try {
      // Check database connectivity
      try {
        await db.rawQuery('SELECT 1')
        checks.database = {
          status: 'healthy',
          responseTime: DateTime.now().diff(startTime).milliseconds,
        }
      } catch (error) {
        checks.database = {
          status: 'unhealthy',
          error: error.message,
          responseTime: DateTime.now().diff(startTime).milliseconds,
        }
      }

      // Check Redis connectivity
      try {
        await redis.ping()
        checks.redis = {
          status: 'healthy',
          responseTime: DateTime.now().diff(startTime).milliseconds,
        }
      } catch (error) {
        checks.redis = {
          status: 'unhealthy',
          error: error.message,
          responseTime: DateTime.now().diff(startTime).milliseconds,
        }
      }

      // Overall health status
      const isHealthy = Object.values(checks).every((check) => check.status === 'healthy')

      const healthData = {
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: DateTime.now().toISO(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version || '1.0.0',
        checks,
        totalResponseTime: DateTime.now().diff(startTime).milliseconds,
      }

      return response.status(isHealthy ? 200 : 503).json(healthData)
    } catch (error) {
      return response.status(503).json({
        status: 'unhealthy',
        timestamp: DateTime.now().toISO(),
        error: error.message,
        totalResponseTime: DateTime.now().diff(startTime).milliseconds,
      })
    }
  }

  /**
   * Readiness check - indicates if the application is ready to receive traffic
   */
  async ready({ response }: HttpContext) {
    try {
      // Check if critical services are available
      await db.rawQuery('SELECT 1')
      await redis.ping()

      return response.json({
        status: 'ready',
        timestamp: DateTime.now().toISO(),
      })
    } catch (error) {
      return response.status(503).json({
        status: 'not_ready',
        timestamp: DateTime.now().toISO(),
        error: error.message,
      })
    }
  }

  /**
   * Liveness check - indicates if the application is running
   */
  async live({ response }: HttpContext) {
    return response.json({
      status: 'alive',
      timestamp: DateTime.now().toISO(),
      uptime: process.uptime(),
    })
  }
}