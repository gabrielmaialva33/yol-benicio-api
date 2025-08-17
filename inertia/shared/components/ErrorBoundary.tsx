import {AlertTriangle, RefreshCw} from 'lucide-react'
import {Component, type ReactNode} from 'react'

interface ErrorBoundaryState {
	hasError: boolean
	error: Error | null
}

interface ErrorBoundaryProps {
	children: ReactNode
	fallback?: (error: Error, reset: () => void) => ReactNode
	onError?: (error: Error, errorInfo: React.ErrorInfo) => void
	resetKeys?: Array<string | number>
	resetOnPropsChange?: boolean
	isolate?: boolean
	level?: 'page' | 'section' | 'component'
	showDetails?: boolean
}

/**
 * Error Boundary reutilizável com diferentes níveis de granularidade
 */
const AUTO_RESET_TIMEOUT = 10_000

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	private resetTimeoutId: number | null = null
	private previousResetKeys: Array<string | number> = []

	constructor(props: ErrorBoundaryProps) {
		super(props)
		this.state = {hasError: false, error: null}
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return {hasError: true, error}
	}

	componentDidUpdate(_prevProps: ErrorBoundaryProps) {
		const {resetKeys = [], resetOnPropsChange = true} = this.props
		const hasResetKeysChanged = resetKeys.some(
			(key, index) => key !== this.previousResetKeys[index]
		)

		if (resetOnPropsChange && hasResetKeysChanged) {
			this.resetErrorBoundary()
		}
		this.previousResetKeys = resetKeys
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		const {onError} = this.props

		// Callback customizado
		onError?.(error, errorInfo)

		// Auto-reset após 10 segundos em componentes isolados
		if (this.props.isolate && this.props.level === 'component') {
			this.resetTimeoutId = window.setTimeout(() => {
				this.resetErrorBoundary()
			}, AUTO_RESET_TIMEOUT)
		}
	}

	componentWillUnmount() {
		if (this.resetTimeoutId) {
			clearTimeout(this.resetTimeoutId)
		}
	}

	resetErrorBoundary = () => {
		if (this.resetTimeoutId) {
			clearTimeout(this.resetTimeoutId)
			this.resetTimeoutId = null
		}
		this.setState({hasError: false, error: null})
	}

	render() {
		const {hasError, error} = this.state
		const {
			children,
			fallback,
			level = 'component',
			showDetails = false
		} = this.props

		if (hasError && error) {
			// Fallback customizado
			if (fallback) {
				return fallback(error, this.resetErrorBoundary)
			}

			// Fallback padrão baseado no nível
			return (
				<div className={this.getContainerClasses(level)}>
					<div className='flex flex-col items-center justify-center gap-4 p-8'>
						<AlertTriangle
							aria-hidden='true'
							className={this.getIconClasses(level)}
						/>
						<div className='text-center'>
							<h2 className={this.getTitleClasses(level)}>
								{this.getErrorTitle(level)}
							</h2>
							<p className='text-gray-600 mt-2'>
								{this.getErrorMessage(level)}
							</p>
							{showDetails && import.meta.env.DEV && (
								<details className='mt-4 text-left'>
									<summary className='cursor-pointer text-sm text-gray-500 hover:text-gray-700'>
										Detalhes do erro
									</summary>
									<pre className='mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-w-full'>
										{error.stack || error.message}
									</pre>
								</details>
							)}
						</div>
						<button
							className='flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
							onClick={this.resetErrorBoundary}
							type='button'
						>
							<RefreshCw className='w-4 h-4' />
							Tentar novamente
						</button>
					</div>
				</div>
			)
		}

		return children
	}

	private getContainerClasses(level: string): string {
		const base =
			'flex items-center justify-center bg-white rounded-lg shadow-sm'
		switch (level) {
			case 'page':
				return `${base} min-h-screen`
			case 'section':
				return `${base} min-h-[400px]`
			default:
				return `${base} min-h-[200px]`
		}
	}

	private getIconClasses(level: string): string {
		switch (level) {
			case 'page':
				return 'w-16 h-16 text-red-500'
			case 'section':
				return 'w-12 h-12 text-orange-500'
			default:
				return 'w-8 h-8 text-yellow-500'
		}
	}

	private getTitleClasses(level: string): string {
		switch (level) {
			case 'page':
				return 'text-2xl font-bold text-gray-900'
			case 'section':
				return 'text-xl font-semibold text-gray-800'
			default:
				return 'text-lg font-medium text-gray-700'
		}
	}

	private getErrorTitle(level: string): string {
		switch (level) {
			case 'page':
				return 'Ops! Algo deu errado'
			case 'section':
				return 'Erro ao carregar seção'
			default:
				return 'Erro no componente'
		}
	}

	private getErrorMessage(level: string): string {
		switch (level) {
			case 'page':
				return 'Ocorreu um erro inesperado. Por favor, recarregue a página.'
			case 'section':
				return 'Não foi possível carregar esta seção. Tente novamente.'
			default:
				return 'Este componente encontrou um problema.'
		}
	}
}
