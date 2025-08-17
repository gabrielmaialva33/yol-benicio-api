import {DateTime} from 'luxon'
import type {DateRange} from 'react-day-picker'

export function formatDateRange(dateRange: DateRange | undefined) {
	if (!dateRange?.from) {
		return 'Selecione um período'
	}

	const fromFormatted = DateTime.fromJSDate(dateRange.from).toFormat(
		'dd/MM/yyyy'
	)
	const toFormatted = dateRange.to
		? DateTime.fromJSDate(dateRange.to).toFormat('dd/MM/yyyy')
		: ''

	return toFormatted ? `${fromFormatted} - ${toFormatted}` : fromFormatted
}
