import * as React from 'react'
import { Search, Calendar, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'

interface FolderFiltersProps {
  filters: {
    clientNumber: string
    dateRange: string
    area: string
    status: string
    search: string
  }
  onFilterChange: (filters: any) => void
  onReset?: () => void
}

export function FolderFilters({ filters, onFilterChange, onReset }: FolderFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const handleReset = () => {
    onFilterChange({
      clientNumber: '',
      dateRange: '',
      area: '',
      status: 'Total',
      search: '',
    })
    onReset?.()
  }

  const activeFilterCount = Object.values(filters).filter(
    (value) => value && value !== 'Total'
  ).length

  const areas = [
    'Total',
    'Cível',
    'Criminal',
    'Trabalhista',
    'Família',
    'Previdenciário',
    'Tributário',
    'Administrativo',
  ]

  const statuses = ['Total', 'Ativo', 'Arquivado', 'Suspenso', 'Em Andamento', 'Concluído']

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por número, cliente ou descrição..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="font-semibold">Filtros Avançados</div>

                <div className="space-y-2">
                  <Label htmlFor="clientNumber">Número do Cliente</Label>
                  <Input
                    id="clientNumber"
                    placeholder="Ex: 12345"
                    value={filters.clientNumber}
                    onChange={(e) => handleFilterChange('clientNumber', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Área</Label>
                  <Select
                    value={filters.area}
                    onValueChange={(value) => handleFilterChange('area', value)}
                  >
                    <SelectTrigger id="area">
                      <SelectValue placeholder="Selecione a área" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => handleFilterChange('status', value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateRange">Período</Label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      placeholder="Data inicial"
                      onChange={(e) => {
                        const endDate = filters.dateRange.split(' to ')[1] || ''
                        handleFilterChange('dateRange', `${e.target.value} to ${endDate}`.trim())
                      }}
                    />
                    <Input
                      type="date"
                      placeholder="Data final"
                      onChange={(e) => {
                        const startDate = filters.dateRange.split(' to ')[0] || ''
                        handleFilterChange('dateRange', `${startDate} to ${e.target.value}`.trim())
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    <X className="h-4 w-4 mr-1" />
                    Limpar
                  </Button>
                  <PopoverTrigger asChild>
                    <Button size="sm">Aplicar</Button>
                  </PopoverTrigger>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.clientNumber && (
            <Badge variant="secondary" className="gap-1">
              Cliente: {filters.clientNumber}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('clientNumber', '')}
              />
            </Badge>
          )}
          {filters.area && filters.area !== 'Total' && (
            <Badge variant="secondary" className="gap-1">
              Área: {filters.area}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('area', '')}
              />
            </Badge>
          )}
          {filters.status && filters.status !== 'Total' && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.status}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('status', 'Total')}
              />
            </Badge>
          )}
          {filters.dateRange && (
            <Badge variant="secondary" className="gap-1">
              Período: {filters.dateRange}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('dateRange', '')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
