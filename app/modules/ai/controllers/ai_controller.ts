import type { HttpContext } from '@adonisjs/core/http'
import NvidiaAiService from '../services/nvidia_ai_service.js'
import HuggingFaceService from '../services/huggingface_service.js'
import AiAnalysis from '../models/ai_analysis.js'
import {
  analyzeDocumentValidator,
  generateDocumentValidator,
  semanticSearchValidator,
} from '../validators/ai_validators.js'
import logger from '@adonisjs/core/services/logger'
import FolderDocument from '#modules/folder/models/folder_document'
import Folder from '#modules/folder/models/folder'

export default class AiController {
  private nvidiaService = new NvidiaAiService()
  private huggingFaceService = new HuggingFaceService()

  /**
   * Analyze a document using AI
   */
  async analyzeDocument({ request, response, auth }: HttpContext) {
    try {
      const { document_id, analysis_type, options } =
        await request.validateUsing(analyzeDocumentValidator)

      // Check document access
      await FolderDocument.query().where('id', document_id).firstOrFail()

      // Create analysis record
      const analysis = await this.nvidiaService.analyzeDocument(document_id, analysis_type, options)

      // Set user who requested
      analysis.user_id = auth.user!.id
      await analysis.save()

      return response.ok({
        message: 'Document analyzed successfully',
        data: analysis,
      })
    } catch (error) {
      logger.error('Document analysis failed:', error)
      return response.internalServerError({
        message: 'Failed to analyze document',
        error: error.message,
      })
    }
  }

  /**
   * Generate a legal document
   */
  async generateDocument({ request, response, auth }: HttpContext) {
    try {
      const { template_type, variables, options } =
        await request.validateUsing(generateDocumentValidator)

      const content = await this.nvidiaService.generateDocument(template_type, variables, options)

      // Save generated document
      const analysis = await AiAnalysis.create({
        user_id: auth.user!.id,
        analysis_type: 'legal_review',
        model: options?.model || 'meta/llama-3.1-70b-instruct',
        status: 'completed',
        result: {
          template_type,
          generated_content: content,
          variables,
        },
      })

      return response.ok({
        message: 'Document generated successfully',
        data: {
          content,
          analysis_id: analysis.id,
        },
      })
    } catch (error) {
      logger.error('Document generation failed:', error)
      return response.internalServerError({
        message: 'Failed to generate document',
        error: error.message,
      })
    }
  }

  /**
   * Perform semantic search
   */
  async semanticSearch({ request, response, auth }: HttpContext) {
    try {
      const { query, folder_id, limit } = await request.validateUsing(semanticSearchValidator)

      // Get documents from folder
      const documents = await FolderDocument.query()
        .where('folder_id', folder_id || 0)
        .select('id', 'description')

      // Prepare documents for search
      const searchDocs = documents.map((doc) => ({
        id: doc.id,
        content: doc.description || '',
        metadata: { id: doc.id },
      }))

      // Perform semantic search
      const results = await this.huggingFaceService.semanticSearch(query, searchDocs, limit || 5)

      return response.ok({
        message: 'Search completed successfully',
        data: results,
      })
    } catch (error) {
      logger.error('Semantic search failed:', error)
      return response.internalServerError({
        message: 'Search failed',
        error: error.message,
      })
    }
  }

  /**
   * Extract entities from text
   */
  async extractEntities({ request, response, auth }: HttpContext) {
    try {
      const { text, document_id } = request.body()

      let entities

      if (document_id) {
        const document = await FolderDocument.findOrFail(document_id)
        entities = await this.nvidiaService.extractEntities(document.description || '')
      } else if (text) {
        entities = await this.nvidiaService.extractEntities(text)
      } else {
        return response.badRequest({
          message: 'Either text or document_id is required',
        })
      }

      return response.ok({
        message: 'Entities extracted successfully',
        data: entities,
      })
    } catch (error) {
      logger.error('Entity extraction failed:', error)
      return response.internalServerError({
        message: 'Failed to extract entities',
        error: error.message,
      })
    }
  }

  /**
   * Classify document type
   */
  async classifyDocument({ request, response }: HttpContext) {
    try {
      const { text, document_id } = request.body()

      let classification

      if (document_id) {
        const document = await FolderDocument.findOrFail(document_id)
        classification = await this.huggingFaceService.classifyDocument(
          document.description || document.title
        )
      } else if (text) {
        classification = await this.huggingFaceService.classifyDocument(text)
      } else {
        return response.badRequest({
          message: 'Either text or document_id is required',
        })
      }

      return response.ok({
        message: 'Document classified successfully',
        data: classification,
      })
    } catch (error) {
      logger.error('Document classification failed:', error)
      return response.internalServerError({
        message: 'Failed to classify document',
        error: error.message,
      })
    }
  }

  /**
   * Get AI analysis history
   */
  async getAnalysisHistory({ request, response, auth }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 20)
      const type = request.input('type')
      const status = request.input('status')

      const query = AiAnalysis.query()
        .where('user_id', auth.user!.id)
        .preload('document')
        .preload('folder')
        .orderBy('created_at', 'desc')

      if (type) {
        query.where('analysis_type', type)
      }

      if (status) {
        query.where('status', status)
      }

      const analyses = await query.paginate(page, limit)

      return response.ok(analyses)
    } catch (error) {
      logger.error('Failed to fetch analysis history:', error)
      return response.internalServerError({
        message: 'Failed to fetch history',
        error: error.message,
      })
    }
  }

  /**
   * Get AI usage statistics
   */
  async getUsageStats({ response, auth }: HttpContext) {
    try {
      const userId = auth.user!.id

      // Get usage stats from last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const stats = await AiAnalysis.query()
        .where('user_id', userId)
        .where('created_at', '>=', thirtyDaysAgo)
        .select('analysis_type')
        .count('* as count')
        .sum('tokens_used as total_tokens')
        .groupBy('analysis_type')

      const totalAnalyses = await AiAnalysis.query()
        .where('user_id', userId)
        .where('created_at', '>=', thirtyDaysAgo)
        .count('* as total')

      return response.ok({
        message: 'Usage statistics retrieved',
        data: {
          period: '30_days',
          total_analyses: totalAnalyses[0].$extras.total,
          by_type: stats,
          tokens_used: stats.reduce((acc, curr) => acc + (curr.$extras.total_tokens || 0), 0),
        },
      })
    } catch (error) {
      logger.error('Failed to fetch usage stats:', error)
      return response.internalServerError({
        message: 'Failed to fetch statistics',
        error: error.message,
      })
    }
  }

  /**
   * Analyze precatorio with AI
   */
  async analyzePrecatorio({ request, response, auth }: HttpContext) {
    try {
      const { folder_id } = request.body()

      const folder = await Folder.query()
        .where('id', folder_id)
        .whereJsonSuperset('metadata', { type: 'precatorio' })
        .firstOrFail()

      const analysis = await this.nvidiaService.analyzePrecatorio(folder.metadata)

      // Save analysis
      await AiAnalysis.create({
        folder_id,
        user_id: auth.user!.id,
        analysis_type: 'legal_review',
        model: 'meta/llama-3.1-70b-instruct',
        status: 'completed',
        result: analysis,
      })

      return response.ok({
        message: 'Precatorio analyzed successfully',
        data: analysis,
      })
    } catch (error) {
      logger.error('Precatorio analysis failed:', error)
      return response.internalServerError({
        message: 'Failed to analyze precatorio',
        error: error.message,
      })
    }
  }
}
