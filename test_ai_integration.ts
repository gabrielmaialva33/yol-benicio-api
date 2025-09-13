import 'reflect-metadata'
import { test } from '@japa/runner'
import NvidiaAiService from './app/modules/ai/services/nvidia_ai_service.js'
import HuggingFaceService from './app/modules/ai/services/huggingface_service.js'
import logger from '@adonisjs/core/services/logger'

/**
 * Test AI Integration
 * Run with: node ace test test_ai_integration.ts
 */

async function testNvidiaService() {
  console.log('\n🤖 Testing NVIDIA AI Service...\n')

  const service = new NvidiaAiService()

  try {
    // Test text generation
    const result = await service.generateDocument('petition', {
      cliente: 'João Silva',
      reu: 'Estado de São Paulo',
      valor_causa: 50000,
      objeto: 'Pagamento de precatório alimentar',
    })

    console.log('✅ NVIDIA Document Generation:', result.substring(0, 200) + '...')
  } catch (error) {
    console.error('❌ NVIDIA Service Error:', error.message)
  }
}

async function testHuggingFaceService() {
  console.log('\n🤗 Testing Hugging Face Service...\n')

  const service = new HuggingFaceService()

  try {
    // Test embeddings
    const embedding = await service.generateEmbeddings(
      'Contrato de prestação de serviços advocatícios'
    )
    console.log('✅ Embeddings generated:', `Vector with ${embedding.dimensions} dimensions`)

    // Test semantic search
    const documents = [
      { id: 1, content: 'Petição inicial de cobrança' },
      { id: 2, content: 'Contrato de honorários advocatícios' },
      { id: 3, content: 'Sentença de procedência' },
    ]

    const results = await service.semanticSearch('contrato advogado', documents, 2)
    console.log(
      '✅ Semantic Search Results:',
      results.map((r) => ({ id: r.id, similarity: r.similarity.toFixed(3) }))
    )

    // Test document classification
    const classification = await service.classifyDocument(
      'Por meio desta petição inicial, vem o autor requerer a condenação do réu ao pagamento...'
    )
    console.log('✅ Document Classification:', classification)
  } catch (error) {
    console.error('❌ Hugging Face Service Error:', error.message)
  }
}

async function testWebSocketIntegration() {
  console.log('\n🔌 Testing WebSocket Integration...\n')

  // Note: This would require the server to be running
  console.log('⚠️  WebSocket test requires server running. Start with: node ace serve --watch')
  console.log('    Then connect client with Socket.io client library')
}

// Run tests
async function runTests() {
  console.log('='.repeat(50))
  console.log('🚀 AI INTEGRATION TEST SUITE')
  console.log('='.repeat(50))

  await testNvidiaService()
  await testHuggingFaceService()
  await testWebSocketIntegration()

  console.log('\n' + '='.repeat(50))
  console.log('✨ Tests completed!')
  console.log('='.repeat(50))
}

// Execute
runTests().catch(console.error)
