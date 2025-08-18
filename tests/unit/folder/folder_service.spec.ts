import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import FolderService from '#modules/folder/services/folder_service'
import Folder from '#modules/folder/models/folder'
import { UserFactory } from '#database/factories/user_factory'
import { ClientFactory } from '#database/factories/client_factory'
import { FolderFactory } from '#database/factories/folder_factory'

test.group('FolderService', (group) => {
  let folderService: FolderService

  group.setup(async () => {
    await testUtils.db().migrate()
  })

  group.teardown(async () => {
    // Skip rollback due to database lock issues in tests
  })

  group.each.setup(async () => {
    await testUtils.db().truncate()
    folderService = new FolderService()
  })

  test('should create a new folder', async ({ assert }) => {
    const client = await ClientFactory.create()
    const user = await UserFactory.create()

    const folderData = {
      code: 'TST001',
      title: 'Test Folder',
      description: 'Test folder description',
      area: 'civil_litigation' as const,
      status: 'active' as const,
      client_id: client.id,
      responsible_lawyer_id: user.id,
      case_value: 10000,
      metadata: { test: true },
    }

    const folder = await folderService.createFolder(folderData)

    assert.equal(folder.code, 'TST001')
    assert.equal(folder.title, 'Test Folder')
    assert.equal(folder.area, 'civil_litigation')
    assert.equal(folder.status, 'active')
    assert.equal(folder.client_id, client.id)
    assert.equal(folder.responsible_lawyer_id, user.id)
    assert.equal(folder.case_value, 10000)
    assert.deepEqual(folder.metadata, { test: true })
  })

  test('should get folder by id with relations', async ({ assert }) => {
    const client = await ClientFactory.create()
    const user = await UserFactory.create()
    const folder = await FolderFactory.merge({
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).create()

    const result = await folderService.getFolder(folder.id)

    assert.equal(result.id, folder.id)
    assert.equal(result.title, folder.title)
    assert.isDefined(result.client)
    assert.equal(result.client.id, client.id)
    assert.isDefined(result.responsibleLawyer)
    assert.equal(result.responsibleLawyer.id, user.id)
  })

  test('should get paginated folders with filters', async ({ assert }) => {
    const client = await ClientFactory.create()
    const user = await UserFactory.create()

    // Create test folders
    await FolderFactory.merge({
      status: 'active',
      area: 'civil_litigation',
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).createMany(3)

    await FolderFactory.merge({
      status: 'completed',
      area: 'labor',
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).createMany(2)

    // Test without filters
    const allFolders = await folderService.getFolders(1, 10)
    assert.isDefined(allFolders)
    assert.isAtLeast(allFolders.total, 5)

    // Test with status filter
    const activeFolders = await folderService.getFolders(1, 10, { status: 'active' })
    assert.isDefined(activeFolders)
    assert.isAtLeast(activeFolders.total, 3)
    assert.isTrue(activeFolders.rows.every(folder => folder.status === 'active'))

    // Test with area filter
    const laborFolders = await folderService.getFolders(1, 10, { area: 'labor' })
    assert.isDefined(laborFolders)
    assert.isAtLeast(laborFolders.total, 2)
    assert.isTrue(laborFolders.rows.every(folder => folder.area === 'labor'))

    // Test with client filter
    const clientFolders = await folderService.getFolders(1, 10, { client_id: client.id })
    assert.isDefined(clientFolders)
    assert.isAtLeast(clientFolders.total, 5)
    assert.isTrue(clientFolders.rows.every(folder => folder.client_id === client.id))
  })

  test('should update folder', async ({ assert }) => {
    const folder = await FolderFactory.create()

    const updateData = {
      title: 'Updated Title',
      status: 'completed' as const,
      case_value: 20000,
    }

    const updatedFolder = await folderService.updateFolder(folder.id, updateData)

    assert.equal(updatedFolder.title, 'Updated Title')
    assert.equal(updatedFolder.status, 'completed')
    assert.equal(updatedFolder.case_value, 20000)
  })

  test('should toggle folder favorite status', async ({ assert }) => {
    const folder = await FolderFactory.merge({ is_favorite: false }).create()

    // Toggle to favorite
    const favoritedFolder = await folderService.toggleFavorite(folder.id)
    assert.isTrue(favoritedFolder.is_favorite)

    // Toggle back to not favorite
    const unfavoritedFolder = await folderService.toggleFavorite(folder.id)
    assert.isFalse(unfavoritedFolder.is_favorite)
  })

  test('should delete folder (soft delete)', async ({ assert }) => {
    const folder = await FolderFactory.create()

    const result = await folderService.deleteFolder(folder.id)
    assert.equal(result.message, 'Folder deleted successfully')

    // Test that the folder is no longer found in normal queries (soft deleted)
    const folderAfterDelete = await Folder.query().where('id', folder.id).first()
    assert.isNull(folderAfterDelete)

    // Verify it exists in the database but is marked as deleted
    const deletedFolder = await Folder.query().withoutGlobalScopes().where('id', folder.id).first()
    assert.isNotNull(deletedFolder)
    assert.isTrue(deletedFolder!.is_deleted)
  })

  test('should get folder statistics', async ({ assert }) => {
    const client = await ClientFactory.create()
    const user = await UserFactory.create()

    // Create test folders with different statuses
    await FolderFactory.merge({
      status: 'active',
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).createMany(3)

    await FolderFactory.merge({
      status: 'completed',
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).createMany(2)

    await FolderFactory.merge({
      status: 'pending',
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).create()

    const stats = await folderService.getFoldersStats()

    assert.equal(stats.total_folders, 6)
    assert.equal(stats.active_folders, 3)
    assert.equal(stats.completed_folders, 2)
    assert.isArray(stats.by_status)
    assert.isArray(stats.by_area)
    assert.isArray(stats.monthly_evolution)
  })

  test('should get folders for dashboard', async ({ assert }) => {
    const client = await ClientFactory.create()
    const user = await UserFactory.create()

    await FolderFactory.merge({
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).createMany(3)

    const dashboardData = await folderService.getDashboardFolders()

    assert.isDefined(dashboardData.active)
    assert.isDefined(dashboardData.newThisMonth)
    assert.isArray(dashboardData.history)
  })

  test('should get folders for consultation with filters', async ({ assert }) => {
    const client = await ClientFactory.create()
    const user = await UserFactory.create()

    await FolderFactory.merge({
      status: 'active',
      area: 'civil_litigation',
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).createMany(2)

    await FolderFactory.merge({
      status: 'completed',
      area: 'labor',
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).create()

    const activeFolders = await folderService.getFoldersForConsultation({ status: 'active' })
    assert.equal(activeFolders.length, 2)

    const laborFolders = await folderService.getFoldersForConsultation({ area: 'labor' })
    assert.equal(laborFolders.length, 1)
  })

  test('should get recent activity', async ({ assert }) => {
    const client = await ClientFactory.create()
    const user = await UserFactory.create()

    await FolderFactory.merge({
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).createMany(5)

    const recentActivity = await folderService.getRecentActivity(3)

    assert.equal(recentActivity.length, 3)
    assert.isDefined(recentActivity[0].client)
    assert.isDefined(recentActivity[0].responsibleLawyer)
  })

  test('should search folders by title', async ({ assert }) => {
    const client = await ClientFactory.create()
    const user = await UserFactory.create()

    await FolderFactory.merge({
      title: 'Test Case 123',
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).create()

    await FolderFactory.merge({
      title: 'Another Case',
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).create()

    const searchResults = await folderService.getFolders(1, 10, { search: 'Test' })
    assert.isDefined(searchResults)
    assert.isAtLeast(searchResults.total, 1)
    assert.isTrue(searchResults.rows.some(folder => folder.title === 'Test Case 123'))
  })

  test('should filter folders by date range', async ({ assert }) => {
    const client = await ClientFactory.create()
    const user = await UserFactory.create()

    const today = DateTime.now()
    const yesterday = today.minus({ days: 1 })
    const tomorrow = today.plus({ days: 1 })

    // Create folder from yesterday
    await FolderFactory.merge({
      created_at: yesterday,
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).create()

    // Create folder from today
    await FolderFactory.merge({
      created_at: today,
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).create()

    const dateRange = {
      from: today.startOf('day').toJSDate(),
      to: tomorrow.endOf('day').toJSDate(),
    }

    const filteredFolders = await folderService.getFolders(1, 10, { dateRange })
    assert.isDefined(filteredFolders)
    assert.isAtLeast(filteredFolders.total, 1)
  })
})
