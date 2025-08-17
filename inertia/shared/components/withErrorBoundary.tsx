import {ErrorBoundary, type ErrorBoundaryProps} from './ErrorBoundary'

/**
 * HOC para wrappear components com ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
	WrappedComponent: React.ComponentType<P>,
	errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
	const ComponentWithErrorBoundary = (props: P) => (
		<ErrorBoundary {...errorBoundaryProps}>
			<WrappedComponent {...props} />
		</ErrorBoundary>
	)

	ComponentWithErrorBoundary.displayName = `withErrorBoundary(${
		WrappedComponent.displayName || WrappedComponent.name
	})`

	return ComponentWithErrorBoundary
}
