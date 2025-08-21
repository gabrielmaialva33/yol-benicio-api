import { z } from 'zod'
import type { FolderFormData } from './index'

// CPF validation regex
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
// CNPJ validation regex
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
// Process number regex (CNJ format)
const processNumberRegex = /^\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}$/
// CNJ number regex
const cnjNumberRegex = /^\d{20}$/

// Date validation helper
const dateString = z.string().refine(
  (date) => {
    const parsed = new Date(date)
    return !isNaN(parsed.getTime())
  },
  { message: 'Data inválida' }
)

// Party schema for plaintiff/defendant
const partySchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(255, 'Nome muito longo'),
    cpf: z
      .string()
      .optional()
      .refine((cpf) => !cpf || cpfRegex.test(cpf), {
        message: 'CPF inválido. Use o formato 000.000.000-00',
      }),
    cnpj: z
      .string()
      .optional()
      .refine((cnpj) => !cnpj || cnpjRegex.test(cnpj), {
        message: 'CNPJ inválido. Use o formato 00.000.000/0000-00',
      }),
    type: z.enum(['Autor', 'Réu', 'Terceiro']),
  })
  .refine((data) => data.cpf || data.cnpj, {
    message: 'Informe CPF ou CNPJ',
    path: ['cpf'],
  })

// Main folder validation schema
export const folderSchema = z
  .object({
    // Basic Information
    clientNumber: z
      .string()
      .min(1, 'Número do cliente é obrigatório')
      .max(50, 'Número muito longo'),

    status: z.enum(['Ativo', 'Arquivado', 'Suspenso', 'Encerrado'], {
      errorMap: () => ({ message: 'Status inválido' }),
    }),

    // Process Information
    processNumber: z
      .string()
      .min(1, 'Número do processo é obrigatório')
      .refine((num) => processNumberRegex.test(num), {
        message: 'Formato inválido. Use: 0000000-00.0000.0.00.0000',
      }),

    cnjNumber: z
      .string()
      .optional()
      .refine((num) => !num || cnjNumberRegex.test(num), {
        message: 'Número CNJ deve ter 20 dígitos',
      }),

    instance: z.enum(['Primeira Instância', 'Segunda Instância', 'Tribunais Superiores'], {
      errorMap: () => ({ message: 'Instância inválida' }),
    }),

    nature: z.enum(['Cível', 'Criminal', 'Trabalhista', 'Tributário', 'Administrativo'], {
      errorMap: () => ({ message: 'Natureza inválida' }),
    }),

    actionType: z
      .string()
      .min(1, 'Tipo de ação é obrigatório')
      .max(100, 'Tipo de ação muito longo'),

    phase: z.enum(['Conhecimento', 'Execução', 'Recurso', 'Cumprimento de Sentença'], {
      errorMap: () => ({ message: 'Fase inválida' }),
    }),

    electronic: z.boolean(),

    clientCode: z.string().min(1, 'Código do cliente é obrigatório').max(50, 'Código muito longo'),

    folder: z.string().min(1, 'Pasta é obrigatória').max(100, 'Nome da pasta muito longo'),

    defaultBillingCase: z.boolean(),

    // Court Information
    organ: z.string().min(1, 'Órgão é obrigatório').max(255, 'Nome do órgão muito longo'),

    distribution: z.enum(['Sorteio', 'Dependência', 'Prevenção'], {
      errorMap: () => ({ message: 'Tipo de distribuição inválido' }),
    }),

    entryDate: dateString,

    internalCode: z.string().max(50, 'Código interno muito longo').optional(),

    searchType: z.string().max(100, 'Tipo de busca muito longo').optional(),

    code: z.string().max(50, 'Código muito longo').optional(),

    judge: z.string().max(255, 'Nome do juiz muito longo').optional(),

    // Location and Responsibles
    area: z.string().min(1, 'Área é obrigatória').max(100, 'Nome da área muito longo'),

    subArea: z.string().min(1, 'Subárea é obrigatória').max(100, 'Nome da subárea muito longo'),

    core: z.string().max(100, 'Núcleo muito longo').optional(),

    district: z.string().min(1, 'Comarca é obrigatória').max(100, 'Nome da comarca muito longo'),

    court: z.string().min(1, 'Tribunal é obrigatório').max(255, 'Nome do tribunal muito longo'),

    courtDivision: z.string().max(100, 'Vara muito longa').optional(),

    partner: z.string().min(1, 'Sócio responsável é obrigatório').max(255, 'Nome muito longo'),

    coordinator: z.string().max(255, 'Nome do coordenador muito longo').optional(),

    lawyer: z.string().min(1, 'Advogado responsável é obrigatório').max(255, 'Nome muito longo'),

    // Parties
    plaintiff: partySchema.extend({
      type: z.literal('Autor'),
    }),

    defendant: partySchema.extend({
      type: z.literal('Réu'),
    }),

    // Detailed Information
    observation: z.string().max(1000, 'Observação muito longa').optional(),

    objectDetail: z.string().max(1000, 'Detalhe do objeto muito longo').optional(),

    // Values
    caseValue: z.number().min(0, 'Valor deve ser positivo').max(999999999.99, 'Valor muito alto'),

    convictionValue: z
      .number()
      .min(0, 'Valor deve ser positivo')
      .max(999999999.99, 'Valor muito alto')
      .optional(),

    costs: z
      .number()
      .min(0, 'Valor deve ser positivo')
      .max(999999999.99, 'Valor muito alto')
      .optional(),

    fees: z
      .number()
      .min(0, 'Valor deve ser positivo')
      .max(999999999.99, 'Valor muito alto')
      .optional(),

    // Important Dates
    distributionDate: dateString,

    citationDate: dateString.optional(),

    nextHearing: dateString.optional(),
  })
  .refine(
    (data) => {
      // Validate that case value is provided
      return data.caseValue > 0
    },
    {
      message: 'Valor da causa deve ser maior que zero',
      path: ['caseValue'],
    }
  )
  .refine(
    (data) => {
      // Validate distribution date is not in the future
      const distributionDate = new Date(data.distributionDate)
      const today = new Date()
      today.setHours(23, 59, 59, 999) // End of today
      return distributionDate <= today
    },
    {
      message: 'Data de distribuição não pode ser futura',
      path: ['distributionDate'],
    }
  )
  .refine(
    (data) => {
      // If citation date is provided, it should be after distribution date
      if (!data.citationDate) return true
      const distributionDate = new Date(data.distributionDate)
      const citationDate = new Date(data.citationDate)
      return citationDate >= distributionDate
    },
    {
      message: 'Data de citação deve ser posterior à data de distribuição',
      path: ['citationDate'],
    }
  )
  .refine(
    (data) => {
      // If next hearing is provided, it should be in the future
      if (!data.nextHearing) return true
      const nextHearing = new Date(data.nextHearing)
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Start of today
      return nextHearing >= today
    },
    {
      message: 'Próxima audiência deve ser futura',
      path: ['nextHearing'],
    }
  )

// Partial schema for updates (all fields optional except ID)
export const folderUpdateSchema = folderSchema.partial()

// Schema for folder filters
export const folderFiltersSchema = z
  .object({
    clientNumber: z.string().optional(),
    dateRange: z
      .object({
        start: dateString,
        end: dateString,
      })
      .optional(),
    area: z.string().optional(),
    status: z.enum(['Ativo', 'Arquivado', 'Suspenso', 'Encerrado']).optional(),
    partner: z.string().optional(),
    lawyer: z.string().optional(),
    district: z.string().optional(),
    processNumber: z.string().optional(),
    favorite: z.boolean().optional(),
    search: z.string().optional(),
  })
  .refine(
    (data) => {
      // If date range is provided, start should be before or equal to end
      if (!data.dateRange) return true
      const start = new Date(data.dateRange.start)
      const end = new Date(data.dateRange.end)
      return start <= end
    },
    {
      message: 'Data inicial deve ser anterior ou igual à data final',
      path: ['dateRange'],
    }
  )

// Type inference from schemas
export type FolderSchemaType = z.infer<typeof folderSchema>
export type FolderUpdateSchemaType = z.infer<typeof folderUpdateSchema>
export type FolderFiltersSchemaType = z.infer<typeof folderFiltersSchema>

// Validation helper functions
export const validateFolder = (
  data: unknown
): { success: true; data: FolderFormData } | { success: false; errors: Record<string, string> } => {
  const result = folderSchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors: Record<string, string> = {}
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.')
    errors[path] = issue.message
  })

  return { success: false, errors }
}

export const validateFolderUpdate = (data: unknown) => {
  return folderUpdateSchema.safeParse(data)
}

export const validateFolderFilters = (data: unknown) => {
  return folderFiltersSchema.safeParse(data)
}

// Field validation functions for real-time validation
export const validateCPF = (cpf: string): boolean => {
  return cpfRegex.test(cpf)
}

export const validateCNPJ = (cnpj: string): boolean => {
  return cnpjRegex.test(cnpj)
}

export const validateProcessNumber = (processNumber: string): boolean => {
  return processNumberRegex.test(processNumber)
}

export const validateCNJNumber = (cnjNumber: string): boolean => {
  return cnjNumberRegex.test(cnjNumber)
}

// Error messages for common validations
export const VALIDATION_MESSAGES = {
  required: 'Este campo é obrigatório',
  invalidCPF: 'CPF inválido. Use o formato 000.000.000-00',
  invalidCNPJ: 'CNPJ inválido. Use o formato 00.000.000/0000-00',
  invalidProcessNumber: 'Número do processo inválido. Use o formato 0000000-00.0000.0.00.0000',
  invalidCNJNumber: 'Número CNJ deve ter exatamente 20 dígitos',
  invalidDate: 'Data inválida',
  futureDate: 'Data não pode ser futura',
  pastDate: 'Data deve ser futura',
  invalidValue: 'Valor inválido',
  negativeValue: 'Valor deve ser positivo',
  tooLong: 'Texto muito longo',
  tooShort: 'Texto muito curto',
} as const
