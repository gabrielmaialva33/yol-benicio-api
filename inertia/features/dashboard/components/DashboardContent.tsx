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
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-[1100px] mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Visão geral das suas atividades</p>
        </div>

        {/* Row 1: Pastas ativas, Divisão por áreas, Atividade de Pastas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <ActiveFoldersCard />
          <AreaDivisionCard />
          <FolderActivityCard />
        </div>

        {/* Row 2: Suas tarefas, Requisições */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TasksCard />
          <RequestsCard />
        </div>

        {/* Row 3: Audiências e Prazos (2/3) + Faturamento e Aniversariantes (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <HearingsCard />
          </div>
          <div className="space-y-6">
            <BillingCard />
            <BirthdaysCard />
          </div>
        </div>
      </div>
    </div>
  )
}
