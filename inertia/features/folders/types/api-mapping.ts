// API mapping between backend AdonisJS and frontend types
import type { FolderDetail, FolderFormData, FolderSummary } from './index'

// Backend folder model structure (from AdonisJS)
export interface BackendFolder {
  id: number
  title: string
  description?: string
  status: string
  area: string
  sub_area?: string
  process_number?: string
  cnj_number?: string
  instance?: string
  nature?: string
  action_type?: string
  phase?: string
  electronic: boolean
  client_id: number
  responsible_lawyer_id: number
  client_code?: string
  folder_code?: string
  default_billing_case: boolean

  // Court information
  organ?: string
  distribution?: string
  entry_date?: string
  internal_code?: string
  search_type?: string
  code?: string
  judge?: string

  // Location
  core?: string
  district?: string
  court?: string
  court_division?: string

  // Values
  case_value?: number
  conviction_value?: number
  costs?: number
  fees?: number

  // Dates
  distribution_date?: string
  citation_date?: string
  next_hearing?: string

  // Detailed information
  observation?: string
  object_detail?: string
  last_movement?: string

  // Parties (JSON fields)
  plaintiff?: {
    name: string
    cpf?: string
    cnpj?: string
  }
  defendant?: {
    name: string
    cpf?: string
    cnpj?: string
  }

  // Metadata
  metadata?: Record<string, any>
  favorite: boolean

  // Timestamps
  created_at: string
  updated_at: string

  // Relations
  client?: {
    id: number
    name: string
    document: string
    email?: string
    phone?: string
  }
  responsibleLawyer?: {
    id: number
    name: string
    email: string
    avatar?: string
  }
  documents?: Array<{
    id: number
    name: string
    type: string
    size: number
    mime_type: string
    url: string
    created_at: string
  }>
  movements?: Array<{
    id: number
    date: string
    description: string
    responsible: string
    type?: string
    internal: boolean
    created_at: string
  }>
}

// Map backend folder to frontend FolderDetail
export const mapBackendToFolderDetail = (backendFolder: BackendFolder): FolderDetail => {
  const createdAt = new Date(backendFolder.created_at)

  return {
    // Identification
    id: backendFolder.id.toString(),
    clientNumber: backendFolder.client?.document || '',
    status: mapBackendStatus(backendFolder.status),
    date: createdAt.toLocaleDateString('pt-BR'),
    time: createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),

    // Process Information
    processNumber: backendFolder.process_number || '',
    cnjNumber: backendFolder.cnj_number || '',
    instance: mapBackendInstance(backendFolder.instance),
    nature: mapBackendNature(backendFolder.nature),
    actionType: backendFolder.action_type || '',
    phase: mapBackendPhase(backendFolder.phase),
    electronic: backendFolder.electronic,
    clientCode: backendFolder.client_code || '',
    folder: backendFolder.folder_code || backendFolder.title,
    defaultBillingCase: backendFolder.default_billing_case,
    totus: backendFolder.metadata?.totus || false,
    migrated: backendFolder.metadata?.migrated || false,

    // Court Information
    organ: backendFolder.organ || '',
    distribution: mapBackendDistribution(backendFolder.distribution),
    entryDate: backendFolder.entry_date || '',
    internalCode: backendFolder.internal_code || '',
    searchType: backendFolder.search_type || '',
    code: backendFolder.code || '',
    judge: backendFolder.judge || '',

    // Location and Responsibles
    area: backendFolder.area,
    subArea: backendFolder.sub_area || '',
    core: backendFolder.core || '',
    district: backendFolder.district || '',
    court: backendFolder.court || '',
    courtDivision: backendFolder.court_division || '',
    partner: backendFolder.metadata?.partner || '',
    coordinator: backendFolder.metadata?.coordinator || '',
    lawyer: backendFolder.responsibleLawyer?.name || '',

    // Parties
    plaintiff: {
      name: backendFolder.plaintiff?.name || '',
      cpf: backendFolder.plaintiff?.cpf,
      cnpj: backendFolder.plaintiff?.cnpj,
      type: 'Autor',
    },
    defendant: {
      name: backendFolder.defendant?.name || '',
      cpf: backendFolder.defendant?.cpf,
      cnpj: backendFolder.defendant?.cnpj,
      type: 'Réu',
    },

    // Detailed Information
    observation: backendFolder.observation || '',
    objectDetail: backendFolder.object_detail || '',
    lastMovement: backendFolder.last_movement || '',

    // Values
    caseValue: backendFolder.case_value || 0,
    convictionValue: backendFolder.conviction_value,
    costs: backendFolder.costs,
    fees: backendFolder.fees,

    // Important Dates
    distributionDate: backendFolder.distribution_date || '',
    citationDate: backendFolder.citation_date,
    nextHearing: backendFolder.next_hearing,

    // Responsible
    responsible: {
      id: backendFolder.responsibleLawyer?.id.toString() || '',
      name: backendFolder.responsibleLawyer?.name || '',
      email: backendFolder.responsibleLawyer?.email || '',
      avatar: backendFolder.responsibleLawyer?.avatar,
      position: 'Advogado',
    },

    // Documents
    documents: (backendFolder.documents || []).map((doc) => ({
      id: doc.id.toString(),
      name: doc.name,
      type: mapDocumentType(doc.type),
      uploadDate: new Date(doc.created_at).toLocaleDateString('pt-BR'),
      size: formatFileSize(doc.size),
      url: doc.url,
      mimeType: doc.mime_type,
    })),

    // Movements
    movements: (backendFolder.movements || []).map((mov) => ({
      id: mov.id.toString(),
      date: new Date(mov.date).toLocaleDateString('pt-BR'),
      description: mov.description,
      responsible: mov.responsible,
      type: mov.type,
      internal: mov.internal,
    })),

    // Metadata
    favorite: backendFolder.favorite,
    createdAt: backendFolder.created_at,
    updatedAt: backendFolder.updated_at,
  }
}

// Map frontend FolderFormData to backend format
export const mapFrontendToBackend = (formData: FolderFormData): Partial<BackendFolder> => {
  return {
    title: formData.folder,
    description: formData.observation,
    status: mapFrontendStatus(formData.status),
    area: formData.area,
    sub_area: formData.subArea,
    process_number: formData.processNumber,
    cnj_number: formData.cnjNumber,
    instance: mapFrontendInstance(formData.instance),
    nature: mapFrontendNature(formData.nature),
    action_type: formData.actionType,
    phase: mapFrontendPhase(formData.phase),
    electronic: formData.electronic,
    client_code: formData.clientCode,
    folder_code: formData.folder,
    default_billing_case: formData.defaultBillingCase,

    // Court information
    organ: formData.organ,
    distribution: mapFrontendDistribution(formData.distribution),
    entry_date: formData.entryDate,
    internal_code: formData.internalCode,
    search_type: formData.searchType,
    code: formData.code,
    judge: formData.judge,

    // Location
    core: formData.core,
    district: formData.district,
    court: formData.court,
    court_division: formData.courtDivision,

    // Values
    case_value: formData.caseValue,
    conviction_value: formData.convictionValue,
    costs: formData.costs,
    fees: formData.fees,

    // Dates
    distribution_date: formData.distributionDate,
    citation_date: formData.citationDate,
    next_hearing: formData.nextHearing,

    // Detailed information
    observation: formData.observation,
    object_detail: formData.objectDetail,

    // Parties
    plaintiff: {
      name: formData.plaintiff.name,
      cpf: formData.plaintiff.cpf,
      cnpj: formData.plaintiff.cnpj,
    },
    defendant: {
      name: formData.defendant.name,
      cpf: formData.defendant.cpf,
      cnpj: formData.defendant.cnpj,
    },

    // Metadata
    metadata: {
      partner: formData.partner,
      coordinator: formData.coordinator,
    },
  }
}

// Status mapping functions
const mapBackendStatus = (status: string): FolderDetail['status'] => {
  const statusMap: Record<string, FolderDetail['status']> = {
    active: 'Ativo',
    archived: 'Arquivado',
    suspended: 'Suspenso',
    closed: 'Encerrado',
  }
  return statusMap[status] || 'Ativo'
}

const mapFrontendStatus = (status: FolderDetail['status']): string => {
  const statusMap: Record<FolderDetail['status'], string> = {
    Ativo: 'active',
    Arquivado: 'archived',
    Suspenso: 'suspended',
    Encerrado: 'closed',
  }
  return statusMap[status] || 'active'
}

// Instance mapping
const mapBackendInstance = (instance?: string): FolderDetail['instance'] => {
  const instanceMap: Record<string, FolderDetail['instance']> = {
    first: 'Primeira Instância',
    second: 'Segunda Instância',
    superior: 'Tribunais Superiores',
  }
  return instanceMap[instance || ''] || 'Primeira Instância'
}

const mapFrontendInstance = (instance: FolderDetail['instance']): string => {
  const instanceMap: Record<FolderDetail['instance'], string> = {
    'Primeira Instância': 'first',
    'Segunda Instância': 'second',
    'Tribunais Superiores': 'superior',
  }
  return instanceMap[instance] || 'first'
}

// Nature mapping
const mapBackendNature = (nature?: string): FolderDetail['nature'] => {
  const natureMap: Record<string, FolderDetail['nature']> = {
    civil: 'Cível',
    criminal: 'Criminal',
    labor: 'Trabalhista',
    tax: 'Tributário',
    administrative: 'Administrativo',
  }
  return natureMap[nature || ''] || 'Cível'
}

const mapFrontendNature = (nature: FolderDetail['nature']): string => {
  const natureMap: Record<FolderDetail['nature'], string> = {
    Cível: 'civil',
    Criminal: 'criminal',
    Trabalhista: 'labor',
    Tributário: 'tax',
    Administrativo: 'administrative',
  }
  return natureMap[nature] || 'civil'
}

// Phase mapping
const mapBackendPhase = (phase?: string): FolderDetail['phase'] => {
  const phaseMap: Record<string, FolderDetail['phase']> = {
    knowledge: 'Conhecimento',
    execution: 'Execução',
    appeal: 'Recurso',
    compliance: 'Cumprimento de Sentença',
  }
  return phaseMap[phase || ''] || 'Conhecimento'
}

const mapFrontendPhase = (phase: FolderDetail['phase']): string => {
  const phaseMap: Record<FolderDetail['phase'], string> = {
    'Conhecimento': 'knowledge',
    'Execução': 'execution',
    'Recurso': 'appeal',
    'Cumprimento de Sentença': 'compliance',
  }
  return phaseMap[phase] || 'knowledge'
}

// Distribution mapping
const mapBackendDistribution = (distribution?: string): FolderDetail['distribution'] => {
  const distributionMap: Record<string, FolderDetail['distribution']> = {
    random: 'Sorteio',
    dependency: 'Dependência',
    prevention: 'Prevenção',
  }
  return distributionMap[distribution || ''] || 'Sorteio'
}

const mapFrontendDistribution = (distribution: FolderDetail['distribution']): string => {
  const distributionMap: Record<FolderDetail['distribution'], string> = {
    Sorteio: 'random',
    Dependência: 'dependency',
    Prevenção: 'prevention',
  }
  return distributionMap[distribution] || 'random'
}

// Document type mapping
const mapDocumentType = (type: string): FolderDetail['documents'][0]['type'] => {
  const typeMap: Record<string, FolderDetail['documents'][0]['type']> = {
    petition: 'Petição',
    contract: 'Contrato',
    proxy: 'Procuração',
    decision: 'Decisão',
    sentence: 'Sentença',
    other: 'Outros',
  }
  return typeMap[type] || 'Outros'
}

// File size formatter
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Map backend folder list to frontend FolderSummary
export const mapBackendToFolderSummary = (backendFolder: BackendFolder): FolderSummary => {
  const createdAt = new Date(backendFolder.created_at)

  return {
    id: backendFolder.id.toString(),
    favorite: backendFolder.favorite,
    clientNumber: backendFolder.client?.document || '',
    responsible: {
      id: backendFolder.responsibleLawyer?.id.toString() || '',
      name: backendFolder.responsibleLawyer?.name || '',
      email: backendFolder.responsibleLawyer?.email || '',
      avatar: backendFolder.responsibleLawyer?.avatar,
      position: 'Advogado',
    },
    inclusionDate: createdAt.toLocaleDateString('pt-BR'),
    inclusionTime: createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    docs: backendFolder.documents?.length || 0,
    area: backendFolder.area,
    status: mapBackendStatus(backendFolder.status),
    processNumber: backendFolder.process_number,
    lawyer: backendFolder.responsibleLawyer?.name,
    lastMovement: backendFolder.last_movement,
  }
}
