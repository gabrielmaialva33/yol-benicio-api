import { test } from '@japa/runner'
import Task from '#modules/task/models/task'
import User from '#modules/user/models/user'
import Role from '#modules/role/models/role'
import Permission from '#modules/permission/models/permission'
import IRole from '#modules/role/interfaces/role_interface'
import IPermission from '#modules/permission/interfaces/permission_interface'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

test.group('Tasks Dashboard', (_group) => {
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

  test('should get dashboard tasks with pagination', async ({ client, assert }) => {
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

    // Create test tasks with different statuses and priorities
    await Task.createMany([
      {
        title: 'High Priority Task',
        status: 'pending',
        priority: 'high',
        due_date: DateTime.now().plus({ days: 1 }),
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
      {
        title: 'Medium Priority Task',
        status: 'in_progress',
        priority: 'medium',
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
      {
        title: 'Completed Task',
        status: 'completed',
        priority: 'low',
        creator_id: authUser.id,
        assignee_id: authUser.id,
        updated_at: DateTime.now(),
      },
      {
        title: 'Overdue Task',
        status: 'pending',
        priority: 'urgent',
        due_date: DateTime.now().minus({ days: 1 }),
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
    ])

    const response = await client.get('/api/v1/tasks/dashboard').loginAs(authUser)

    response.assertStatus(200)

    const body = response.body()
    assert.exists(body.tasks)
    assert.exists(body.stats)

    // Check pagination structure
    assert.exists(body.tasks.data)
    assert.exists(body.tasks.meta)
    assert.equal(body.tasks.data.length, 4)
    assert.equal(body.tasks.meta.total, 4)

    // Verify tasks are ordered by created_at desc (newest first)
    const taskTitles = body.tasks.data.map((task: any) => task.title)
    assert.include(taskTitles, 'High Priority Task')
    assert.include(taskTitles, 'Overdue Task')

    // Check stats
    assert.equal(body.stats.total_tasks, 4)
    assert.equal(body.stats.pending_tasks, 3) // pending + in_progress + overdue pending
    assert.equal(body.stats.completed_today, 1)
    assert.equal(body.stats.overdue_tasks, 1)
  })

  test('should limit dashboard tasks to specified page size', async ({ client, assert }) => {
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

    // Create more tasks than the dashboard limit (6)
    const taskData = Array.from({ length: 10 }, (_, i) => ({
      title: `Task ${i + 1}`,
      status: 'pending' as const,
      priority: 'medium' as const,
      creator_id: authUser.id,
      assignee_id: authUser.id,
    }))

    await Task.createMany(taskData)

    const response = await client.get('/api/v1/tasks/dashboard').loginAs(authUser)

    response.assertStatus(200)

    const body = response.body()

    // Should return only 6 tasks (dashboard limit)
    assert.equal(body.tasks.data.length, 6)
    assert.equal(body.tasks.meta.total, 10)
    assert.equal(body.tasks.meta.per_page, 6)
    assert.equal(body.tasks.meta.current_page, 1)

    // Stats should reflect all tasks
    assert.equal(body.stats.total_tasks, 10)
    assert.equal(body.stats.pending_tasks, 10)
  })

  test('should include task relations in dashboard response', async ({ client, assert }) => {
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

    const assigneeUser = await User.create({
      full_name: 'Assignee User',
      email: 'assignee@example.com',
      username: 'assigneeuser',
      password: 'password123',
    })

    await db.table('user_roles').insert({
      user_id: authUser.id,
      role_id: userRole.id,
    })

    await assignPermissions(userRole, [IPermission.Actions.READ])

    await Task.create({
      title: 'Task with Relations',
      status: 'pending',
      priority: 'high',
      creator_id: authUser.id,
      assignee_id: assigneeUser.id,
      metadata: {
        estimated_hours: 4,
        tags: ['urgent', 'frontend'],
      },
    })

    const response = await client.get('/api/v1/tasks/dashboard').loginAs(authUser)

    response.assertStatus(200)

    const body = response.body()
    const taskResponse = body.tasks.data[0]

    // Verify task data includes relations
    assert.exists(taskResponse.assignee)
    assert.exists(taskResponse.creator)
    assert.equal(taskResponse.assignee.id, assigneeUser.id)
    assert.equal(taskResponse.assignee.full_name, 'Assignee User')
    assert.equal(taskResponse.creator.id, authUser.id)
    assert.equal(taskResponse.creator.full_name, 'Auth User')

    // Verify metadata is included
    assert.deepEqual(taskResponse.metadata, {
      estimated_hours: 4,
      tags: ['urgent', 'frontend'],
    })
  })

  test('should calculate stats correctly for different scenarios', async ({ client, assert }) => {
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

    const today = DateTime.now()
    const yesterday = today.minus({ days: 1 })

    await Task.createMany([
      // Pending tasks
      {
        title: 'Pending Task 1',
        status: 'pending',
        priority: 'high',
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
      {
        title: 'Pending Task 2',
        status: 'pending',
        priority: 'medium',
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
      // In progress tasks
      {
        title: 'In Progress Task',
        status: 'in_progress',
        priority: 'high',
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
      // Completed today
      {
        title: 'Completed Today 1',
        status: 'completed',
        priority: 'medium',
        creator_id: authUser.id,
        assignee_id: authUser.id,
        updated_at: today,
      },
      {
        title: 'Completed Today 2',
        status: 'completed',
        priority: 'low',
        creator_id: authUser.id,
        assignee_id: authUser.id,
        updated_at: today,
      },
      // Completed yesterday (should not count)
      {
        title: 'Completed Yesterday',
        status: 'completed',
        priority: 'medium',
        creator_id: authUser.id,
        assignee_id: authUser.id,
        updated_at: yesterday,
      },
      // Overdue tasks
      {
        title: 'Overdue Task 1',
        status: 'pending',
        priority: 'urgent',
        due_date: yesterday.minus({ hours: 1 }),
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
      {
        title: 'Overdue Task 2',
        status: 'in_progress',
        priority: 'high',
        due_date: yesterday.minus({ hours: 2 }),
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
      // Future due date (not overdue)
      {
        title: 'Future Task',
        status: 'pending',
        priority: 'medium',
        due_date: today.plus({ days: 1 }),
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
      // Cancelled task
      {
        title: 'Cancelled Task',
        status: 'cancelled',
        priority: 'low',
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
    ])

    const response = await client.get('/api/v1/tasks/dashboard').loginAs(authUser)

    response.assertStatus(200)

    const body = response.body()
    const stats = body.stats

    assert.equal(stats.total_tasks, 10)
    assert.equal(stats.pending_tasks, 6) // 4 pending + 2 in_progress
    assert.equal(stats.completed_today, 2)
    assert.equal(stats.overdue_tasks, 2) // only pending/in_progress with past due_date
  })

  test('should handle empty dashboard', async ({ client, assert }) => {
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

    const response = await client.get('/api/v1/tasks/dashboard').loginAs(authUser)

    response.assertStatus(200)

    const body = response.body()

    assert.equal(body.tasks.data.length, 0)
    assert.equal(body.tasks.meta.total, 0)

    assert.equal(body.stats.total_tasks, 0)
    assert.equal(body.stats.pending_tasks, 0)
    assert.equal(body.stats.completed_today, 0)
    assert.equal(body.stats.overdue_tasks, 0)
  })

  test('should require authentication', async ({ client }) => {
    const response = await client.get('/api/v1/tasks/dashboard')

    response.assertStatus(401)
  })

  test('should require read permission', async ({ client }) => {
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
    const response = await client.get('/api/v1/tasks/dashboard').loginAs(authUser)

    response.assertStatus(403)
  })
})
