import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { DateTime } from 'luxon'
import { UserFactory } from '#database/factories/user_factory'
import { ClientFactory } from '#database/factories/client_factory'
import { FolderFactory } from '#database/factories/folder_factory'
import Folder from '#modules/folder/models/folder'
import Role from '#modules/role/models/role'
import Permission from '#modules/permission/models/permission'
import IRole from '#modules/role/interfaces/role_interface'
import IPermission from '#modules/permission/interfaces/permission_interface'
import db from '@adonisjs/lucid/services/db'

test.group('Folders CRUD API', (group) => {
  let user: any
  let client: any

  group.setup(async () => {
    await testUtils.db().migrate()
  })

  group.teardown(async () => {
    // Skip rollback due to database lock issues in tests
  })

  // Helper function to create and assign permissions to a role
  async function assignPermissions(role: Role, actions: string[]) {
    const permissions = await Promise.all(
      actions.map((action) =>
        Permission.firstOrCreate(
          {
            resource: IPermission.Resources.FOLDERS,
            action: action,
          },
          {
            name: `folders.${action}`,
            resource: IPermission.Resources.FOLDERS,
            action: action,
          }
        )
      )
    )
    await role.related('permissions').sync(permissions.map((p) => p.id))
  }

  group.each.setup(async () => {
    await testUtils.db().truncate()
    
    // Create user role with folder permissions
    const userRole = await Role.firstOrCreate(
      { slug: IRole.Slugs.USER },
      {
        name: 'User',
        slug: IRole.Slugs.USER,
        description: 'Regular user role',
      }
    )

    // Create user with admin permissions
    user = await UserFactory.merge({
      email: `admin-${Date.now()}@test.com`,
      password: 'secret123',
      metadata: {
        email_verified: true,
        email_verification_token: null,
        email_verification_sent_at: null,
        email_verified_at: DateTime.now().toISO(),
      },
    }).create()

    await db.table('user_roles').insert({
      user_id: user.id,
      role_id: userRole.id,
    })

    // Assign all folder permissions to user role
    await assignPermissions(userRole, [
      IPermission.Actions.LIST,
      IPermission.Actions.READ,
      IPermission.Actions.CREATE,
      IPermission.Actions.UPDATE,
      IPermission.Actions.DELETE,
    ])
    
    // Create a client for testing
    client = await ClientFactory.create()
  })

  test('should get folders list', async ({ client: testClient }) => {
    // Create test folders
    await FolderFactory.merge({
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).createMany(3)

    const response = await testClient
      .get('/api/v1/folders')
      .loginAs(user)

    response.assertStatus(200)
    response.assertBody({
      data: response.body().data,
      meta: {
        total: 3,
        per_page: 10,
        current_page: 1,
        last_page: 1,
        first_page: 1,
        first_page_url: response.body().meta.first_page_url,
        last_page_url: response.body().meta.last_page_url,
        next_page_url: null,
        previous_page_url: null,
      },
    })
  })

  test('should get folders with filters', async ({ client: testClient }) => {
    // Create folders with different statuses
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

    // Test status filter
    const activeResponse = await testClient
      .get('/api/v1/folders?status=active')
      .loginAs(user)

    activeResponse.assertStatus(200)
    activeResponse.assertBodyContains({ meta: { total: 2 } })

    // Test area filter
    const laborResponse = await testClient
      .get('/api/v1/folders?area=labor')
      .loginAs(user)

    laborResponse.assertStatus(200)
    laborResponse.assertBodyContains({ meta: { total: 1 } })

    // Test client filter
    const clientResponse = await testClient
      .get(`/api/v1/folders?client_id=${client.id}`)
      .loginAs(user)

    clientResponse.assertStatus(200)
    clientResponse.assertBodyContains({ meta: { total: 3 } })
  })

  test('should create new folder', async ({ client: testClient }) => {
    const folderData = {
      code: 'TST001',
      title: 'Test Folder',
      description: 'Test folder description',
      area: 'civil_litigation',
      status: 'active',
      court: 'Test Court',
      case_number: '1234567890',
      opposing_party: 'Test Opposition',
      client_id: client.id,
      responsible_lawyer_id: user.id,
      case_value: 50000,
      conviction_value: 25000,
      costs: 5000,
      fees: 10000,
      distribution_date: '2024-01-01T00:00:00.000Z',
      citation_date: '2024-01-15T00:00:00.000Z',
      next_hearing: '2024-06-01T10:00:00.000Z',
      observation: 'Test observation',
      object_detail: 'Test object detail',
      metadata: { priority: 'high' },
    }

    const response = await testClient
      .post('/api/v1/folders')
      .loginAs(user)
      .json(folderData)

    response.assertStatus(201)
    response.assertBodyContains({
      code: 'TST001',
      title: 'Test Folder',
      area: 'civil_litigation',
      status: 'active',
      client_id: client.id,
      responsible_lawyer_id: user.id,
    })
  })

  test('should show single folder', async ({ client: testClient }) => {
    const folder = await FolderFactory.merge({
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).create()

    const response = await testClient
      .get(`/api/v1/folders/${folder.id}`)
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      id: folder.id,
      title: folder.title,
      client: {
        id: client.id,
        name: client.name,
      },
      responsibleLawyer: {
        id: user.id,
        full_name: user.full_name,
      },
    })
  })

  test('should update folder', async ({ client: testClient }) => {
    const folder = await FolderFactory.merge({
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).create()

    const updateData = {
      title: 'Updated Title',
      status: 'completed',
      case_value: 75000,
      observation: 'Updated observation',
    }

    const response = await testClient
      .put(`/api/v1/folders/${folder.id}`)
      .loginAs(user)
      .json(updateData)

    response.assertStatus(200)
    response.assertBodyContains({
      id: folder.id,
      title: 'Updated Title',
      status: 'completed',
      case_value: 75000,
      observation: 'Updated observation',
    })
  })

  test('should toggle folder favorite', async ({ client: testClient }) => {
    const folder = await FolderFactory.merge({
      is_favorite: false,
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).create()

    // Toggle to favorite
    const favoriteResponse = await testClient
      .patch(`/api/v1/folders/${folder.id}/favorite`)
      .loginAs(user)

    favoriteResponse.assertStatus(200)
    favoriteResponse.assertBodyContains({
      id: folder.id,
      is_favorite: true,
    })

    // Toggle back to not favorite
    const unfavoriteResponse = await testClient
      .patch(`/api/v1/folders/${folder.id}/favorite`)
      .loginAs(user)

    unfavoriteResponse.assertStatus(200)
    unfavoriteResponse.assertBodyContains({
      id: folder.id,
      is_favorite: false,
    })
  })

  test('should delete folder', async ({ client: testClient }) => {
    const folder = await FolderFactory.merge({
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).create()

    const response = await testClient
      .delete(`/api/v1/folders/${folder.id}`)
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Folder deleted successfully',
    })

    // Verify folder is soft deleted
    const deletedFolder = await Folder.query().where('id', folder.id).where('is_deleted', true).first()
    response.assert?.isNotNull(deletedFolder)
    response.assert?.isTrue(deletedFolder!.is_deleted)
  })

  test('should get folder statistics', async ({ client: testClient }) => {
    // Create folders with different statuses
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

    const response = await testClient
      .get('/api/v1/folders/stats')
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      total_folders: 5,
      active_folders: 3,
      completed_folders: 2,
    })
    response.assert?.isArray(response.body().by_status)
    response.assert?.isArray(response.body().by_area)
    response.assert?.isArray(response.body().monthly_evolution)
  })

  test('should get dashboard folders data', async ({ client: testClient }) => {
    await FolderFactory.merge({
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).createMany(5)

    const response = await testClient
      .get('/api/v1/folders/dashboard')
      .loginAs(user)

    response.assertStatus(200)
    response.assert?.isDefined(response.body().active)
    response.assert?.isDefined(response.body().newThisMonth)
    response.assert?.isArray(response.body().history)
  })

  test('should get consultation folders', async ({ client: testClient }) => {
    await FolderFactory.merge({
      status: 'active',
      area: 'civil_litigation',
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).createMany(3)

    const response = await testClient
      .get('/api/v1/folders/consultation?status=active')
      .loginAs(user)

    response.assertStatus(200)
    response.assert?.isArray(response.body())
    response.assert?.equal(response.body().length, 3)
  })

  test('should get recent activity', async ({ client: testClient }) => {
    await FolderFactory.merge({
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).createMany(5)

    const response = await testClient
      .get('/api/v1/folders/recent-activity?limit=3')
      .loginAs(user)

    response.assertStatus(200)
    response.assert?.isArray(response.body())
    response.assert?.equal(response.body().length, 3)
  })

  test('should handle validation errors', async ({ client: testClient }) => {
    const invalidData = {
      // Missing required fields
      title: '',
      area: 'invalid_area',
    }

    const response = await testClient
      .post('/api/v1/folders')
      .loginAs(user)
      .json(invalidData)

    response.assertStatus(400)
    response.assertBodyContains({
      message: 'Failed to create folder',
    })
  })

  test('should handle not found errors', async ({ client: testClient }) => {
    const response = await testClient
      .get('/api/v1/folders/999999')
      .loginAs(user)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Folder not found',
    })
  })

  test('should handle unauthorized access', async ({ client: testClient }) => {
    const response = await testClient.get('/api/v1/folders')

    response.assertStatus(401)
  })

  test('should search folders by title', async ({ client: testClient }) => {
    await FolderFactory.merge({
      title: 'Important Case 123',
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).create()

    await FolderFactory.merge({
      title: 'Another Case',
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).create()

    const response = await testClient
      .get('/api/v1/folders?search=Important')
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({ meta: { total: 1 } })
    response.assert?.equal(response.body().data[0].title, 'Important Case 123')
  })

  test('should filter folders by favorite status', async ({ client: testClient }) => {
    await FolderFactory.merge({
      is_favorite: true,
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).createMany(2)

    await FolderFactory.merge({
      is_favorite: false,
      client_id: client.id,
      responsible_lawyer_id: user.id,
    }).create()

    const response = await testClient
      .get('/api/v1/folders?is_favorite=true')
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({ meta: { total: 2 } })
  })
})