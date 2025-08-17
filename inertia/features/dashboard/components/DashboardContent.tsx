import {
  FolderIcon,
  DocumentTextIcon,
  CalendarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

import {
  ActiveFoldersCard,
  AreaDivisionCard,
  RequestsCard,
  TasksCard,
  FolderActivityCard,
  HearingsCard,
  BillingCard,
  BirthdaysCard,
} from './widgets'

export function DashboardContent() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo ao Dashboard</h1>
        <p className="text-gray-600">Acompanhe suas métricas e atividades em tempo real</p>
      </div>

      {/* Main Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Row 1 */}
        <div className="xl:col-span-2">
          <ActiveFoldersCard />
        </div>
        <div>
          <AreaDivisionCard />
        </div>

        {/* Row 2 */}
        <div>
          <TasksCard />
        </div>
        <div>
          <RequestsCard />
        </div>
        <div>
          <FolderActivityCard />
        </div>

        {/* Row 3 */}
        <div>
          <HearingsCard />
        </div>
        <div>
          <BillingCard />
        </div>
        <div>
          <BirthdaysCard />
        </div>
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
