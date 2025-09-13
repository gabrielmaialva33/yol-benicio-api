import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// AI API routes
router
  .group(() => {
    // Document analysis
    router
      .post('/ai/analyze-document', [() => import('../controllers/ai_controller.js'), 'analyzeDocument'])
      .as('api.ai.analyze_document')

    // Document generation
    router
      .post('/ai/generate-document', [() => import('../controllers/ai_controller.js'), 'generateDocument'])
      .as('api.ai.generate_document')

    // Semantic search
    router
      .post('/ai/semantic-search', [() => import('../controllers/ai_controller.js'), 'semanticSearch'])
      .as('api.ai.semantic_search')

    // Entity extraction
    router
      .post('/ai/extract-entities', [() => import('../controllers/ai_controller.js'), 'extractEntities'])
      .as('api.ai.extract_entities')

    // Document classification
    router
      .post('/ai/classify-document', [() => import('../controllers/ai_controller.js'), 'classifyDocument'])
      .as('api.ai.classify_document')

    // Precatorio analysis
    router
      .post('/ai/analyze-precatorio', [() => import('../controllers/ai_controller.js'), 'analyzePrecatorio'])
      .as('api.ai.analyze_precatorio')

    // Analysis history
    router
      .get('/ai/history', [() => import('../controllers/ai_controller.js'), 'getAnalysisHistory'])
      .as('api.ai.history')

    // Usage statistics
    router
      .get('/ai/usage-stats', [() => import('../controllers/ai_controller.js'), 'getUsageStats'])
      .as('api.ai.usage_stats')
  })
  .prefix('/api/v1')
  .use(middleware.auth())