import { useApiQuery } from './use_api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'

interface HearingDashboardData {
  label: string
  type: string
  percentage: number
  total: number
  completed: number
  color: string
}

async function getDashboardHearings(): Promise<HearingDashboardData[]> {
  const response = await fetch('/api/v1/hearings/dashboard', {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard hearings')
  }

  return response.json()
}

async function updateHearingStatus(hearingId: number, status: string): Promise<any> {
  const response = await fetch(`/api/v1/hearings/${hearingId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    throw new Error('Failed to update hearing status')
  }

  return response.json()
}

export function useHearings() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const queryClient = useQueryClient()

  const { data: hearings = [] } = useApiQuery<HearingDashboardData[]>({
    queryKey: ['hearings', 'dashboard'],
    queryFn: getDashboardHearings,
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ hearingId, status }: { hearingId: number; status: string }) =>
      updateHearingStatus(hearingId, status),
    onSuccess: () => {
      // Invalidate and refetch hearings
      queryClient.invalidateQueries({ queryKey: ['hearings', 'dashboard'] })
    },
  })

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
  }

  const updateStatus = (id: number, status: string) => {
    updateStatusMutation.mutate({ hearingId: id, status })
  }

  return {
    hearings,
    dateRange,
    setDateRange: handleDateRangeChange,
    updateStatus,
    isUpdating: updateStatusMutation.isPending,
  }
}
