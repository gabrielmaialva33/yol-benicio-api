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

test.group('Tasks Stats', (group) => {
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

  test('should get task statistics', async ({ client, assert }) => {
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

    // Create test tasks with different statuses and timing
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
      // In progress tasks (count as pending in stats)
      {
        title: 'In Progress Task',
        status: 'in_progress',
        priority: 'high',
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
      // Completed tasks
      {
        title: 'Completed Task 1',
        status: 'completed',
        priority: 'medium',
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
      {
        title: 'Completed Task 2',
        status: 'completed',
        priority: 'low',
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
      // Completed today (should count in completed_today)
      {
        title: 'Completed Today',
        status: 'completed',
        priority: 'high',
        creator_id: authUser.id,
        assignee_id: authUser.id,
        updated_at: today,
      },
      // Overdue tasks
      {
        title: 'Overdue Pending',
        status: 'pending',
        priority: 'urgent',
        due_date: yesterday.minus({ hours: 1 }),
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
      {
        title: 'Overdue In Progress',
        status: 'in_progress',
        priority: 'high',
        due_date: yesterday.minus({ hours: 2 }),
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
      // Future task (not overdue)
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

    const response = await client.get('/api/v1/tasks/stats').loginAs(authUser)

    response.assertStatus(200)

    const stats = response.body()

    // Verify all stat fields are present and correct
    assert.equal(stats.total_tasks, 10)
    assert.equal(stats.pending_tasks, 6) // 4 pending + 2 in_progress tasks
    assert.equal(stats.completed_today, 3) // all completed tasks have today's timestamp
    assert.equal(stats.overdue_tasks, 2) // only pending/in_progress with past due_date

    // Verify data types
    assert.isNumber(stats.total_tasks)
    assert.isNumber(stats.pending_tasks)
    assert.isNumber(stats.completed_today)
    assert.isNumber(stats.overdue_tasks)
  })

  test('should handle no completed tasks today', async ({ client, assert }) => {
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

    const yesterday = DateTime.now().minus({ days: 1 })

    await Task.createMany([
      {
        title: 'Old Completed Task',
        status: 'completed',
        priority: 'medium',
        creator_id: authUser.id,
        assignee_id: authUser.id,
        updated_at: yesterday,
      },
      {
        title: 'Pending Task',
        status: 'pending',
        priority: 'high',
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
    ])

    const response = await client.get('/api/v1/tasks/stats').loginAs(authUser)

    response.assertStatus(200)

    const stats = response.body()

    assert.equal(stats.total_tasks, 2)
    assert.equal(stats.pending_tasks, 1)
    assert.equal(stats.completed_today, 0) // No tasks completed today
    assert.equal(stats.overdue_tasks, 0)
  })

  test('should handle no overdue tasks', async ({ client, assert }) => {
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

    const tomorrow = DateTime.now().plus({ days: 1 })

    await Task.createMany([
      {
        title: 'Future Task',
        status: 'pending',
        priority: 'high',
        due_date: tomorrow,
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
      {
        title: 'No Due Date Task',
        status: 'pending',
        priority: 'medium',
        creator_id: authUser.id,
        assignee_id: authUser.id,
        // no due_date
      },
    ])

    const response = await client.get('/api/v1/tasks/stats').loginAs(authUser)

    response.assertStatus(200)

    const stats = response.body()

    assert.equal(stats.total_tasks, 2)
    assert.equal(stats.pending_tasks, 2)
    assert.equal(stats.completed_today, 0)
    assert.equal(stats.overdue_tasks, 0) // No overdue tasks
  })

  test('should only count pending/in_progress tasks as overdue', async ({ client, assert }) => {
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

    const yesterday = DateTime.now().minus({ days: 1 })

    await Task.createMany([
      // Overdue but completed - should NOT count as overdue
      {
        title: 'Completed Overdue Task',
        status: 'completed',
        priority: 'high',
        due_date: yesterday,
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
      // Overdue but cancelled - should NOT count as overdue
      {
        title: 'Cancelled Overdue Task',
        status: 'cancelled',
        priority: 'medium',
        due_date: yesterday,
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
      // Overdue and pending - SHOULD count as overdue
      {
        title: 'Pending Overdue Task',
        status: 'pending',
        priority: 'urgent',
        due_date: yesterday,
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
      // Overdue and in_progress - SHOULD count as overdue
      {
        title: 'In Progress Overdue Task',
        status: 'in_progress',
        priority: 'high',
        due_date: yesterday,
        creator_id: authUser.id,
        assignee_id: authUser.id,
      },
    ])

    const response = await client.get('/api/v1/tasks/stats').loginAs(authUser)

    response.assertStatus(200)

    const stats = response.body()

    assert.equal(stats.total_tasks, 4)
    assert.equal(stats.pending_tasks, 2) // pending + in_progress
    assert.equal(stats.completed_today, 1) // completed task has today's timestamp
    assert.equal(stats.overdue_tasks, 2) // only pending + in_progress overdue tasks
  })

  test('should return zero stats for empty database', async ({ client, assert }) => {
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

    const response = await client.get('/api/v1/tasks/stats').loginAs(authUser)

    response.assertStatus(200)

    const stats = response.body()

    assert.equal(stats.total_tasks, 0)
    assert.equal(stats.pending_tasks, 0)
    assert.equal(stats.completed_today, 0)
    assert.equal(stats.overdue_tasks, 0)
  })

  test('should handle timezone differences correctly for completed_today', async ({
    client,
    assert,
  }) => {
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

    const now = DateTime.now()
    const startOfToday = now.startOf('day')
    const endOfToday = now.endOf('day')
    const almostMidnight = endOfToday.minus({ minutes: 1 })

    await Task.createMany([
      // Completed early today
      {
        title: 'Completed Early Today',
        status: 'completed',
        priority: 'medium',
        creator_id: authUser.id,
        assignee_id: authUser.id,
        updated_at: startOfToday.plus({ hours: 1 }),
      },
      // Completed almost at midnight
      {
        title: 'Completed Late Today',
        status: 'completed',
        priority: 'low',
        creator_id: authUser.id,
        assignee_id: authUser.id,
        updated_at: almostMidnight,
      },
      // Completed yesterday (just before midnight)
      {
        title: 'Completed Yesterday',
        status: 'completed',
        priority: 'high',
        creator_id: authUser.id,
        assignee_id: authUser.id,
        updated_at: startOfToday.minus({ minutes: 1 }),
      },
    ])

    const response = await client.get('/api/v1/tasks/stats').loginAs(authUser)

    response.assertStatus(200)

    const stats = response.body()

    assert.equal(stats.total_tasks, 3)
    assert.equal(stats.pending_tasks, 0)
    assert.equal(stats.completed_today, 2) // Only the two completed today
    assert.equal(stats.overdue_tasks, 0)
  })

  test('should require authentication', async ({ client }) => {
    const response = await client.get('/api/v1/tasks/stats')

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
    const response = await client.get('/api/v1/tasks/stats').loginAs(authUser)

    response.assertStatus(403)
  })
})
