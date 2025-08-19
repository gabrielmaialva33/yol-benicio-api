import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import ClientService from '#modules/client/services/client_service'
import Client from '#modules/client/models/client'
import { ClientFactory } from '#database/factories/client_factory'
import { FolderFactory } from '#database/factories/folder_factory'

test.group('ClientService', (group) => {
  let clientService: ClientService

  group.setup(async () => {
    await testUtils.db().migrate()
  })

  group.teardown(async () => {
    // Skip rollback due to database lock issues in tests
  })

  group.each.setup(async () => {
    await testUtils.db().truncate()
    clientService = new ClientService()
  })

  test('should create a new individual client', async ({ assert }) => {
    const clientData = {
      name: 'João Silva',
      document: '12345678901',
      email: 'joao@email.com',
      phone: '11999999999',
      street: 'Rua das Flores',
      number: '123',
      city: 'São Paulo',
      state: 'SP',
      postal_code: '01234567',
      type: 'individual' as const,
      birthday: DateTime.fromISO('1990-01-01'),
    }

    const client = await clientService.createClient(clientData)

    assert.equal(client.name, 'João Silva')
    assert.equal(client.document, '12345678901')
    assert.equal(client.email, 'joao@email.com')
    assert.equal(client.type, 'individual')
    assert.equal(client.country, 'Brasil')
    assert.equal(client.birthday?.toISODate(), '1990-01-01')
  })

  test('should create a new company client', async ({ assert }) => {
    const clientData = {
      name: 'Empresa XYZ Ltda',
      document: '12345678000199',
      email: 'contato@empresa.com',
      phone: '1133333333',
      type: 'company' as const,
      contact_person: 'Maria Santos',
    }

    const client = await clientService.createClient(clientData)

    assert.equal(client.name, 'Empresa XYZ Ltda')
    assert.equal(client.document, '12345678000199')
    assert.equal(client.type, 'company')
    assert.equal(client.contact_person, 'Maria Santos')
    assert.equal(client.country, 'Brasil')
  })

  test('should get client by id with folders relation', async ({ assert }) => {
    const client = await ClientFactory.create()
    
    // Create some folders for this client
    await FolderFactory.merge({ client_id: client.id }).createMany(3)

    const result = await clientService.getClient(client.id)

    assert.equal(result.id, client.id)
    assert.equal(result.name, client.name)
    assert.isDefined(result.folders)
    assert.equal(result.folders.length, 3)
  })

  test('should get paginated clients with filters', async ({ assert }) => {
    // Create individual clients
    await ClientFactory.merge({ type: 'individual', city: 'São Paulo', state: 'SP' }).createMany(3)
    
    // Create company clients
    await ClientFactory.merge({ type: 'company', city: 'Rio de Janeiro', state: 'RJ' }).createMany(2)

    // Test without filters
    const allClients = await clientService.getClients(1, 10)
    assert.isDefined(allClients)
    assert.isAtLeast(allClients.total, 5) // At least 5 (our test data)
    assert.isArray(allClients.all())

    // Test with type filter
    const individuals = await clientService.getClients(1, 10, { type: 'individual' })
    assert.isDefined(individuals)
    assert.isAtLeast(individuals.total, 3) // At least 3 individuals
    assert.isTrue(individuals.all().every((client: Client) => client.type === 'individual'))

    const companies = await clientService.getClients(1, 10, { type: 'company' })
    assert.isDefined(companies)
    assert.isAtLeast(companies.total, 2) // At least 2 companies
    assert.isTrue(companies.all().every((client: Client) => client.type === 'company'))
  })

  test('should search clients by name and document', async ({ assert }) => {
    await ClientFactory.merge({
      name: 'João Silva',
      document: 'DOC123456789',
    }).create()

    await ClientFactory.merge({
      name: 'Maria Santos',
      document: 'DOC987654321',
    }).create()

    await ClientFactory.merge({
      name: 'Empresa ABC',
      document: 'DOC111111111',
    }).create()

    // Search by name
    const searchByName = await clientService.getClients(1, 10, { search: 'João' })
    assert.isDefined(searchByName)
    assert.isAtLeast(searchByName.total, 1)
    assert.isTrue(searchByName.rows.some(client => client.name === 'João Silva'))

    // Search by document
    const searchByDocument = await clientService.getClients(1, 10, { search: 'DOC987' })
    assert.isDefined(searchByDocument)
    assert.isAtLeast(searchByDocument.total, 1)
    assert.isTrue(searchByDocument.rows.some(client => client.name === 'Maria Santos'))

    // Search with no results (using unique search term)
    const noResults = await clientService.getClients(1, 10, { search: 'NONEXISTENT_UNIQUE_SEARCH_TERM_123456' })
    assert.isDefined(noResults)
    assert.equal(noResults.total, 0)
  })

  test('should update client', async ({ assert }) => {
    const client = await ClientFactory.create()

    const updateData = {
      name: 'Updated Name',
      email: 'updated@email.com',
      phone: '11888888888',
      notes: 'Updated notes',
    }

    const updatedClient = await clientService.updateClient(client.id, updateData)

    assert.equal(updatedClient.name, 'Updated Name')
    assert.equal(updatedClient.email, 'updated@email.com')
    assert.equal(updatedClient.phone, '11888888888')
    assert.equal(updatedClient.notes, 'Updated notes')
  })

  test('should delete client (soft delete)', async ({ assert }) => {
    const client = await ClientFactory.create()
    
    // Verify client exists before deletion
    const clientBeforeDelete = await Client.query().where('id', client.id).first()
    assert.isNotNull(clientBeforeDelete)
    assert.isFalse(clientBeforeDelete!.is_deleted)

    const result = await clientService.deleteClient(client.id)
    assert.equal(result.message, 'Client deleted successfully')

    // Test that the client is no longer found in normal queries (soft deleted)
    const clientAfterDelete = await Client.query().where('id', client.id).first()
    assert.isNull(clientAfterDelete)

    // Verify it exists in the database but is marked as deleted (using direct DB query)
    const deletedClientRaw = await db.from('clients').where('id', client.id).where('is_deleted', true).first()
    assert.isNotNull(deletedClientRaw)
    assert.isTrue(deletedClientRaw!.is_deleted)
  })

  test('should search clients for selection', async ({ assert }) => {
    await ClientFactory.merge({
      name: 'UNIQUE_João_Silva_TEST',
      document: 'UNIQUE_SEARCH001',
    }).create()

    await ClientFactory.merge({
      name: 'UNIQUE_José_Santos_TEST',
      document: 'UNIQUE_SEARCH002',
    }).create()

    await ClientFactory.merge({
      name: 'UNIQUE_Maria_Costa_TEST',
      document: 'UNIQUE_SEARCH003',
    }).create()

    const searchResults = await clientService.searchClients('UNIQUE_Jo', 5)

    assert.equal(searchResults.length, 2)
    assert.isTrue(searchResults.some(client => client.name === 'UNIQUE_João_Silva_TEST'))
    assert.isTrue(searchResults.some(client => client.name === 'UNIQUE_José_Santos_TEST'))
  })

  test('should get client statistics', async ({ assert }) => {
    // Create individual clients
    await ClientFactory.merge({ type: 'individual' }).createMany(5)
    
    // Create company clients
    await ClientFactory.merge({ type: 'company' }).createMany(3)

    const stats = await clientService.getClientStats()

    assert.isAtLeast(stats.total, 8)
    assert.isAtLeast(stats.individual, 5)
    assert.isAtLeast(stats.company, 3)
  })

  test('should get recent clients', async ({ assert }) => {
    await ClientFactory.createMany(10)

    const recentClients = await clientService.getRecentClients(5)

    assert.equal(recentClients.length, 5)
    assert.isDefined(recentClients[0].name)
    assert.isDefined(recentClients[0].document)
    assert.isDefined(recentClients[0].type)
    assert.isDefined(recentClients[0].created_at)
  })

  test('should handle birthday parsing in create', async ({ assert }) => {
    const clientData = {
      name: 'Test Client',
      document: 'BIRTHDAY001',
      type: 'individual' as const,
      birthday: DateTime.fromISO('1985-06-15'),
    }

    const client = await clientService.createClient(clientData)

    assert.equal(client.birthday?.toISODate(), '1985-06-15')
  })

  test('should handle birthday parsing in update', async ({ assert }) => {
    const client = await ClientFactory.merge({ type: 'individual' }).create()

    const updateData = {
      birthday: DateTime.fromISO('1990-12-25'),
    }

    const updatedClient = await clientService.updateClient(client.id, updateData)

    assert.equal(updatedClient.birthday?.toISODate(), '1990-12-25')
  })

  test('should handle metadata in create and update', async ({ assert }) => {
    const clientData = {
      name: 'Test Client',
      document: 'METADATA001',
      type: 'individual' as const,
      metadata: {
        source: 'website',
        priority: 'high',
        tags: ['vip', 'corporate'],
      },
    }

    const client = await clientService.createClient(clientData)
    assert.deepEqual(client.metadata, {
      source: 'website',
      priority: 'high',
      tags: ['vip', 'corporate'],
    })

    const updateData = {
      metadata: {
        source: 'referral',
        priority: 'medium',
        notes: 'Updated via referral',
      },
    }

    const updatedClient = await clientService.updateClient(client.id, updateData)
    assert.deepEqual(updatedClient.metadata, {
      source: 'referral',
      priority: 'medium',
      notes: 'Updated via referral',
    })
  })
})