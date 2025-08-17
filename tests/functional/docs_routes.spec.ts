import { test } from '@japa/runner'

test.group('Docs routes', () => {
  test('GET /docs should serve redoc html', async ({ client }) => {
    const response = await client.get('/docs')

    response.assertStatus(200)
    response.assertHeader('content-type', 'text/html; charset=utf-8')
    response.assertTextIncludes('<redoc')
  })

  test('GET /openapi.yaml should serve yaml spec', async ({ client }) => {
    const response = await client.get('/openapi.yaml')

    response.assertStatus(200)
    response.assertHeader('content-type', 'application/yaml; charset=utf-8')
    response.assertTextIncludes('openapi: 3.1.0')
  })
})
