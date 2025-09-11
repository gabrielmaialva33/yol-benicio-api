import { ErrorBoundary } from '~/shared/components/ErrorBoundary'
import { LogIn } from 'lucide-react'
import type { ReactNode } from 'react'

interface AuthErrorBoundaryProps {
  children: ReactNode
}

/**
 * Error Boundary específico para a feature de autenticação
 */
export function AuthErrorBoundary({ children }: AuthErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className='flex min-h-screen items-center justify-center bg-[#373737]'>
          <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-xl'>
            <div className='flex flex-col items-center gap-4'>
              <div className='p-3 bg-red-100 rounded-full'>
                <LogIn className='w-8 h-8 text-red-600' />
              </div>
              <h2 className='text-xl font-bold text-gray-900'>
                Erro na Autenticação
              </h2>
              <p className='text-center text-gray-600'>
                Ocorreu um problema ao processar sua autenticação. Por favor,
                tente novamente.
              </p>
              {import.meta.env.DEV && (
                <details className='w-full mt-4'>
                  <summary className='cursor-pointer text-sm text-gray-500 hover:text-gray-700'>
                    Detalhes técnicos
                  </summary>
                  <pre className='mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto'>
                    {error.message}
                  </pre>
                </details>
              )}
              <button
                className='w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                onClick={reset}
                type='button'
              >
                Tentar novamente
              </button>
              <button
                className='text-sm text-gray-600 hover:text-gray-800'
                onClick={() => window.location.reload()}
                type='button'
              >
                Recarregar página
              </button>
            </div>
          </div>
        </div>
      )}
      level='page'
      onError={(_error, _errorInfo) => {
        // Intentionally empty - errors are handled by parent component
      }}
    >
      {children}
    </ErrorBoundary>
  )
}