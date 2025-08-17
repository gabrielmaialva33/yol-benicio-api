import type {HTMLAttributes} from 'react'
import {cn} from '../utils/cn'

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
	value: number // 0-100
	colorClassName?: string
	height?: string
}

const PROGRESS_MIN = 0
const PROGRESS_MAX = 100

export function ProgressBar({
	value,
	className,
	colorClassName = 'bg-teal-500',
	height = 'h-2',
	...rest
}: ProgressBarProps) {
	const clamped = Math.min(PROGRESS_MAX, Math.max(PROGRESS_MIN, value))
	return (
		<div className={cn('progress-track w-full', height, className)} {...rest}>
			<div
				className={cn(
					'progress-bar',
					colorClassName,
					'transition-all duration-300'
				)}
				style={{width: `${clamped}%`}}
			/>
		</div>
	)
}
