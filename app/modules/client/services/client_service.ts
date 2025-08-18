import { DateTime } from 'luxon'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import Client from '../models/client.js'

interface ClientFilters {
  type?: 'individual' | 'company'
  search?: string
  city?: string
  state?: string
}

export default class ClientService {
  /**
   * Get paginated clients with optional filters
   */
  async getClients(
    page: number = 1,
    limit: number = 10,
    filters: ClientFilters = {}
  ): Promise<ModelPaginatorContract<Client>> {
    const query = Client.query().orderBy('name', 'asc')

    // Apply filters
    if (filters.type) {
      query.where('type', filters.type)
    }

    if (filters.city) {
      query.where('city', filters.city)
    }

    if (filters.state) {
      query.where('state', filters.state)
    }

    if (filters.search) {
      query.where((searchQuery) => {
        searchQuery
          .whereILike('name', `%${filters.search}%`)
          .orWhereILike('document', `%${filters.search}%`)
          .orWhereILike('email', `%${filters.search}%`)
          .orWhereILike('phone', `%${filters.search}%`)
      })
    }

    return query.paginate(page, limit)
  }

  /**
   * Create a new client
   */
  async createClient(data: {
    name: string
    document: string
    email?: string
    phone?: string
    street?: string
    number?: string
    complement?: string
    neighborhood?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
    type?: 'individual' | 'company'
    birthday?: DateTime
    contact_person?: string
    notes?: string
    metadata?: Record<string, any>
  }): Promise<Client> {
    const clientData = {
      ...data,
      type: data.type || ('individual' as const),
      country: data.country || 'Brasil',
      metadata: data.metadata || {},
    }

    return Client.create(clientData)
  }

  /**
   * Get client by ID with relations
   */
  async getClient(id: number): Promise<Client> {
    const client = await Client.query()
      .where('id', id)
      .preload('folders', (folderQuery) => {
        folderQuery
          .select('id', 'code', 'title', 'status', 'area', 'created_at')
          .orderBy('created_at', 'desc')
      })
      .firstOrFail()

    return client
  }

  /**
   * Update client
   */
  async updateClient(
    id: number,
    data: Partial<{
      name: string
      document: string
      email: string
      phone: string
      street: string
      number: string
      complement: string
      neighborhood: string
      city: string
      state: string
      postal_code: string
      country: string
      type: 'individual' | 'company'
      birthday: DateTime
      contact_person: string
      notes: string
      metadata: Record<string, any>
    }>
  ): Promise<Client> {
    const client = await Client.findOrFail(id)
    client.merge(data)
    await client.save()

    return client
  }

  /**
   * Delete client (soft delete)
   */
  async deleteClient(id: number): Promise<{ message: string }> {
    const client = await Client.findOrFail(id)
    client.is_deleted = true
    await client.save()

    return { message: 'Client deleted successfully' }
  }

  /**
   * Search clients for selection
   */
  async searchClients(search: string, limit: number = 10): Promise<Client[]> {
    return Client.query()
      .select('id', 'name', 'document', 'type')
      .where((searchQuery) => {
        searchQuery.whereILike('name', `%${search}%`).orWhereILike('document', `%${search}%`)
      })
      .orderBy('name', 'asc')
      .limit(limit)
  }

  /**
   * Get client statistics
   */
  async getClientStats() {
    const [totalResult, individualResult, companyResult] = await Promise.all([
      Client.query().count('* as total'),
      Client.query().where('type', 'individual').count('* as total'),
      Client.query().where('type', 'company').count('* as total'),
    ])

    return {
      total: Number(totalResult[0]!.$extras.total),
      individual: Number(individualResult[0]!.$extras.total),
      company: Number(companyResult[0]!.$extras.total),
    }
  }

  /**
   * Get recent clients
   */
  async getRecentClients(limit: number = 5): Promise<Client[]> {
    return Client.query()
      .select('id', 'name', 'document', 'type', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(limit)
  }
}
