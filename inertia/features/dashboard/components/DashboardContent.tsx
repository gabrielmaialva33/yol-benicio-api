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
    <div className="p-[30px]">
      {/* Row 1: 3 columns on large screens, 1 column on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <ActiveFoldersCard />
        <AreaDivisionCard />
        <FolderActivityCard />
      </div>

      {/* Row 2: 2 columns on large screens, 1 column on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <TasksCard />
        <RequestsCard />
      </div>

      {/* Row 3: Complex layout with 2/3 + 1/3 split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <HearingsCard />
        </div>
        <div className="flex flex-col gap-5">
          <BillingCard />
          <BirthdaysCard />
        </div>
      </div>
    </div>
  )
}
