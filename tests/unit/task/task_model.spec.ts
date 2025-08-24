import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import Task from '#modules/task/models/task'
import User from '#modules/user/models/user'
import Role from '#modules/role/models/role'
import IRole from '#modules/role/interfaces/role_interface'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

test.group('Task Model', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  let user: User

  group.each.setup(async () => {
    // Create user role
    const userRole = await Role.firstOrCreate(
      { slug: IRole.Slugs.USER },
      {
        name: 'User',
        slug: IRole.Slugs.USER,
        description: 'Regular user role',
      }
    )

    // Create test user with unique email
    const timestamp = Date.now()
    user = await User.create({
      full_name: 'Test User',
      email: `test-${timestamp}@example.com`,
      username: `testuser-${timestamp}`,
      password: 'password123',
    })

    await db.table('user_roles').insert({
      user_id: user.id,
      role_id: userRole.id,
    })
  })

  test('should create task with valid data', async ({ assert }) => {
    const task = await Task.create({
      title: 'Test Task',
      description: 'This is a test task',
      status: 'pending',
      priority: 'high',
      due_date: DateTime.now().plus({ days: 1 }),
      assignee_id: user.id,
      creator_id: user.id,
      metadata: {
        estimated_hours: 4,
        tags: ['urgent', 'client-work'],
      },
    })

    assert.exists(task.id)
    assert.equal(task.title, 'Test Task')
    assert.equal(task.description, 'This is a test task')
    assert.equal(task.status, 'pending')
    assert.equal(task.priority, 'high')
    assert.equal(task.assignee_id, user.id)
    assert.equal(task.creator_id, user.id)
    assert.exists(task.created_at)
    assert.exists(task.updated_at)
  })

  test('should handle metadata as JSON', async ({ assert }) => {
    const metadata = {
      estimated_hours: 8,
      actual_hours: 6,
      tags: ['backend', 'api'],
      checklist: [
        { id: '1', text: 'Setup database', completed: true },
        { id: '2', text: 'Create API', completed: false },
      ],
    }

    const task = await Task.create({
      title: 'Metadata Task',
      status: 'in_progress',
      priority: 'medium',
      creator_id: user.id,
      assignee_id: user.id,
      metadata,
    })

    // Fetch from database to test serialization
    const savedTask = await Task.findOrFail(task.id)

    assert.deepEqual(savedTask.metadata, metadata)
    assert.equal(savedTask.metadata.estimated_hours, 8)
    assert.equal(savedTask.metadata.tags.length, 2)
    assert.equal(savedTask.metadata.checklist[0].completed, true)
  })

  test('should load assignee relation', async ({ assert }) => {
    const task = await Task.create({
      title: 'Task with Assignee',
      status: 'pending',
      priority: 'medium',
      creator_id: user.id,
      assignee_id: user.id,
    })

    await task.load('assignee')

    assert.exists(task.assignee)
    assert.equal(task.assignee!.id, user.id)
    assert.equal(task.assignee!.full_name, 'Test User')
    assert.equal(task.assignee!.email, user.email)
  })

  test('should load creator relation', async ({ assert }) => {
    const task = await Task.create({
      title: 'Task with Creator',
      status: 'pending',
      priority: 'medium',
      creator_id: user.id,
      assignee_id: user.id,
    })

    await task.load('creator')

    assert.exists(task.creator)
    assert.equal(task.creator.id, user.id)
    assert.equal(task.creator.full_name, 'Test User')
    assert.equal(task.creator.email, user.email)
  })

  test('should handle task without assignee', async ({ assert }) => {
    const task = await Task.create({
      title: 'Unassigned Task',
      status: 'pending',
      priority: 'low',
      creator_id: user.id,
      assignee_id: null,
    })

    assert.exists(task.id)
    assert.isNull(task.assignee_id)
  })

  test('should handle task without due date', async ({ assert }) => {
    const task = await Task.create({
      title: 'No Due Date Task',
      status: 'pending',
      priority: 'medium',
      creator_id: user.id,
      assignee_id: user.id,
      due_date: null,
    })

    assert.exists(task.id)
    assert.isNull(task.due_date)
  })

  test('should validate enum values for status', async ({ assert }) => {
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled']

    for (const status of validStatuses) {
      const task = await Task.create({
        title: `Task with ${status} status`,
        status: status as any,
        priority: 'medium',
        creator_id: user.id,
        assignee_id: user.id,
      })

      assert.equal(task.status, status)
    }
  })

  test('should validate enum values for priority', async ({ assert }) => {
    const validPriorities = ['low', 'medium', 'high', 'urgent']

    for (const priority of validPriorities) {
      const task = await Task.create({
        title: `Task with ${priority} priority`,
        status: 'pending',
        priority: priority as any,
        creator_id: user.id,
        assignee_id: user.id,
      })

      assert.equal(task.priority, priority)
    }
  })

  test('should handle DateTime for due_date', async ({ assert }) => {
    const dueDate = DateTime.now().plus({ days: 5 }).startOf('day')

    const task = await Task.create({
      title: 'Task with Due Date',
      status: 'pending',
      priority: 'high',
      due_date: dueDate,
      creator_id: user.id,
      assignee_id: user.id,
    })

    assert.exists(task.due_date)
    assert.isTrue(task.due_date instanceof DateTime)
    assert.equal(task.due_date!.toSQLDate(), dueDate.toSQLDate())
  })

  test('should auto-populate timestamps', async ({ assert }) => {
    const beforeCreation = DateTime.now()

    const task = await Task.create({
      title: 'Timestamp Test',
      status: 'pending',
      priority: 'medium',
      creator_id: user.id,
      assignee_id: user.id,
    })

    const afterCreation = DateTime.now()

    assert.exists(task.created_at)
    assert.exists(task.updated_at)
    assert.isTrue(task.created_at instanceof DateTime)
    assert.isTrue(task.updated_at instanceof DateTime)

    // Verify timestamps are reasonable
    assert.isTrue(task.created_at >= beforeCreation)
    assert.isTrue(task.created_at <= afterCreation)
    assert.isTrue(task.updated_at >= beforeCreation)
    assert.isTrue(task.updated_at <= afterCreation)
  })

  test('should update updated_at on save', async ({ assert }) => {
    const task = await Task.create({
      title: 'Update Test',
      status: 'pending',
      priority: 'medium',
      creator_id: user.id,
      assignee_id: user.id,
    })

    const originalUpdatedAt = task.updated_at

    // Wait a bit to ensure different timestamp
    await new Promise((resolve) => setTimeout(resolve, 10))

    task.title = 'Updated Title'
    await task.save()

    assert.notEqual(task.updated_at.toMillis(), originalUpdatedAt.toMillis())
    assert.isTrue(task.updated_at > originalUpdatedAt)
  })

  test('should use correct table name', async ({ assert }) => {
    assert.equal(Task.table, 'tasks')
  })

  test('should have correct primary key', async ({ assert }) => {
    const task = await Task.create({
      title: 'Primary Key Test',
      status: 'pending',
      priority: 'medium',
      creator_id: user.id,
      assignee_id: user.id,
    })

    assert.exists(task.id)
    assert.isNumber(task.id)
    assert.isTrue(task.id > 0)
  })

  test('should handle empty metadata', async ({ assert }) => {
    const task = await Task.create({
      title: 'Empty Metadata Task',
      status: 'pending',
      priority: 'medium',
      creator_id: user.id,
      assignee_id: user.id,
      metadata: {},
    })

    // Fetch from database to test serialization
    const savedTask = await Task.findOrFail(task.id)

    assert.exists(savedTask.metadata)
    assert.deepEqual(savedTask.metadata, {})
  })
})
