/**
 * Test helper functions for generating unique test data
 */

/**
 * Generate a unique email address for testing
 */
export function uniqueEmail(prefix: string = 'test'): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}-${timestamp}-${random}@example.com`
}

/**
 * Generate a unique username for testing
 */
export function uniqueUsername(prefix: string = 'user'): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}_${timestamp}_${random}`
}

/**
 * Generate unique test user data
 */
export function uniqueUserData(
  overrides: Partial<{
    full_name: string
    email: string
    username: string
    password: string
  }> = {}
) {
  return {
    full_name: overrides.full_name || 'Test User',
    email: overrides.email || uniqueEmail(),
    username: overrides.username || uniqueUsername(),
    password: overrides.password || 'password123',
  }
}
