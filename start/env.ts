/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

const env = await Env.create(new URL('../', import.meta.url), {
  /*
  |----------------------------------------------------------
  | Variables for configuring the application
  |----------------------------------------------------------
  */
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),
  APP_URL: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring session package
  |----------------------------------------------------------
  */
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),
  /*
  |----------------------------------------------------------
  | Variables for configuring the cache package
  |----------------------------------------------------------
  */
  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),
  /*
  |----------------------------------------------------------
  | Variables for @rlanz/bull-queue
  |----------------------------------------------------------
  */
  QUEUE_REDIS_HOST: Env.schema.string.optional({ format: 'host' }),
  QUEUE_REDIS_PORT: Env.schema.number.optional(),
  QUEUE_REDIS_PASSWORD: Env.schema.string.optional(),
  /*
  |----------------------------------------------------------
  | Variables for configuring the limiter package
  |----------------------------------------------------------
  */
  LIMITER_STORE: Env.schema.enum.optional(['redis', 'database', 'memory'] as const),

  /*
  |----------------------------------------------------------
  | Variables for configuring ally package
  |----------------------------------------------------------
  */
  DISCORD_CLIENT_ID: Env.schema.string.optional(),
  DISCORD_CLIENT_SECRET: Env.schema.string.optional(),

  FACEBOOK_CLIENT_ID: Env.schema.string.optional(),
  FACEBOOK_CLIENT_SECRET: Env.schema.string.optional(),

  GITHUB_CLIENT_ID: Env.schema.string.optional(),
  GITHUB_CLIENT_SECRET: Env.schema.string.optional(),

  GOOGLE_CLIENT_ID: Env.schema.string.optional(),
  GOOGLE_CLIENT_SECRET: Env.schema.string.optional(),

  LINKEDIN_CLIENT_ID: Env.schema.string.optional(),
  LINKEDIN_CLIENT_SECRET: Env.schema.string.optional(),

  SPOTIFY_CLIENT_ID: Env.schema.string.optional(),
  SPOTIFY_CLIENT_SECRET: Env.schema.string.optional(),

  TWITTER_CLIENT_ID: Env.schema.string.optional(),
  TWITTER_CLIENT_SECRET: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the drive package
  |----------------------------------------------------------
  */
  DRIVE_DISK: Env.schema.enum.optional(['fs', 's3', 'spaces', 'r2', 'gcs'] as const),

  // S3
  AWS_ACCESS_KEY_ID: Env.schema.string.optional(),
  AWS_SECRET_ACCESS_KEY: Env.schema.string.optional(),
  AWS_REGION: Env.schema.string.optional(),
  S3_BUCKET: Env.schema.string.optional(),

  // Spaces
  SPACES_KEY: Env.schema.string.optional(),
  SPACES_SECRET: Env.schema.string.optional(),
  SPACES_REGION: Env.schema.string.optional(),
  SPACES_BUCKET: Env.schema.string.optional(),
  SPACES_ENDPOINT: Env.schema.string.optional(),

  // R2
  R2_KEY: Env.schema.string.optional(),
  R2_SECRET: Env.schema.string.optional(),
  R2_BUCKET: Env.schema.string.optional(),
  R2_ENDPOINT: Env.schema.string.optional(),

  // GCS
  GCS_KEY: Env.schema.string.optional(),
  GCS_BUCKET: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the mail package
  |----------------------------------------------------------
  */
  SMTP_HOST: Env.schema.string.optional(),
  SMTP_PORT: Env.schema.string.optional(),
  SMTP_USER: Env.schema.string.optional(),
  SMTP_PASS: Env.schema.string.optional(),
  SMTP_FROM_ADDRESS: Env.schema.string.optional(),
  SMTP_FROM_NAME: Env.schema.string.optional(),
})

export default env
