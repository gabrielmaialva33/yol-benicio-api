import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import db from '@adonisjs/lucid/services/db'
import redis from '@adonisjs/redis/services/main'

export default class Healthcheck extends BaseCommand {
  static commandName = 'healthcheck'
  static description = 'Check the health of the application and its dependencies'

  static options: CommandOptions = {
    startApp: true,
    allowUnknownFlags: false,
    staysAlive: false,
  }

  async run() {
    const checks: Record<string, any> = {}
    let hasFailures = false

    // Check database connectivity
    this.logger.info('🔍 Checking database connectivity...')
    try {
      await db.rawQuery('SELECT 1')
      checks.database = { status: 'healthy' }
      this.logger.success('✅ Database: healthy')
    } catch (error) {
      checks.database = { status: 'unhealthy', error: error.message }
      this.logger.error(`❌ Database: unhealthy - ${error.message}`)
      hasFailures = true
    }

    // Check Redis connectivity
    this.logger.info('🔍 Checking Redis connectivity...')
    try {
      await redis.ping()
      checks.redis = { status: 'healthy' }
      this.logger.success('✅ Redis: healthy')
    } catch (error) {
      checks.redis = { status: 'unhealthy', error: error.message }
      this.logger.error(`❌ Redis: unhealthy - ${error.message}`)
      hasFailures = true
    }

    // Check environment
    this.logger.info('🔍 Checking environment configuration...')
    const requiredEnvVars = [
      'APP_KEY',
      'DB_HOST',
      'DB_USER',
      'DB_PASSWORD',
      'DB_DATABASE',
      'REDIS_HOST',
    ]

    const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

    if (missingEnvVars.length === 0) {
      checks.environment = { status: 'healthy' }
      this.logger.success('✅ Environment: healthy')
    } else {
      checks.environment = {
        status: 'unhealthy',
        missing_variables: missingEnvVars,
      }
      this.logger.error(`❌ Environment: unhealthy - Missing variables: ${missingEnvVars.join(', ')}`)
      hasFailures = true
    }

    // Summary
    if (hasFailures) {
      this.logger.error('❌ Health check failed!')
      process.exit(1)
    } else {
      this.logger.success('🎉 All health checks passed!')
      process.exit(0)
    }
  }
}