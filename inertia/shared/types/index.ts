// Domain types
export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  permissions?: string[]
  roles?: string[]
}

export interface Folder {
  id: number
  code: string
  title: string
  client_name: string
  client_id: number
  area: string
  status: 'active' | 'archived' | 'pending'
  responsible_lawyer: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: number
  title: string
  description?: string
  due_date?: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
  assigned_to?: number
  folder_id?: number
  created_at: string
  updated_at: string
}

export interface Client {
  id: number
  name: string
  email: string
  phone?: string
  document: string
  type: 'individual' | 'company'
  created_at: string
  updated_at: string
}

export interface Notification {
  id: number
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  created_at: string
}

export interface Message {
  id: number
  from: User
  subject: string
  body: string
  read: boolean
  created_at: string
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
    first_page: number
    first_page_url: string
    last_page_url: string
    next_page_url: string | null
    previous_page_url: string | null
  }
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status: number
}
