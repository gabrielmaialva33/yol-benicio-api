import type {DateRange} from 'react-day-picker'
import {
	DayPicker,
	getDefaultClassNames,
	type SelectRangeEventHandler
} from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import {formatDateRange} from '../utils/format-date-range'

interface DateRangePickerProps {
	dateRange: DateRange | undefined
	onDateRangeChange?: SelectRangeEventHandler
	isOpen: boolean
	onToggle: () => void
}

export function DateRangePicker({
	dateRange,
	onDateRangeChange = () => null,
	isOpen,
	onToggle
}: DateRangePickerProps) {
	const defaultClassNames = getDefaultClassNames()

	return (
		<div className='relative'>
			<button
				className='flex items-center space-x-2 text-sm text-gray-500 bg-gray-100 rounded-md p-2 cursor-pointer'
				onClick={onToggle}
				type='button'
			>
				<span>{formatDateRange(dateRange)}</span>
				<div className='p-1'>
					<svg
						className='w-4 h-4'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<title>Calendar</title>
						<path
							d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
						/>
					</svg>
				</div>
			</button>

			{isOpen && (
				<div className='absolute top-12 right-0 bg-white border rounded-lg shadow-lg z-10 p-4'>
					<DayPicker
						classNames={{
							...defaultClassNames,
							root: `${defaultClassNames.root} bg-white`,
							caption_label: 'text-lg font-semibold text-gray-800',
							cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-blue-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
							day: `${defaultClassNames.day} h-9 w-9 p-0 font-normal text-gray-800`,
							selected:
								'bg-blue-500 text-white hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white',
							today: `${defaultClassNames.today} bg-gray-100 text-gray-900 font-bold`,
							outside: `${defaultClassNames.outside} text-gray-400 opacity-50`,
							range_middle: `${defaultClassNames.range_middle} aria-selected:bg-blue-100 aria-selected:text-blue-700`,
							weekdays: `${defaultClassNames.weekdays} text-gray-600`
						}}
						mode='range'
						onSelect={onDateRangeChange}
						required={false}
						selected={dateRange}
					/>
				</div>
			)}
		</div>
	)
}
