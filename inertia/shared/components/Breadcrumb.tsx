import {Link} from 'react-router'

interface BreadcrumbItem {
	label: string
	href?: string
	isActive?: boolean
}

interface BreadcrumbProps {
	items: BreadcrumbItem[]
}

export function Breadcrumb({items}: BreadcrumbProps) {
	return (
		<nav aria-label='Breadcrumb' className='flex items-center gap-4'>
			{items.map((item, index) => (
				<div className='flex items-center gap-4' key={`${item.label}-${index}`}>
					{item.href && !item.isActive ? (
						<Link
							className='text-sm font-normal text-[#212B36] hover:text-[#161C24] transition-colors'
							to={item.href}
						>
							{item.label}
						</Link>
					) : (
						<span className='text-sm font-normal text-[#919EAB]'>
							{item.label}
						</span>
					)}
					{index < items.length - 1 && (
						<span className='text-[#919EAB]'>•</span>
					)}
				</div>
			))}
		</nav>
	)
}
