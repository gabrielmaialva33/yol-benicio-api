import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'

// Generate mock folders
const generateFolders = (count = 20) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    code: `PROC-${faker.number.int({ min: 1000, max: 9999 })}-${faker.date.past().getFullYear()}`,
    title: faker.company.catchPhrase(),
    client_name: faker.person.fullName(),
    client_id: faker.number.int({ min: 1, max: 100 }),
    area: faker.helpers.arrayElement(['Civil', 'Criminal', 'Trabalhista', 'Tributário', 'Família']),
    status: faker.helpers.arrayElement(['active', 'archived', 'pending']) as
      | 'active'
      | 'archived'
      | 'pending',
    responsible_lawyer: faker.person.fullName(),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
  }))
}

const folders = generateFolders(50)

export const foldersHandlers = [
  // Get folders list
  http.get('/api/folders', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || 1)
    const perPage = Number(url.searchParams.get('per_page') || 10)
    const search = url.searchParams.get('search') || ''
    const status = url.searchParams.get('status') || ''

    let filteredFolders = [...folders]

    // Apply filters
    if (search) {
      filteredFolders = filteredFolders.filter(
        (folder) =>
          folder.title.toLowerCase().includes(search.toLowerCase()) ||
          folder.code.toLowerCase().includes(search.toLowerCase()) ||
          folder.client_name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status) {
      filteredFolders = filteredFolders.filter((folder) => folder.status === status)
    }

    // Pagination
    const start = (page - 1) * perPage
    const end = start + perPage
    const paginatedFolders = filteredFolders.slice(start, end)

    return HttpResponse.json({
      data: paginatedFolders,
      meta: {
        total: filteredFolders.length,
        per_page: perPage,
        current_page: page,
        last_page: Math.ceil(filteredFolders.length / perPage),
        first_page: 1,
        first_page_url: `/api/folders?page=1`,
        last_page_url: `/api/folders?page=${Math.ceil(filteredFolders.length / perPage)}`,
        next_page_url:
          page < Math.ceil(filteredFolders.length / perPage)
            ? `/api/folders?page=${page + 1}`
            : null,
        previous_page_url: page > 1 ? `/api/folders?page=${page - 1}` : null,
      },
    })
  }),

  // Get folder by ID
  http.get('/api/folders/:id', ({ params }) => {
    const folder = folders.find((f) => f.id === Number(params.id))

    if (!folder) {
      return HttpResponse.json({ message: 'Folder not found' }, { status: 404 })
    }

    return HttpResponse.json(folder)
  }),

  // Create folder
  http.post('/api/folders', async ({ request }) => {
    const body = (await request.json()) as any

    const newFolder = {
      id: folders.length + 1,
      code: `PROC-${faker.number.int({ min: 1000, max: 9999 })}-${new Date().getFullYear()}`,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    folders.push(newFolder)

    return HttpResponse.json(newFolder, { status: 201 })
  }),

  // Update folder
  http.put('/api/folders/:id', async ({ params, request }) => {
    const body = (await request.json()) as any
    const index = folders.findIndex((f) => f.id === Number(params.id))

    if (index === -1) {
      return HttpResponse.json({ message: 'Folder not found' }, { status: 404 })
    }

    folders[index] = {
      ...folders[index],
      ...body,
      updated_at: new Date().toISOString(),
    }

    return HttpResponse.json(folders[index])
  }),

  // Delete folder
  http.delete('/api/folders/:id', ({ params }) => {
    const index = folders.findIndex((f) => f.id === Number(params.id))

    if (index === -1) {
      return HttpResponse.json({ message: 'Folder not found' }, { status: 404 })
    }

    folders.splice(index, 1)

    return HttpResponse.json({ message: 'Folder deleted successfully' })
  }),
]
