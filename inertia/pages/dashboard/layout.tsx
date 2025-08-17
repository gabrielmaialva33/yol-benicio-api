import { PropsWithChildren } from 'react'
import { Head } from '@inertiajs/react'
import { Header } from '~/features/dashboard/components/Header'
import { Sidebar } from '~/features/dashboard/components/Sidebar'

export default function DashboardLayout({ children, title }: PropsWithChildren<{ title?: string }>) {
  return (
    <>
      <Head title={title || 'Dashboard - YOL Benício'} />
      <div className="flex h-screen bg-[#F1F1F2]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}