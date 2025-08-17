import {
  FolderIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CakeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline'

interface StatCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  trend?: {
    value: string
    isPositive: boolean
  }
  color: string
}

function StatCard({ title, value, subtitle, icon: Icon, trend, color }: StatCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <div
            className={`flex items-center text-sm font-medium ${
              trend.isPositive ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {trend.isPositive ? (
              <ArrowUpIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 mr-1" />
            )}
            {trend.value}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  )
}

export function DashboardContent() {
  const stats = [
    {
      title: 'Pastas Ativas',
      value: 24,
      subtitle: '+12% este mês',
      icon: FolderIcon,
      trend: { value: '+12%', isPositive: true },
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    },
    {
      title: 'Divisão de Área',
      value: 8,
      subtitle: 'Processos ativos',
      icon: ChartBarIcon,
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    },
    {
      title: 'Atividade de Pastas',
      value: 156,
      subtitle: 'Movimentações hoje',
      icon: ClockIcon,
      trend: { value: '+8%', isPositive: true },
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
    },
    {
      title: 'Tarefas Pendentes',
      value: 12,
      subtitle: 'Para hoje',
      icon: CheckCircleIcon,
      trend: { value: '-3%', isPositive: false },
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
    },
    {
      title: 'Solicitações',
      value: 5,
      subtitle: 'Aguardando aprovação',
      icon: DocumentTextIcon,
      color: 'bg-gradient-to-r from-red-500 to-red-600',
    },
    {
      title: 'Audiências',
      value: 3,
      subtitle: 'Esta semana',
      icon: CalendarIcon,
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    },
    {
      title: 'Faturamento',
      value: 'R$ 45.2k',
      subtitle: 'Este mês',
      icon: CurrencyDollarIcon,
      trend: { value: '+15%', isPositive: true },
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    },
    {
      title: 'Aniversários',
      value: 2,
      subtitle: 'Hoje',
      icon: CakeIcon,
      color: 'bg-gradient-to-r from-pink-500 to-pink-600',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo ao Dashboard</h1>
        <p className="text-gray-600">Acompanhe suas métricas e atividades em tempo real</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
            <FolderIcon className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-700">Nova Pasta</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors duration-200">
            <DocumentTextIcon className="h-5 w-5 text-emerald-600 mr-2" />
            <span className="text-sm font-medium text-emerald-700">Nova Solicitação</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
            <CalendarIcon className="h-5 w-5 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-purple-700">Agendar Audiência</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200">
            <CheckCircleIcon className="h-5 w-5 text-orange-600 mr-2" />
            <span className="text-sm font-medium text-orange-700">Nova Tarefa</span>
          </button>
        </div>
      </div>
    </div>
  )
}
