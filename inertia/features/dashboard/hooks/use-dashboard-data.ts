import { useQuery } from '@tanstack/react-query'

interface DashboardStats {
  activeFolders: {
    total: number
    newThisMonth: number
    history: Array<{
      month: string
      value: number
    }>
  }
  areaDivision: Array<{
    area: string
    value: number
    color: string
  }>
  folderActivity: {
    thisMonth: number
    lastMonth: number
    percentageChange: number
    chartData: Array<{
      day: string
      value: number
    }>
  }
  requests: {
    total: number
    thisMonth: number
    pending: number
    completed: number
    monthlyData: Array<{
      month: string
      total: number
      completed: number
    }>
  }
  billing: {
    totalRevenue: number
    thisMonth: number
    lastMonth: number
    pendingPayments: number
    chartData: Array<{
      month: string
      revenue: number
    }>
  }
  hearings: {
    upcoming: number
    thisWeek: number
    thisMonth: number
    schedule: Array<{
      id: number
      title: string
      date: string
      time: string
      type: string
      client: string
    }>
  }
  birthdays: Array<{
    id: number
    name: string
    type: 'client' | 'user'
    birthday: string
    avatar: string
    daysUntil: number
  }>
  tasks: {
    total: number
    completed: number
    pending: number
    overdue: number
    todayTasks: Array<{
      id: number
      title: string
      priority: 'high' | 'medium' | 'low'
      dueDate: string
      assignee: string
      status: 'pending' | 'in_progress' | 'completed'
    }>
  }
}

interface DashboardDataResponse {
  data: DashboardStats
  message?: string
}

async function getDashboardData(): Promise<DashboardDataResponse> {
  const response = await fetch('/api/dashboard', {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao carregar dados do dashboard')
  }

  return response.json()
}

export function useDashboardData() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<DashboardDataResponse>({
    queryKey: ['dashboard', 'data'],
    queryFn: getDashboardData,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  })

  return {
    dashboardData: data?.data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  }
}

export type { DashboardStats }