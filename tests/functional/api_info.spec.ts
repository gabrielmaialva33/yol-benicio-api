import { test } from '@japa/runner'

test.group('API info route', () => {
  test('GET /api should return package info', async ({ client, assert }) => {
    const response = await client.get('/api')

    response.assertStatus(200)
    const body = response.body()

    assert.properties(body, ['name', 'description', 'version', 'author'])
    assert.equal(body.name, 'yol-benicio-api')
  })
})
