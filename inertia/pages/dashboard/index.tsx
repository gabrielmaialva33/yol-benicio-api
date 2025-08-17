import { Head } from '@inertiajs/react'
import { Header } from '~/features/dashboard/components/Header'
import { Sidebar } from '~/features/dashboard/components/Sidebar'
import { DashboardContent } from '~/features/dashboard/components/DashboardContent'
import { UserSwitcher } from '~/shared/components/UserSwitcher'

export default function Dashboard() {
  return (
    <>
      <Head title="Dashboard - YOL Benício" />
      <div className="flex h-screen bg-[#F8FAFC]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="h-[0.5px] bg-[rgba(51,65,85,0.2)] mx-[30px]"></div>
          <main className="flex-1 overflow-y-auto">
            <DashboardContent />
          </main>
        </div>
      </div>
      <UserSwitcher />
    </>
  )
}
