import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import app from '@adonisjs/core/services/app'
import TaskService from '#modules/task/services/task_service'
import Task from '#modules/task/models/task'
import User from '#modules/user/models/user'
import Role from '#modules/role/models/role'
import IRole from '#modules/role/interfaces/role_interface'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

test.group('TaskService', (group) => {
  let taskService: TaskService
  let user: User

  group.setup(async () => {
    taskService = await app.container.make(TaskService)
  })

  group.teardown(async () => {
    await testUtils.db().truncate()
  })

  group.each.setup(async () => {
    await testUtils.db().truncate()

    // Create user role
    const userRole = await Role.firstOrCreate(
      { slug: IRole.Slugs.USER },
      {
        name: 'User',
        slug: IRole.Slugs.USER,
        description: 'Regular user role',
      }
    )

    // Create test user
    user = await User.create({
      full_name: 'Test User',
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
    })

    await db.table('user_roles').insert({
      user_id: user.id,
      role_id: userRole.id,
    })
  })

  group.each.teardown(async () => {
    // Clean up after each test
    await db.manager.closeAll(true)
  })

  test('should get task statistics', async ({ assert }) => {
    // Create test tasks
    await Task.createMany([
      {
        title: 'Pending Task 1',
        status: 'pending',
        priority: 'high',
        creator_id: user.id,
        assignee_id: user.id,
      },
      {
        title: 'In Progress Task',
        status: 'in_progress',
        priority: 'medium',
        creator_id: user.id,
        assignee_id: user.id,
      },
      {
        title: 'Completed Today',
        status: 'completed',
        priority: 'low',
        creator_id: user.id,
        assignee_id: user.id,
        updated_at: DateTime.now(),
      },
      {
        title: 'Overdue Task',
        status: 'pending',
        priority: 'urgent',
        due_date: DateTime.now().minus({ days: 1 }),
        creator_id: user.id,
        assignee_id: user.id,
      },
    ])

    const tasks = await taskService.getTasksStats()

    assert.equal(tasks.length, 4)
    assert.equal(tasks.filter((task) => !task.completed).length, 3) // 2 pending + 1 in_progress
    assert.equal(tasks.filter((task) => task.completed).length, 1)
    // Since getTasksStats returns basic task info, not detailed stats
    assert.isArray(tasks)
  })

  test('should get tasks with pagination', async ({ assert }) => {
    // Create multiple tasks
    await Task.createMany([
      {
        title: 'Task 1',
        status: 'pending',
        priority: 'high',
        creator_id: user.id,
        assignee_id: user.id,
      },
      {
        title: 'Task 2',
        status: 'completed',
        priority: 'medium',
        creator_id: user.id,
        assignee_id: user.id,
      },
      {
        title: 'Task 3',
        status: 'in_progress',
        priority: 'low',
        creator_id: user.id,
        assignee_id: user.id,
      },
    ])

    const result = await taskService.getTasks(1, 2)

    assert.equal(result.all().length, 2)
    assert.equal(result.getMeta().total, 3)
    assert.equal(result.getMeta().per_page, 2)
    assert.equal(result.getMeta().current_page, 1)
  })

  test('should filter tasks by status', async ({ assert }) => {
    await Task.createMany([
      {
        title: 'Pending Task',
        status: 'pending',
        priority: 'high',
        creator_id: user.id,
        assignee_id: user.id,
      },
      {
        title: 'Completed Task',
        status: 'completed',
        priority: 'medium',
        creator_id: user.id,
        assignee_id: user.id,
      },
    ])

    const pendingTasks = await taskService.getTasks(1, 10, { status: 'pending' })
    const completedTasks = await taskService.getTasks(1, 10, { status: 'completed' })

    assert.equal(pendingTasks.all().length, 1)
    assert.equal(pendingTasks.all()[0].status, 'pending')
    assert.equal(completedTasks.all().length, 1)
    assert.equal(completedTasks.all()[0].status, 'completed')
  })

  test('should filter tasks by assignee', async ({ assert }) => {
    // Create another user
    const anotherUser = await User.create({
      full_name: 'Another User',
      email: 'another@example.com',
      username: 'anotheruser',
      password: 'password123',
    })

    await Task.createMany([
      {
        title: 'Task for User 1',
        status: 'pending',
        priority: 'high',
        creator_id: user.id,
        assignee_id: user.id,
      },
      {
        title: 'Task for User 2',
        status: 'pending',
        priority: 'medium',
        creator_id: user.id,
        assignee_id: anotherUser.id,
      },
    ])

    const userTasks = await taskService.getTasks(1, 10, { assignee_id: user.id })
    const anotherUserTasks = await taskService.getTasks(1, 10, { assignee_id: anotherUser.id })

    assert.equal(userTasks.all().length, 1)
    assert.equal(userTasks.all()[0].assignee_id, user.id)
    assert.equal(anotherUserTasks.all().length, 1)
    assert.equal(anotherUserTasks.all()[0].assignee_id, anotherUser.id)
  })

  test('should filter tasks by date range', async ({ assert }) => {
    const today = DateTime.now()
    const tomorrow = today.plus({ days: 1 })
    const nextWeek = today.plus({ days: 7 })

    await Task.createMany([
      {
        title: 'Task Due Tomorrow',
        status: 'pending',
        priority: 'high',
        due_date: tomorrow,
        creator_id: user.id,
        assignee_id: user.id,
      },
      {
        title: 'Task Due Next Week',
        status: 'pending',
        priority: 'medium',
        due_date: nextWeek,
        creator_id: user.id,
        assignee_id: user.id,
      },
    ])

    const tasksInRange = await taskService.getTasks(1, 10, {
      dateRange: {
        from: today.toJSDate(),
        to: tomorrow.plus({ hours: 1 }).toJSDate(),
      },
    })

    assert.equal(tasksInRange.all().length, 1)
    assert.equal(tasksInRange.all()[0].title, 'Task Due Tomorrow')
  })

  test('should create a new task', async ({ assert }) => {
    const taskData = {
      title: 'New Task',
      description: 'Task description',
      priority: 'high' as const,
      due_date: DateTime.now().plus({ days: 1 }),
      assignee_id: user.id,
      creator_id: user.id,
    }

    const task = await taskService.createTask(taskData)

    assert.exists(task.id)
    assert.equal(task.title, taskData.title)
    assert.equal(task.description, taskData.description)
    assert.equal(task.priority, taskData.priority)
    assert.equal(task.assignee_id, taskData.assignee_id)
    assert.equal(task.creator_id, taskData.creator_id)
    assert.equal(task.status, 'pending')
  })

  test('should update task status', async ({ assert }) => {
    const task = await Task.create({
      title: 'Test Task',
      status: 'pending',
      priority: 'medium',
      creator_id: user.id,
      assignee_id: user.id,
    })

    const updatedTask = await taskService.updateTaskStatus(task.id, 'completed')

    assert.equal(updatedTask.status, 'completed')
    assert.equal(updatedTask.id, task.id)
  })

  test('should get task by id with relations', async ({ assert }) => {
    const task = await Task.create({
      title: 'Test Task',
      status: 'pending',
      priority: 'medium',
      creator_id: user.id,
      assignee_id: user.id,
    })

    const foundTask = await taskService.getTask(task.id)

    assert.equal(foundTask.id, task.id)
    assert.equal(foundTask.title, task.title)
    assert.exists(foundTask.assignee)
    assert.exists(foundTask.creator)
    assert.equal(foundTask.assignee!.id, user.id)
    assert.equal(foundTask.creator!.id, user.id)
  })

  test('should throw error when getting non-existent task', async ({ assert }) => {
    await assert.rejects(() => taskService.getTask(99999), 'Row not found')
  })

  test('should delete task', async ({ assert }) => {
    const task = await Task.create({
      title: 'Task to Delete',
      status: 'pending',
      priority: 'medium',
      creator_id: user.id,
      assignee_id: user.id,
    })

    const result = await taskService.deleteTask(task.id)

    assert.equal(result.message, 'Task deleted successfully')

    const deletedTask = await Task.find(task.id)
    assert.isNull(deletedTask)
  })

  test('should throw error when deleting non-existent task', async ({ assert }) => {
    await assert.rejects(() => taskService.deleteTask(99999), 'Row not found')
  })

  test('should handle empty date range gracefully', async ({ assert }) => {
    await Task.create({
      title: 'Task without due date',
      status: 'pending',
      priority: 'medium',
      creator_id: user.id,
      assignee_id: user.id,
    })

    const tasks = await taskService.getTasks(1, 10, {
      dateRange: {
        from: DateTime.now().toJSDate(),
        to: DateTime.now().plus({ days: 1 }).toJSDate(),
      },
    })

    // Should return empty result since task has no due_date
    assert.equal(tasks.all().length, 0)
  })

  test('should order tasks by creation date descending', async ({ assert }) => {
    const firstTask = await Task.create({
      title: 'First Task',
      status: 'pending',
      priority: 'medium',
      creator_id: user.id,
      assignee_id: user.id,
    })

    // Wait a bit to ensure different timestamps
    await new Promise((resolve) => setTimeout(resolve, 10))

    const secondTask = await Task.create({
      title: 'Second Task',
      status: 'pending',
      priority: 'medium',
      creator_id: user.id,
      assignee_id: user.id,
    })

    const tasks = await taskService.getTasks(1, 10)

    assert.equal(tasks.all().length, 2)
    // Second task should come first (newest first)
    assert.equal(tasks.all()[0].id, secondTask.id)
    assert.equal(tasks.all()[1].id, firstTask.id)
  })
})
