import type { HttpContext } from '@adonisjs/core/http'
import ClientService from '../services/client_service.js'
import { DateTime } from 'luxon'

export default class ClientsController {
  private clientService = new ClientService()

  /**
   * Get clients with pagination and filters
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const type = request.input('type')
      const search = request.input('search')
      const city = request.input('city')
      const state = request.input('state')

      const clients = await this.clientService.getClients(page, limit, {
        type,
        search,
        city,
        state,
      })

      return response.ok(clients)
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch clients',
        error: error.message,
      })
    }
  }

  /**
   * Search clients for selection
   */
  async search({ request, response }: HttpContext) {
    try {
      const search = request.input('search', '')
      const limit = request.input('limit', 10)

      const clients = await this.clientService.searchClients(search, limit)
      return response.ok(clients)
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to search clients',
        error: error.message,
      })
    }
  }

  /**
   * Get client statistics
   */
  async stats({ response }: HttpContext) {
    try {
      const stats = await this.clientService.getClientStats()
      return response.ok(stats)
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch client statistics',
        error: error.message,
      })
    }
  }

  /**
   * Show single client
   */
  async show({ params, response }: HttpContext) {
    try {
      const client = await this.clientService.getClient(params.id)
      return response.ok(client)
    } catch (error) {
      return response.notFound({
        message: 'Client not found',
        error: error.message,
      })
    }
  }

  /**
   * Create new client
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'name',
        'document',
        'email',
        'phone',
        'street',
        'number',
        'complement',
        'neighborhood',
        'city',
        'state',
        'postal_code',
        'country',
        'type',
        'birthday',
        'contact_person',
        'notes',
        'metadata',
      ])

      // Parse birthday if provided
      const clientData: any = { ...data }

      if (data.birthday) {
        clientData.birthday = DateTime.fromISO(data.birthday)
      }

      const client = await this.clientService.createClient(clientData)
      return response.created(client)
    } catch (error) {
      return response.badRequest({
        message: 'Failed to create client',
        error: error.message,
      })
    }
  }

  /**
   * Update client
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const data = request.only([
        'name',
        'document',
        'email',
        'phone',
        'street',
        'number',
        'complement',
        'neighborhood',
        'city',
        'state',
        'postal_code',
        'country',
        'type',
        'birthday',
        'contact_person',
        'notes',
        'metadata',
      ])

      // Parse birthday if provided
      if (data.birthday) {
        data.birthday = DateTime.fromISO(data.birthday)
      }

      const client = await this.clientService.updateClient(params.id, data)
      return response.ok(client)
    } catch (error) {
      return response.badRequest({
        message: 'Failed to update client',
        error: error.message,
      })
    }
  }

  /**
   * Delete client
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const result = await this.clientService.deleteClient(params.id)
      return response.ok(result)
    } catch (error) {
      return response.notFound({
        message: 'Client not found',
        error: error.message,
      })
    }
  }

  /**
   * Get recent clients
   */
  async recent({ request, response }: HttpContext) {
    try {
      const limit = request.input('limit', 5)
      const clients = await this.clientService.getRecentClients(limit)
      return response.ok(clients)
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch recent clients',
        error: error.message,
      })
    }
  }
}
