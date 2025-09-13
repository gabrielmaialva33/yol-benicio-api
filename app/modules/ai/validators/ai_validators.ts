import vine from '@vinejs/vine'

/**
 * Validator for document analysis
 */
export const analyzeDocumentValidator = vine.compile(
  vine.object({
    document_id: vine.number().positive(),
    analysis_type: vine.enum(['summary', 'entities', 'sentiment', 'legal_review']),
    options: vine
      .object({
        model: vine.string().optional(),
        maxTokens: vine.number().range([100, 4000]).optional(),
        temperature: vine.number().range([0, 1]).optional(),
        language: vine.enum(['pt-BR', 'en-US', 'es-ES']).optional(),
      })
      .optional(),
  })
)

/**
 * Validator for document generation
 */
export const generateDocumentValidator = vine.compile(
  vine.object({
    template_type: vine.enum(['petition', 'contract', 'notification', 'appeal', 'motion']),
    variables: vine.record(vine.any()),
    options: vine
      .object({
        model: vine.string().optional(),
        maxTokens: vine.number().range([500, 8000]).optional(),
        temperature: vine.number().range([0, 1]).optional(),
        language: vine.enum(['pt-BR', 'en-US', 'es-ES']).optional(),
      })
      .optional(),
  })
)

/**
 * Validator for semantic search
 */
export const semanticSearchValidator = vine.compile(
  vine.object({
    query: vine.string().trim().minLength(3).maxLength(500),
    folder_id: vine.number().positive().optional(),
    document_ids: vine.array(vine.number().positive()).optional(),
    limit: vine.number().range([1, 50]).optional(),
  })
)

/**
 * Validator for entity extraction
 */
export const extractEntitiesValidator = vine.compile(
  vine
    .object({
      text: vine.string().trim().minLength(10).optional(),
      document_id: vine.number().positive().optional(),
    })
    .refine((data) => {
      // Either text or document_id must be provided
      return !!(data.text || data.document_id)
    }, 'Either text or document_id must be provided')
)

/**
 * Validator for contract review
 */
export const reviewContractValidator = vine.compile(
  vine.object({
    content: vine.string().trim().minLength(100),
    contract_type: vine.string().optional(),
    focus_areas: vine
      .array(vine.enum(['risks', 'compliance', 'clarity', 'completeness', 'fairness']))
      .optional(),
  })
)

/**
 * Validator for OCR processing
 */
export const ocrValidator = vine.compile(
  vine.object({
    image_base64: vine.string(),
    save_as_document: vine.boolean().optional(),
    folder_id: vine.number().positive().optional(),
  })
)
