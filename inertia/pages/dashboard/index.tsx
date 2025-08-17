import { Head } from '@inertiajs/react'
import { Header } from '~fures/dashboard/components/Header'
import { Sidebar } from '~/fe~u/dashboard/components/Sidebar'
import { DashboardContent } from '~/featur~/hboard/components/DashboardContent'

export default function Dashboard() {
  return (
    <>
      <Head title="Dashboard - YOL Benício" />
      <div className="flex h-screen bg-[#F1F1F2]"> [#F1F1F2]="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <DashboardCont/main>
    