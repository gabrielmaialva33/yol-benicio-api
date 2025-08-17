import { Head } from '@inertiajs/react'
import { Header } from '~/features/dashboard/components/Header'
import { Sidebar } from '~/features/dashboard/components/Sidebar'
import { DashboardContent } from '~/features/dashboard/components/DashboardContent'
import { UserSwitcher } from '~/shared/components/UserSwitcher'

export default function Dashboard() {
  return (
    <>
      <Head title="Dashboard - YOL Benício" />
      <div className="flex h-screen bg-[#F1F1F2]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <DashboardContent />
          </main>
        </div>
      </div>
      <UserSwitcher />
    </>
  )
}
