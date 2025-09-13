import * as React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

interface FolderTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
  counts?: {
    all: number
    active: number
    archived: number
    suspended: number
  }
  children?: React.ReactNode
}

export function FolderTabs({
  activeTab,
  onTabChange,
  counts = { all: 0, active: 0, archived: 0, suspended: 0 },
  children,
}: FolderTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
        <TabsTrigger value="all" className="gap-2">
          Todas
          <Badge variant="secondary" className="ml-1">
            {counts.all}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="active" className="gap-2">
          Ativas
          <Badge variant="secondary" className="ml-1">
            {counts.active}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="archived" className="gap-2">
          Arquivadas
          <Badge variant="secondary" className="ml-1">
            {counts.archived}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="suspended" className="gap-2">
          Suspensas
          <Badge variant="secondary" className="ml-1">
            {counts.suspended}
          </Badge>
        </TabsTrigger>
      </TabsList>
      {children && (
        <>
          <TabsContent value="all">{children}</TabsContent>
          <TabsContent value="active">{children}</TabsContent>
          <TabsContent value="archived">{children}</TabsContent>
          <TabsContent value="suspended">{children}</TabsContent>
        </>
      )}
    </Tabs>
  )
}
