import type { ApplicationService } from '@adonisjs/core/types'
import WebSocketService from '#modules/realtime/services/websocket_service'

export default class WebSocketProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton('websocket', async () => {
      return new WebSocketService()
    })
  }

  /**
   * The container bindings have booted
   */
  async boot() {
    // Initialize WebSocket when HTTP server is ready
    this.app.container.on('http:server:ready', async (event) => {
      const websocket = await this.app.container.make('websocket')
      await websocket.initialize(event.server)
    })
  }

  /**
   * The application has been booted
   */
  async ready() {
    // Application is ready
  }

  /**
   * The process has been started
   */
  async start() {
    // Process started
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    // Cleanup
  }
}
