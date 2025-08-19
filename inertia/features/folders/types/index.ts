// Folder types for YOL Benício Legal Management System
import type { User } from '@/shared/types/domain'

export type FolderStatus = 'Ativo' | 'Arquivado' | 'Suspenso' | 'Encerrado'
export type FolderInstance = 'Primeira Instância' | 'Segunda Instância' | 'Tribunais Superiores'
export type FolderNature = 'Cível' | 'Criminal' | 'Trabalhista' | 'Tributário' | 'Administrativo'
export type FolderPhase = 'Conhecimento' | 'Execução' | 'Recurso' | 'Cumprimento de Sentença'
export type FolderDistribution = 'Sorteio' | 'Dependência' | 'Prevenção'
export type FolderPartyType = 'Autor' | 'Réu' | 'Terceiro'

// Party in a legal case
export interface FolderParty {
  name: string
  cpf?: string
  cnpj?: string
  type: FolderPartyType
}

// Document attached to a folder
export interface FolderDocument {
  id: string
  name: string
  type: 'Petição' | 'Contrato' | 'Procuração' | 'Decisão' | 'Sentença' | 'Outros'
  uploadDate: string
  size: string
  url?: string
  mimeType?: string
}

// Movement/activity in a folder
export interface FolderMovement {
  id: string
  date: string
  description: string
  responsible: string
  type?: string
  internal?: boolean
}

// Responsible person for a folder
export interface FolderResponsible {
  id: string
  name: string
  email: string
  avatar?: string
  position?: string
}

// Complete folder data structure
export interface FolderDetail {
  // Identification
  id: string
  clientNumber: string
  status: FolderStatus
  date: string
  time: string

  // Process Information
  processNumber: string
  cnjNumber: string
  instance: FolderInstance
  nature: FolderNature
  actionType: string
  phase: FolderPhase
  electronic: boolean
  clientCode: string
  folder: string
  defaultBillingCase: boolean
  totus: boolean
  migrated: boolean

  // Court Information
  organ: string
  distribution: FolderDistribution
  entryDate: string
  internalCode: string
  searchType: string
  code: string
  judge: string

  // Location and Responsibles
  area: string
  subArea: string
  core: string
  district: string
  court: string
  courtDivision: string
  partner: string
  coordinator: string
  lawyer: string

  // Parties
  plaintiff: FolderParty
  defendant: FolderParty

  // Detailed Information
  observation: string
  objectDetail: string
  lastMovement: string

  // Values
  caseValue: number
  convictionValue?: number
  costs?: number
  fees?: number

  // Important Dates
  distributionDate: string
  citationDate?: string
  nextHearing?: string

  // Responsible for the folder
  responsible: FolderResponsible

  // Attached Documents
  documents: FolderDocument[]

  // Movements
  movements: FolderMovement[]

  // Metadata
  favorite?: boolean
  createdAt: string
  updatedAt: string
  createdBy?: User
  updatedBy?: User
}

// Form data for creating/updating folders
export interface FolderFormData {
  // Basic Information
  clientNumber: string
  status: FolderStatus

  // Process Information
  processNumber: string
  cnjNumber?: string
  instance: FolderInstance
  nature: FolderNature
  actionType: string
  phase: FolderPhase
  electronic: boolean
  clientCode: string
  folder: string
  defaultBillingCase: boolean

  // Court Information
  organ: string
  distribution: FolderDistribution
  entryDate: string
  internalCode?: string
  searchType?: string
  code?: string
  judge?: string

  // Location and Responsibles
  area: string
  subArea: string
  core?: string
  district: string
  court: string
  courtDivision?: string
  partner: string
  coordinator?: string
  lawyer: string

  // Parties
  plaintiff: Omit<FolderParty, 'type'> & { type: 'Autor' }
  defendant: Omit<FolderParty, 'type'> & { type: 'Réu' }

  // Detailed Information
  observation?: string
  objectDetail?: string

  // Values
  caseValue: number
  convictionValue?: number
  costs?: number
  fees?: number

  // Important Dates
  distributionDate: string
  citationDate?: string
  nextHearing?: string
}

// Simplified type for listing
export interface FolderSummary {
  id: string
  favorite: boolean
  clientNumber: string
  responsible: FolderResponsible
  inclusionDate: string
  inclusionTime: string
  docs: number
  area: string
  status: FolderStatus
  processNumber?: string
  lawyer?: string
  lastMovement?: string
}

// Filters for consultation
export interface FolderFilters {
  clientNumber?: string
  dateRange?: {
    start: string
    end: string
  }
  area?: string
  status?: FolderStatus
  partner?: string
  lawyer?: string
  district?: string
  processNumber?: string
  favorite?: boolean
  search?: string
}

// Pagination for folder lists
export interface FolderPagination {
  page: number
  per_page: number
  total: number
  last_page: number
  current_page: number
  from: number
  to: number
  first_page_url: string
  last_page_url: string
  next_page_url?: string
  prev_page_url?: string
}

// API Response for folder consultation
export interface FolderConsultationResponse {
  data: FolderSummary[]
  meta: FolderPagination
}

// API Response for single folder
export interface FolderDetailResponse {
  data: FolderDetail
}

// API Response for folder statistics
export interface FolderStatsResponse {
  data: {
    total: number
    active: number
    archived: number
    newThisMonth: number
    newThisWeek: number
    byStatus: Record<FolderStatus, number>
    byArea: Record<string, number>
    byNature: Record<FolderNature, number>
    recentActivity: {
      month: string
      count: number
    }[]
  }
}

// Form validation errors
export interface FolderFormErrors {
  [key: string]: string | undefined
  clientNumber?: string
  processNumber?: string
  cnjNumber?: string
  status?: string
  instance?: string
  nature?: string
  actionType?: string
  phase?: string
  organ?: string
  distribution?: string
  entryDate?: string
  area?: string
  subArea?: string
  district?: string
  court?: string
  partner?: string
  lawyer?: string
  plaintiff?: {
    name?: string
    cpf?: string
    cnpj?: string
  }
  defendant?: {
    name?: string
    cpf?: string
    cnpj?: string
  }
  caseValue?: string
  distributionDate?: string
}

// Props for form components
export interface FormFieldProps<T = string> {
  'name': string
  'label': string
  'value'?: T
  'onChange'?: (value: T) => void
  'onBlur'?: () => void
  'error'?: string
  'disabled'?: boolean
  'required'?: boolean
  'placeholder'?: string
  'hint'?: string
  'aria-label'?: string
  'aria-describedby'?: string
  'className'?: string
}

export interface SelectFieldProps extends Omit<FormFieldProps<string>, 'onChange'> {
  options: Array<{ value: string; label: string }> | string[]
  onChange?: (value: string) => void
  multiple?: boolean
}

export interface ToggleSwitchProps {
  'label': string
  'checked'?: boolean
  'onChange'?: (checked: boolean) => void
  'disabled'?: boolean
  'description'?: string
  'size'?: 'sm' | 'md' | 'lg'
  'aria-label'?: string
}

export interface DateFieldProps extends Omit<FormFieldProps<string>, 'onChange'> {
  onChange?: (date: string) => void
  format?: string
  minDate?: string
  maxDate?: string
}

// Hook return types
export interface UseFolderFormReturn {
  formData: FolderFormData
  errors: FolderFormErrors
  isValid: boolean
  isDirty: boolean
  isSubmitting: boolean
  setValue: <K extends keyof FolderFormData>(key: K, value: FolderFormData[K]) => void
  setError: (key: string, message: string) => void
  clearError: (key: string) => void
  reset: (data?: Partial<FolderFormData>) => void
  submit: () => Promise<void>
  validate: () => boolean
}
