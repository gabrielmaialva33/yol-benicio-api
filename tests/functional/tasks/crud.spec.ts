import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import Task from '#modules/task/models/task'
import User from '#modules/user/models/user'
import Role from '#modules/role/models/role'
import Permission from '#modules/permission/models/permission'
import IRole from '#modules/role/interfaces/role_interface'
import IPermission from '#modules/permission/interfaces/permission_interface'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

test.group('Tasks CRUD', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  // Helper function to create and assign permissions to a role
  async function assignPermissions(role: Role, actions: string[]) {
    const permissions = await Promise.all(
      actions.map((action) =>
        Permission.firstOrCreate(
          {
            resource: IPermission.Resources.TASKS,
            action: action,
          },
          {
            name: `tasks.${action}`,
            resource: IPermission.Resources.TASKS,
            action: action,
          }
        )
      )
    )
    await role.related('permissions').sync(permissions.map((p) => p.id))
  }

  test('should get paginated tasks list', async ({ client }) => {
    const userRole = await Role.firstOrCreate(
      { slug: IRole.Slugs.USER },
      {
        name: 'User',
        slug: IRole.Slugs.USER,
        description: 'Regular user role',
      }
    )

    const authUser = await User.create({
      full_name: 'Auth User',
      email: 'auth@example.com',
      username: 'authuser',
      password: 'password123',
    })

    await db.table('user_roles').insert({
      user_id: authUser.id,
      role_id: userRole.id,
    })

    // Assign read permission to user role
    await assignPermissions(userRole, [IPermission.Actions.READ])

    // Create test tasks
    await Task.createMany([
      {
        title: 'Task 1',
        status: 'pending',
        priority: 'high',
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
      {
        title: 'Task 2',
        status: 'completed',
        priority: 'medium',
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
    ])

    const response = await client.get('/api/v1/tasks').loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      meta: {
        total: 2,
        per_page: 15,
        current_page: 1,
      },
    })

    const body = response.body()
    assert.equal(body.data.length, 2)
  })

  test('should filter tasks by status', async ({ client, assert }) => {
    const userRole = await Role.firstOrCreate(
      { slug: IRole.Slugs.USER },
      {
        name: 'User',
        slug: IRole.Slugs.USER,
        description: 'Regular user role',
      }
    )

    const authUser = await User.create({
      full_name: 'Auth User',
      email: 'auth@example.com',
      username: 'authuser',
      password: 'password123',
    })

    await db.table('user_roles').insert({
      user_id: authUser.id,
      role_id: userRole.id,
    })

    await assignPermissions(userRole, [IPermission.Actions.READ])

    await Task.createMany([
      {
        title: 'Pending Task',
        status: 'pending',
        priority: 'high',
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
      {
        title: 'Completed Task',
        status: 'completed',
        priority: 'medium',
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
    ])

    const response = await client.get('/api/v1/tasks?status=pending').loginAs(authUser)

    response.assertStatus(200)
    const body = response.body()
    assert.equal(body.data.length, 1)
    assert.equal(body.data[0].status, 'pending')
  })

  test('should get task by id', async ({ client }) => {
    const userRole = await Role.firstOrCreate(
      { slug: IRole.Slugs.USER },
      {
        name: 'User',
        slug: IRole.Slugs.USER,
        description: 'Regular user role',
      }
    )

    const authUser = await User.create({
      full_name: 'Auth User',
      email: 'auth@example.com',
      username: 'authuser',
      password: 'password123',
    })

    await db.table('user_roles').insert({
      user_id: authUser.id,
      role_id: userRole.id,
    })

    await assignPermissions(userRole, [IPermission.Actions.READ])

    const task = await Task.create({
      title: 'Test Task',
      description: 'Task description',
      status: 'pending',
      priority: 'high',
      creator_id: authUser.id,
      assignee_id: authUser.id,
      metadata: {
        estimated_hours: 4,
        tags: ['urgent'],
      },
    })

    const response = await client.get(`/api/v1/tasks/${task.id}`).loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignee_id: authUser.id,
      creator_id: authUser.id,
    })
  })

  test('should return 404 for non-existent task', async ({ client }) => {
    const userRole = await Role.firstOrCreate(
      { slug: IRole.Slugs.USER },
      {
        name: 'User',
        slug: IRole.Slugs.USER,
        description: 'Regular user role',
      }
    )

    const authUser = await User.create({
      full_name: 'Auth User',
      email: 'auth@example.com',
      username: 'authuser',
      password: 'password123',
    })

    await db.table('user_roles').insert({
      user_id: authUser.id,
      role_id: userRole.id,
    })

    await assignPermissions(userRole, [IPermission.Actions.READ])

    const response = await client.get('/api/v1/tasks/999999').loginAs(authUser)

    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Task not found',
    })
  })

  test('should create new task', async ({ client, assert }) => {
    const userRole = await Role.firstOrCreate(
      { slug: IRole.Slugs.USER },
      {
        name: 'User',
        slug: IRole.Slugs.USER,
        description: 'Regular user role',
      }
    )

    const authUser = await User.create({
      full_name: 'Auth User',
      email: 'auth@example.com',
      username: 'authuser',
      password: 'password123',
    })

    await db.table('user_roles').insert({
      user_id: authUser.id,
      role_id: userRole.id,
    })

    await assignPermissions(userRole, [IPermission.Actions.CREATE])

    const newTaskData = {
      title: 'New Task',
      description: 'New task description',
      priority: 'high',
      due_date: DateTime.now().plus({ days: 1 }).toISO(),
      assignee_id: authUser.id,
      metadata: {
        estimated_hours: 6,
        tags: ['backend', 'api'],
      },
    }

    const response = await client.post('/api/v1/tasks').json(newTaskData).loginAs(authUser)

    response.assertStatus(201)
    response.assertBodyContains({
      title: newTaskData.title,
      description: newTaskData.description,
      priority: newTaskData.priority,
      assignee_id: newTaskData.assignee_id,
      creator_id: authUser.id,
      status: 'pending',
    })

    const createdTask = await Task.findBy('title', newTaskData.title)
    assert.isNotNull(createdTask)
    assert.deepEqual(createdTask!.metadata, newTaskData.metadata)
  })

  test('should validate task creation data', async ({ client }) => {
    const userRole = await Role.firstOrCreate(
      { slug: IRole.Slugs.USER },
      {
        name: 'User',
        slug: IRole.Slugs.USER,
        description: 'Regular user role',
      }
    )

    const authUser = await User.create({
      full_name: 'Auth User',
      email: 'auth@example.com',
      username: 'authuser',
      password: 'password123',
    })

    await db.table('user_roles').insert({
      user_id: authUser.id,
      role_id: userRole.id,
    })

    await assignPermissions(userRole, [IPermission.Actions.CREATE])

    const response = await client
      .post('/api/v1/tasks')
      .json({
        title: '', // empty title
        priority: 'invalid', // invalid priority
        assignee_id: 'not-a-number', // invalid assignee_id
      })
      .loginAs(authUser)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'title',
          rule: 'required',
        },
        {
          field: 'priority',
          rule: 'enum',
        },
        {
          field: 'assignee_id',
          rule: 'number',
        },
      ],
    })
  })

  test('should update task', async ({ client, assert }) => {
    const userRole = await Role.firstOrCreate(
      { slug: IRole.Slugs.USER },
      {
        name: 'User',
        slug: IRole.Slugs.USER,
        description: 'Regular user role',
      }
    )

    const authUser = await User.create({
      full_name: 'Auth User',
      email: 'auth@example.com',
      username: 'authuser',
      password: 'password123',
    })

    await db.table('user_roles').insert({
      user_id: authUser.id,
      role_id: userRole.id,
    })

    await assignPermissions(userRole, [IPermission.Actions.UPDATE])

    const task = await Task.create({
      title: 'Original Title',
      status: 'pending',
      priority: 'low',
      creator_id: authUser.id,
      assignee_id: authUser.id,
    })

    const updateData = {
      title: 'Updated Title',
      description: 'Updated description',
      priority: 'high',
    }

    const response = await client.put(`/api/v1/tasks/${task.id}`).json(updateData).loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      id: task.id,
      title: updateData.title,
      description: updateData.description,
      priority: updateData.priority,
    })

    await task.refresh()
    assert.equal(task.title, updateData.title)
    assert.equal(task.description, updateData.description)
    assert.equal(task.priority, updateData.priority)
  })

  test('should update task status', async ({ client, assert }) => {
    const userRole = await Role.firstOrCreate(
      { slug: IRole.Slugs.USER },
      {
        name: 'User',
        slug: IRole.Slugs.USER,
        description: 'Regular user role',
      }
    )

    const authUser = await User.create({
      full_name: 'Auth User',
      email: 'auth@example.com',
      username: 'authuser',
      password: 'password123',
    })

    await db.table('user_roles').insert({
      user_id: authUser.id,
      role_id: userRole.id,
    })

    await assignPermissions(userRole, [IPermission.Actions.UPDATE])

    const task = await Task.create({
      title: 'Task to Toggle',
      status: 'pending',
      priority: 'medium',
      creator_id: authUser.id,
      assignee_id: authUser.id,
    })

    const response = await client
      .patch(`/api/v1/tasks/${task.id}/status`)
      .json({ status: 'completed' })
      .loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      id: task.id,
      status: 'completed',
    })

    await task.refresh()
    assert.equal(task.status, 'completed')
  })

  test('should delete task', async ({ client, assert }) => {
    const userRole = await Role.firstOrCreate(
      { slug: IRole.Slugs.USER },
      {
        name: 'User',
        slug: IRole.Slugs.USER,
        description: 'Regular user role',
      }
    )

    const authUser = await User.create({
      full_name: 'Auth User',
      email: 'auth@example.com',
      username: 'authuser',
      password: 'password123',
    })

    await db.table('user_roles').insert({
      user_id: authUser.id,
      role_id: userRole.id,
    })

    await assignPermissions(userRole, [IPermission.Actions.DELETE])

    const task = await Task.create({
      title: 'Task to Delete',
      status: 'pending',
      priority: 'medium',
      creator_id: authUser.id,
      assignee_id: authUser.id,
    })

    const response = await client.delete(`/api/v1/tasks/${task.id}`).loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Task deleted successfully',
    })

    const deletedTask = await Task.find(task.id)
    assert.isNull(deletedTask)
  })

  test('should require authentication for all operations', async ({ client }) => {
    const responses = await Promise.all([
      client.get('/api/v1/tasks'),
      client.get('/api/v1/tasks/1'),
      client.post('/api/v1/tasks').json({}),
      client.put('/api/v1/tasks/1').json({}),
      client.patch('/api/v1/tasks/1/status').json({}),
      client.delete('/api/v1/tasks/1'),
    ])

    responses.forEach((response) => {
      response.assertStatus(401)
    })
  })

  test('should require proper permissions for operations', async ({ client }) => {
    const userRole = await Role.firstOrCreate(
      { slug: IRole.Slugs.USER },
      {
        name: 'User',
        slug: IRole.Slugs.USER,
        description: 'Regular user role',
      }
    )

    const authUser = await User.create({
      full_name: 'Auth User',
      email: 'auth@example.com',
      username: 'authuser',
      password: 'password123',
    })

    await db.table('user_roles').insert({
      user_id: authUser.id,
      role_id: userRole.id,
    })

    // User has no task permissions
    const task = await Task.create({
      title: 'Test Task',
      status: 'pending',
      priority: 'medium',
      creator_id: authUser.id,
      assignee_id: authUser.id,
    })

    const responses = await Promise.all([
      client.get('/api/v1/tasks').loginAs(authUser),
      client.get(`/api/v1/tasks/${task.id}`).loginAs(authUser),
      client.post('/api/v1/tasks').json({ title: 'New Task' }).loginAs(authUser),
      client.put(`/api/v1/tasks/${task.id}`).json({ title: 'Updated' }).loginAs(authUser),
      client
        .patch(`/api/v1/tasks/${task.id}/status`)
        .json({ status: 'completed' })
        .loginAs(authUser),
      client.delete(`/api/v1/tasks/${task.id}`).loginAs(authUser),
    ])

    responses.forEach((response) => {
      response.assertStatus(403)
    })
  })
})
