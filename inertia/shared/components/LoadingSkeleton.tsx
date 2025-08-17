import {cn} from '@shared/ui/utils/cn'

interface SkeletonProps {
	className?: string
	variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
	width?: string | number
	height?: string | number
	animation?: 'pulse' | 'wave' | 'none'
}

/**
 * Componente Skeleton para loading states
 */
export function Skeleton({
	className,
	variant = 'text',
	width,
	height,
	animation = 'pulse'
}: SkeletonProps) {
	const variantClasses = {
		text: 'rounded',
		circular: 'rounded-full',
		rectangular: 'rounded-none',
		rounded: 'rounded-lg'
	}

	const animationClasses = {
		pulse: 'animate-pulse',
		wave: 'animate-shimmer',
		none: ''
	}

	return (
		<div
			className={cn(
				'bg-gray-200',
				variantClasses[variant],
				animationClasses[animation],
				className
			)}
			style={{
				width: width || '100%',
				height: height || (variant === 'text' ? '1em' : '100%')
			}}
		/>
	)
}

/**
 * Container para múltiplos skeletons
 */
export function SkeletonContainer({
	children,
	className
}: {
	children: React.ReactNode
	className?: string
}) {
	return <div className={cn('space-y-3', className)}>{children}</div>
}

/**
 * Skeleton para cards
 */
export function CardSkeleton({className}: {className?: string}) {
	return (
		<div className={cn('bg-white rounded-lg shadow-sm p-6', className)}>
			<SkeletonContainer>
				<Skeleton height={20} variant='rectangular' width='40%' />
				<Skeleton height={16} variant='text' />
				<Skeleton height={16} variant='text' width='80%' />
				<div className='flex gap-4 mt-4'>
					<Skeleton height={32} variant='rounded' width={100} />
					<Skeleton height={32} variant='rounded' width={100} />
				</div>
			</SkeletonContainer>
		</div>
	)
}

/**
 * Skeleton para tabelas
 */
export function TableSkeleton({rows = 5}: {rows?: number}) {
	return (
		<div className='bg-white rounded-lg shadow-sm overflow-hidden'>
			<div className='border-b bg-gray-50 p-4'>
				<Skeleton height={20} variant='rectangular' width='30%' />
			</div>
			<div className='divide-y'>
				{Array.from({length: rows}, (_, index) => index).map(index => (
					<div className='p-4 flex gap-4' key={`skeleton-table-${index}`}>
						<Skeleton height={40} variant='circular' width={40} />
						<div className='flex-1 space-y-2'>
							<Skeleton height={16} variant='text' width='60%' />
							<Skeleton height={14} variant='text' width='40%' />
						</div>
						<Skeleton height={32} variant='rounded' width={80} />
					</div>
				))}
			</div>
		</div>
	)
}

/**
 * Skeleton para lista de items
 */
export function ListSkeleton({items = 3}: {items?: number}) {
	return (
		<div className='space-y-3'>
			{Array.from({length: items}, (_, index) => index).map(index => (
				<div
					className='flex items-center gap-3 p-3'
					key={`skeleton-list-${index}`}
				>
					<Skeleton height={48} variant='circular' width={48} />
					<div className='flex-1 space-y-2'>
						<Skeleton height={16} variant='text' width='70%' />
						<Skeleton height={14} variant='text' width='50%' />
					</div>
				</div>
			))}
		</div>
	)
}

/**
 * Skeleton para widgets do dashboard
 */
export function WidgetSkeleton() {
	return (
		<div className='bg-white rounded-lg shadow-sm p-6'>
			<div className='flex items-center justify-between mb-4'>
				<Skeleton height={24} variant='rectangular' width='40%' />
				<Skeleton height={32} variant='rounded' width={100} />
			</div>
			<Skeleton className='mb-4' height={14} variant='text' width='60%' />
			<div className='space-y-3'>
				<div className='flex items-center gap-3'>
					<Skeleton height={40} variant='circular' width={40} />
					<div className='flex-1'>
						<Skeleton height={16} variant='text' width='50%' />
						<Skeleton height={14} variant='text' width='30%' />
					</div>
				</div>
				<div className='flex items-center gap-3'>
					<Skeleton height={40} variant='circular' width={40} />
					<div className='flex-1'>
						<Skeleton height={16} variant='text' width='60%' />
						<Skeleton height={14} variant='text' width='40%' />
					</div>
				</div>
			</div>
		</div>
	)
}
