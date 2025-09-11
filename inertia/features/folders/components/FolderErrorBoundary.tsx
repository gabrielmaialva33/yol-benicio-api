import { ErrorBoundary } from '~/shared/components/ErrorBoundary'
import { AlertCircle, Folder } from 'lucide-react'
import type { ReactNode } from 'react'
import { router } from '@inertiajs/react'

interface FolderErrorBoundaryProps {
  children: ReactNode
  folderId?: string
  context?: 'list' | 'detail' | 'form'
}

/**
 * Error Boundary específico para a feature de pastas
 */
export function FolderErrorBoundary({
  children,
  folderId,
  context = 'list',
}: FolderErrorBoundaryProps) {
  const getContextLevel = () => {
    switch (context) {
      case 'form':
        return 'component' as const
      case 'detail':
        return 'section' as const
      default:
        return 'page' as const
    }
  }

  const getContextMessage = () => {
    switch (context) {
      case 'form':
        return 'Erro ao processar o formulário'
      case 'detail':
        return `Não foi possível carregar os detalhes ${
          folderId ? `da pasta ${folderId}` : 'desta pasta'
        }`
      default:
        return 'Erro ao carregar as pastas'
    }
  }

  const getActionMessage = () => {
    switch (context) {
      case 'form':
        return 'Verifique os dados e tente novamente'
      case 'detail':
        return 'A pasta pode ter sido movida ou excluída'
      default:
        return 'Não foi possível carregar a lista de pastas'
    }
  }

  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className="flex items-center justify-center min-h-[400px] bg-white rounded-lg shadow-sm">
          <div className="max-w-md w-full p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mb-4">
              <Folder className="w-7 h-7 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{getContextMessage()}</h2>
            <p className="text-gray-600 mb-6">{getActionMessage()}</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={reset}
                type="button"
              >
                Tentar novamente
              </button>
              {context === 'detail' && (
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={() => router.visit('/folders/consultation')}
                  type="button"
                >
                  Voltar para lista
                </button>
              )}
            </div>

            {error.message.includes('404') && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-yellow-800">Pasta não encontrada</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Esta pasta pode ter sido arquivada ou excluída.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {import.meta.env.DEV && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Detalhes do erro
                </summary>
                <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto">
                  {error.stack || error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      )}
      level={getContextLevel()}
      onError={(_error, _errorInfo) => {
        // Error logging handled by parent ErrorBoundary component
      }}
      resetKeys={[folderId || '', context]}
      resetOnPropsChange={true}
    >
      {children}
    </ErrorBoundary>
  )
}
