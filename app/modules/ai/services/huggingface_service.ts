import { HfInference } from '@huggingface/inference'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import redis from '@adonisjs/redis/services/main'

interface EmbeddingResult {
  embeddings: number[]
  model: string
  dimensions: number
}

interface SemanticSearchResult {
  id: number
  content: string
  similarity: number
  metadata?: Record<string, any>
}

export default class HuggingFaceService {
  private hf: HfInference
  private readonly embeddingModel = 'sentence-transformers/all-MiniLM-L6-v2'
  private readonly bertimbauModel = 'neuralmind/bert-base-portuguese-cased'
  private readonly ocrModel = 'microsoft/trocr-base-handwritten'

  constructor() {
    const token = env.get('HF_TOKEN', '')
    this.hf = new HfInference(token)

    if (!token) {
      logger.warn('Hugging Face token not configured')
    }
  }

  /**
   * Generate embeddings for semantic search
   */
  async generateEmbeddings(text: string): Promise<EmbeddingResult> {
    try {
      const cacheKey = `embeddings:${Buffer.from(text).toString('base64').substring(0, 50)}`
      const cached = await redis.get(cacheKey)

      if (cached) {
        return JSON.parse(cached)
      }

      const response = await this.hf.featureExtraction({
        model: this.embeddingModel,
        inputs: text,
      })

      const embeddings = Array.isArray(response) ? response.flat().filter((x): x is number => typeof x === 'number') : Array.from(response as any).filter((x): x is number => typeof x === 'number')

      const result: EmbeddingResult = {
        embeddings,
        model: this.embeddingModel,
        dimensions: embeddings.length,
      }

      // Cache for 24 hours
      await redis.setex(cacheKey, 86400, JSON.stringify(result))

      return result
    } catch (error) {
      logger.error('Failed to generate embeddings:', error)
      throw error
    }
  }

  /**
   * Semantic search in documents
   */
  async semanticSearch(
    query: string,
    documents: Array<{ id: number; content: string; metadata?: any }>,
    topK: number = 5
  ): Promise<SemanticSearchResult[]> {
    try {
      // Generate query embedding
      const queryEmbedding = await this.generateEmbeddings(query)

      // Generate embeddings for all documents (with caching)
      const documentEmbeddings = await Promise.all(
        documents.map((doc) => this.generateEmbeddings(doc.content))
      )

      // Calculate cosine similarity
      const similarities = documentEmbeddings.map((docEmb, index) => ({
        ...documents[index],
        similarity: this.cosineSimilarity(queryEmbedding.embeddings, docEmb.embeddings),
      }))

      // Sort by similarity and return top K
      return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, topK)
    } catch (error) {
      logger.error('Semantic search failed:', error)
      throw error
    }
  }

  /**
   * Portuguese NLP analysis using BERTimbau
   */
  async analyzePortugueseText(text: string, task: 'ner' | 'classification' | 'qa' = 'ner'): Promise<any> {
    try {
      switch (task) {
        case 'ner':
          return await this.hf.tokenClassification({
            model: this.bertimbauModel,
            inputs: text,
          })

        case 'classification':
          return await this.hf.textClassification({
            model: 'cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual',
            inputs: text,
          })

        case 'qa':
          return await this.hf.questionAnswering({
            model: 'pierreguillou/bert-base-cased-squad-v1.1-portuguese',
            inputs: {
              question: 'Qual é o valor da causa?',
              context: text,
            },
          })

        default:
          throw new Error(`Unknown task: ${task}`)
      }
    } catch (error) {
      logger.error('Portuguese text analysis failed:', error)
      throw error
    }
  }

  /**
   * OCR for scanned documents
   */
  async performOCR(imageBase64: string): Promise<string> {
    try {
      const response = await this.hf.imageToText({
        model: this.ocrModel,
        data: Buffer.from(imageBase64, 'base64') as any,
      })

      return (response as any).generated_text || ''
    } catch (error) {
      logger.error('OCR processing failed:', error)
      throw error
    }
  }

  /**
   * Summarize legal text in Portuguese
   */
  async summarizeText(text: string, maxLength: number = 500): Promise<string> {
    try {
      const response = await this.hf.summarization({
        model: 'facebook/bart-large-cnn',
        inputs: text,
        parameters: {
          max_length: maxLength,
          min_length: 50,
        },
      })

      return response.summary_text
    } catch (error) {
      logger.error('Text summarization failed:', error)
      throw error
    }
  }

  /**
   * Classify legal document type
   */
  async classifyDocument(text: string): Promise<{
    type: string
    confidence: number
  }> {
    try {
      const labels = [
        'petição inicial',
        'contestação',
        'recurso',
        'sentença',
        'acórdão',
        'contrato',
        'procuração',
        'notificação',
        'parecer',
        'despacho',
      ]

      const response = await this.hf.zeroShotClassification({
        model: 'facebook/bart-large-mnli',
        inputs: text,
        parameters: {
          candidate_labels: labels,
        },
      })

      return {
        type: (response as any).labels?.[0] || 'unknown',
        confidence: (response as any).scores?.[0] || 0,
      }
    } catch (error) {
      logger.error('Document classification failed:', error)
      throw error
    }
  }

  /**
   * Find similar legal precedents
   */
  async findSimilarPrecedents(
    caseDescription: string,
    precedents: Array<{ id: number; summary: string; court: string; date: string }>
  ): Promise<Array<{ precedent: any; similarity: number }>> {
    try {
      // Generate embeddings for case and precedents
      const caseEmbedding = await this.generateEmbeddings(caseDescription)

      const results = await Promise.all(
        precedents.map(async (precedent) => {
          const precedentEmbedding = await this.generateEmbeddings(precedent.summary)
          const similarity = this.cosineSimilarity(
            caseEmbedding.embeddings,
            precedentEmbedding.embeddings
          )

          return { precedent, similarity }
        })
      )

      // Return sorted by similarity
      return results.sort((a, b) => b.similarity - a.similarity)
    } catch (error) {
      logger.error('Failed to find similar precedents:', error)
      throw error
    }
  }

  /**
   * Extract key phrases from legal text
   */
  async extractKeyPhrases(text: string): Promise<string[]> {
    try {
      // Using a multilingual model for key phrase extraction
      const response = await this.hf.textGeneration({
        model: 'google/flan-t5-base',
        inputs: `Extract key legal terms and phrases from this text in Portuguese: ${text}`,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.3,
        },
      })

      // Parse the response to extract phrases
      const phrases = response.generated_text
        .split(',')
        .map((phrase) => phrase.trim())
        .filter((phrase) => phrase.length > 0)

      return phrases
    } catch (error) {
      logger.error('Key phrase extraction failed:', error)
      throw error
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) {
      throw new Error('Vectors must have the same length')
    }

    let dotProduct = 0
    let norm1 = 0
    let norm2 = 0

    for (const [i, v1] of vec1.entries()) {
      dotProduct += v1 * vec2[i]
      norm1 += v1 * v1
      const v2 = vec2[i]
      norm2 += v2 * v2
    }

    norm1 = Math.sqrt(norm1)
    norm2 = Math.sqrt(norm2)

    if (norm1 === 0 || norm2 === 0) {
      return 0
    }

    return dotProduct / (norm1 * norm2)
  }

  /**
   * Batch process multiple texts for embeddings
   */
  async batchGenerateEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
    try {
      // Process in batches of 10 to avoid rate limits
      const batchSize = 10
      const results: EmbeddingResult[] = []

      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize)
        const batchResults = await Promise.all(batch.map((text) => this.generateEmbeddings(text)))
        results.push(...batchResults)
      }

      return results
    } catch (error) {
      logger.error('Batch embedding generation failed:', error)
      throw error
    }
  }
}
