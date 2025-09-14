import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import redis from '@adonisjs/redis/services/main'
import FolderDocument from '#modules/folder/models/folder_document'
import AiAnalysis from '../models/ai_analysis.js'

interface NvidiaApiResponse {
  id: string
  choices: Array<{
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

interface AnalysisOptions {
  model?: string
  maxTokens?: number
  temperature?: number
  language?: string
}

export default class NvidiaAiService {
  private readonly apiKey: string
  private readonly baseUrl = 'https://integrate.api.nvidia.com/v1'
  private readonly defaultModel = 'meta/llama-3.1-70b-instruct'

  constructor() {
    this.apiKey = env.get('NVIDIA_API_KEY', '')
    if (!this.apiKey) {
      logger.warn('NVIDIA API key not configured')
    }
  }

  /**
   * Analyze legal document using NVIDIA AI
   */
  async analyzeDocument(
    documentId: number,
    analysisType: 'summary' | 'entities' | 'sentiment' | 'legal_review' = 'summary',
    options: AnalysisOptions = {}
  ): Promise<AiAnalysis> {
    try {
      // Check cache first
      const cacheKey = `ai:analysis:${documentId}:${analysisType}`
      const cached = await redis.get(cacheKey)
      if (cached) {
        logger.info(`Using cached analysis for document ${documentId}`)
        return JSON.parse(cached)
      }

      // Fetch document
      const document = await FolderDocument.query().where('id', documentId).firstOrFail()

      // Prepare prompt based on analysis type
      const prompt = this.buildPrompt(document, analysisType, options.language || 'pt-BR')

      // Call NVIDIA API
      const response = await this.callNvidiaApi(prompt, options)

      // Parse and save analysis
      const analysis = await AiAnalysis.create({
        document_id: documentId,
        folder_id: document.folder_id,
        analysis_type: analysisType,
        model: options.model || this.defaultModel,
        result: {
          content: response.choices[0].message.content,
          tokens_used: response.usage.total_tokens,
          metadata: {
            language: options.language || 'pt-BR',
            timestamp: new Date().toISOString(),
          },
        },
      })

      // Cache result for 1 hour
      await redis.setex(cacheKey, 3600, JSON.stringify(analysis))

      logger.info(`Document ${documentId} analyzed successfully with ${analysisType}`)
      return analysis
    } catch (error) {
      logger.error('Failed to analyze document:', error)
      throw error
    }
  }

  /**
   * Generate legal document from template
   */
  async generateDocument(
    templateType: string,
    variables: Record<string, any>,
    options: AnalysisOptions = {}
  ): Promise<string> {
    const prompt = this.buildGenerationPrompt(templateType, variables)
    const response = await this.callNvidiaApi(prompt, options)
    return response.choices[0].message.content
  }

  /**
   * Review legal contract for issues
   */
  async reviewContract(
    content: string,
    options: AnalysisOptions = {}
  ): Promise<{
    issues: Array<{ type: string; severity: string; description: string; suggestion: string }>
    score: number
    summary: string
  }> {
    const prompt = `
      Você é um advogado especialista em revisão de contratos.
      Analise o seguinte contrato e identifique:
      1. Cláusulas problemáticas ou ambíguas
      2. Riscos legais potenciais
      3. Sugestões de melhoria
      4. Score de 0-100 para qualidade do contrato

      Contrato:
      ${content}

      Responda em formato JSON estruturado.
    `

    const response = await this.callNvidiaApi(prompt, options)
    return JSON.parse(response.choices[0].message.content)
  }

  /**
   * Extract entities from legal text
   */
  async extractEntities(
    text: string,
    options: AnalysisOptions = {}
  ): Promise<{
    parties: Array<{ name: string; type: string; document?: string }>
    dates: Array<{ date: string; description: string }>
    values: Array<{ amount: number; currency: string; description: string }>
    locations: string[]
    legal_terms: string[]
  }> {
    const prompt = `
      Extraia as seguintes entidades do texto jurídico:
      - Partes envolvidas (nome, tipo, CPF/CNPJ se disponível)
      - Datas importantes
      - Valores monetários
      - Locais mencionados
      - Termos jurídicos relevantes

      Texto:
      ${text}

      Responda em formato JSON estruturado.
    `

    const response = await this.callNvidiaApi(prompt, options)
    return JSON.parse(response.choices[0].message.content)
  }

  /**
   * Analyze precatorio for payment prediction
   */
  async analyzePrecatorio(
    precatorioData: Record<string, any>,
    options: AnalysisOptions = {}
  ): Promise<{
    payment_probability: number
    estimated_date: string
    risk_factors: string[]
    recommendations: string[]
  }> {
    const prompt = `
      Analise os dados do precatório e forneça:
      1. Probabilidade de pagamento (0-100%)
      2. Data estimada de pagamento
      3. Fatores de risco
      4. Recomendações

      Dados do Precatório:
      ${JSON.stringify(precatorioData, null, 2)}

      Considere: ordem cronológica, orçamento do ente, prioridades constitucionais.
      Responda em formato JSON.
    `

    const response = await this.callNvidiaApi(prompt, options)
    return JSON.parse(response.choices[0].message.content)
  }

  /**
   * Build prompt based on analysis type
   */
  private buildPrompt(document: FolderDocument, analysisType: string, language: string): string {
    const prompts = {
      summary: `
        Faça um resumo executivo do seguinte documento jurídico em ${language}.
        Destaque os pontos principais, partes envolvidas, e conclusões.
        Limite o resumo a 500 palavras.

        Documento: ${document.description || ''}
      `,
      entities: `
        Extraia todas as entidades relevantes do documento:
        - Pessoas físicas e jurídicas
        - Datas e prazos
        - Valores monetários
        - Números de processo
        - Órgãos e instituições

        Documento: ${document.description || ''}
      `,
      sentiment: `
        Analise o sentimento e tom do documento jurídico.
        Identifique se é favorável, neutro ou desfavorável ao cliente.
        Justifique sua análise.

        Documento: ${document.description || ''}
      `,
      legal_review: `
        Faça uma revisão jurídica completa do documento.
        Identifique:
        1. Conformidade legal
        2. Riscos potenciais
        3. Oportunidades
        4. Recomendações de ação

        Documento: ${document.description || ''}
      `,
    }

    return prompts[analysisType as keyof typeof prompts] || prompts.summary
  }

  /**
   * Build prompt for document generation
   */
  private buildGenerationPrompt(templateType: string, variables: Record<string, any>): string {
    const templates = {
      petition: `
        Gere uma petição inicial com base nos seguintes dados:
        ${JSON.stringify(variables, null, 2)}

        A petição deve seguir o padrão brasileiro e incluir:
        - Qualificação das partes
        - Dos fatos
        - Do direito
        - Dos pedidos
        - Valor da causa
      `,
      contract: `
        Gere um contrato de ${variables.type} com os seguintes termos:
        ${JSON.stringify(variables, null, 2)}

        Inclua cláusulas padrão de:
        - Objeto
        - Obrigações das partes
        - Pagamento
        - Prazo
        - Rescisão
        - Foro
      `,
      notification: `
        Gere uma notificação extrajudicial formal:
        ${JSON.stringify(variables, null, 2)}

        Deve ser formal e incluir:
        - Identificação do notificante
        - Exposição dos fatos
        - Fundamentação legal
        - Prazo para resposta
      `,
    }

    return templates[templateType as keyof typeof templates] || templates.petition
  }

  /**
   * Call NVIDIA API
   */
  private async callNvidiaApi(
    prompt: string,
    options: AnalysisOptions = {}
  ): Promise<NvidiaApiResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options.model || this.defaultModel,
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente jurídico especializado em direito brasileiro.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
        stream: false,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`NVIDIA API error: ${response.status} - ${error}`)
    }

    const data = (await response.json()) as NvidiaApiResponse
    return data
  }
}
