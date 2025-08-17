/**
 * Tipos de domínio do sistema jurídico
 */

import type { Timestamps } from './api'

// Enums as const objects
export const FolderStatus = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  ARCHIVED: 'archived',
} as const
export type FolderStatus = (typeof FolderStatus)[keyof typeof FolderStatus]

export const FolderArea = {
  CIVIL_LITIGATION: 'civil_litigation',
  LABOR: 'labor',
  TAX: 'tax',
  CRIMINAL: 'criminal',
  ADMINISTRATIVE: 'administrative',
  CONSUMER: 'consumer',
  FAMILY: 'family',
  CORPORATE: 'corporate',
  ENVIRONMENTAL: 'environmental',
  INTELLECTUAL_PROPERTY: 'intellectual_property',
  REAL_ESTATE: 'real_estate',
  INTERNATIONAL: 'international',
} as const
export type FolderArea = (typeof FolderArea)[keyof typeof FolderArea]

export const UserRole = {
  ADMIN: 'admin',
  LAWYER: 'lawyer',
  PARALEGAL: 'paralegal',
  SECRETARY: 'secretary',
  CLIENT: 'client',
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export const TaskStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]

export const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const
export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority]

// Interfaces
export interface User extends Timestamps {
  id: number
  full_name: string
  email: string
  username: string
  avatar_url?: string
  phone?: string
  oab_number?: string // OAB number for lawyers
  metadata: {
    email_verified: boolean
    email_verified_at: string | null
    last_login_at?: string
    preferences?: Record<string, unknown>
  }
  roles: Role[]
}

export interface Role extends Timestamps {
  id: number
  name: string
  slug: string
  description: string | null
  permissions?: Permission[]
}

export interface Permission extends Timestamps {
  id: number
  name: string
  slug: string
  description: string | null
}

export interface Folder extends Timestamps {
  id: number
  code: string // Process/folder number
  title: string
  description?: string
  status: FolderStatus
  area: FolderArea
  court?: string // Court/Tribunal
  case_number?: string // Legal case number
  opposing_party?: string // Opposing party
  value?: number // Case value
  client: Client
  responsible_lawyer: User
  team_members: User[]
  documents_count: number
  tasks_count: number
  hearings_count: number
  is_favorite: boolean
  metadata: {
    risk_assessment?: 'low' | 'medium' | 'high'
    next_deadline?: string
    last_movement?: string
    tags?: string[]
  }
}

export interface Client extends Timestamps {
  id: number
  name: string
  document: string // CPF/CNPJ
  email?: string
  phone?: string
  address?: Address
  folders_count: number
  active_folders_count: number
  metadata: {
    type: 'individual' | 'company'
    birthday?: string
    contact_person?: string
    notes?: string
  }
}

export interface Address {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  postal_code: string
  country: string
}

export interface Task extends Timestamps {
  id: number
  title: string
  description?: string
  due_date: string
  status: TaskStatus
  priority: TaskPriority
  folder?: Folder
  assigned_to: User
  created_by: User
  completed_at?: string
  metadata: {
    estimated_hours?: number
    actual_hours?: number
    tags?: string[]
    checklist?: Array<{
      id: string
      text: string
      completed: boolean
    }>
  }
}

export interface Hearing extends Timestamps {
  id: number
  folder: Folder
  title: string
  type: 'audience' | 'judgment' | 'conciliation' | 'instruction'
  date: string
  time: string
  location: string
  judge?: string
  notes?: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'postponed'
  attendees: User[]
  metadata: {
    online_link?: string
    documents?: string[]
    result?: string
  }
}

export interface Document extends Timestamps {
  id: number
  folder: Folder
  title: string
  type: string
  file_name: string
  file_size: number
  file_url: string
  uploaded_by: User
  version: number
  metadata: {
    mime_type: string
    pages?: number
    signed?: boolean
    signers?: Array<{
      name: string
      signed_at?: string
    }>
  }
}

export interface Request extends Timestamps {
  id: number
  folder?: Folder
  title: string
  description: string
  type: 'document' | 'information' | 'deadline_extension' | 'other'
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  requested_by: User
  assigned_to?: User
  due_date?: string
  completed_at?: string
  metadata: {
    priority?: TaskPriority
    attachments?: string[]
    comments_count?: number
  }
}

// Dashboard specific types
export interface DashboardStats {
  folders: {
    total: number
    active: number
    completed: number
    new_this_month: number
    by_area: Array<{
      area: FolderArea
      count: number
      percentage: number
    }>
    by_status: Array<{
      status: FolderStatus
      count: number
      percentage: number
    }>
    monthly_evolution: Array<{
      month: string
      count: number
    }>
  }
  tasks: {
    total: number
    pending: number
    completed_today: number
    overdue: number
    by_priority: Array<{
      priority: TaskPriority
      count: number
    }>
  }
  hearings: {
    upcoming: number
    this_week: number
    this_month: number
  }
  clients: {
    total: number
    active: number
    new_this_month: number
  }
}