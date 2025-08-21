import { Search } from 'lucide-react'
import { useState } from 'react'
import type { FolderDetail } from '@/features/folders/types'
import { FormField, SelectField, TextareaField, ToggleSwitch } from '@/shared/ui/form'

interface FolderProcessFormProps {
  folder: FolderDetail
  onSubmit?: (data: FolderFormData) => void
  isSubmitting?: boolean
}

interface FolderFormData {
  // Identification
  process_number: string
  cnj_number: string
  instance: string
  nature: string

  // Process Information
  action_type: string
  phase: string
  is_electronic: boolean
  client_code: string
  folder_number: string
  is_default_billing_case: boolean
  is_totus: boolean
  is_migrated: boolean

  // Court Information
  organ: string
  distribution: string
  entry_date: string
  status: string
  internal_code: string
  search_type: string
  code: string
  judge: string

  // Additional Details
  area: string
  district: string
  partner: string
  sub_area: string
  court: string
  coordinator: string
  core: string
  court_division: string
  lawyer: string

  // Poles
  is_active_pole: boolean
  is_passive_pole: boolean

  // Observations
  observation: string
  object_detail: string
  last_movement: string
}

export function FolderProcessForm({
  folder,
  onSubmit,
  isSubmitting = false,
}: FolderProcessFormProps) {
  // Initialize form data from folder
  const [formData, setFormData] = useState<FolderFormData>({
    // Identification
    process_number: folder.process_number || '',
    cnj_number: folder.cnj_number || '',
    instance: folder.instance || 'Primeira Instância',
    nature: folder.nature || 'Cível',

    // Process Information
    action_type: folder.action_type || 'Ordinária',
    phase: folder.phase || 'Conhecimento',
    is_electronic: folder.is_electronic || true,
    client_code: folder.client_code || '',
    folder_number: folder.folder_number || '',
    is_default_billing_case: folder.is_default_billing_case || true,
    is_totus: folder.is_totus || false,
    is_migrated: folder.is_migrated || false,

    // Court Information
    organ: folder.organ || 'TJSP',
    distribution: folder.distribution || 'Sorteio',
    entry_date: folder.entry_date || '',
    status: folder.status || 'Ativo',
    internal_code: folder.internal_code || '',
    search_type: folder.search_type || 'Padrão',
    code: folder.code || '',
    judge: folder.judge || '',

    // Additional Details
    area: folder.area || '',
    district: folder.district || '',
    partner: folder.partner || '',
    sub_area: folder.sub_area || '',
    court: folder.court || '',
    coordinator: folder.coordinator || '',
    core: folder.core || '',
    court_division: folder.court_division || '',
    lawyer: folder.lawyer || '',

    // Poles
    is_active_pole: folder.is_active_pole || false,
    is_passive_pole: folder.is_passive_pole || false,

    // Observations
    observation: folder.observation || '',
    object_detail: folder.object_detail || '',
    last_movement: folder.last_movement || '',
  })

  const updateField = (field: keyof FolderFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(formData)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Header with Search */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Processo</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B8D9] focus:border-[#00B8D9]"
              placeholder="Buscar"
              type="text"
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Identification Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FormField
            label="N° Processo"
            value={formData.process_number}
            onChange={(value) => updateField('process_number', value)}
            placeholder="Digite o número do processo"
          />
          <FormField
            label="N° CNJ"
            value={formData.cnj_number}
            onChange={(value) => updateField('cnj_number', value)}
            placeholder="0000000-00.0000.0.00.0000"
          />
          <SelectField
            label="Instância"
            value={formData.instance}
            options={['Primeira Instância', 'Segunda Instância', 'Tribunais Superiores']}
            onChange={(value) => updateField('instance', value)}
          />
          <SelectField
            label="Natureza"
            value={formData.nature}
            options={['Cível', 'Criminal', 'Trabalhista', 'Tributário']}
            onChange={(value) => updateField('nature', value)}
          />
        </div>

        {/* Process Information */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SelectField
            label="Tipo ação"
            value={formData.action_type}
            options={['Ordinária', 'Sumária', 'Execução', 'Cautelar']}
            onChange={(value) => updateField('action_type', value)}
          />
          <SelectField
            label="Fase"
            value={formData.phase}
            options={['Conhecimento', 'Recursal', 'Execução', 'Cumprimento de Sentença']}
            onChange={(value) => updateField('phase', value)}
          />
          <SelectField
            label="Eletrônico"
            value={formData.is_electronic ? 'Sim' : 'Não'}
            options={['Sim', 'Não']}
            onChange={(value) => updateField('is_electronic', value === 'Sim')}
          />
          <FormField
            label="Cod. cliente"
            value={formData.client_code}
            onChange={(value) => updateField('client_code', value)}
            placeholder="Código do cliente"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FormField
            label="Pasta"
            value={formData.folder_number}
            onChange={(value) => updateField('folder_number', value)}
            placeholder="Código da pasta"
          />
          <SelectField
            label="Caso padrão faturamento"
            value={formData.is_default_billing_case ? 'Sim' : 'Não'}
            options={['Sim', 'Não']}
            onChange={(value) => updateField('is_default_billing_case', value === 'Sim')}
          />
          <div className="flex items-center gap-6">
            <ToggleSwitch
              label="TOTUS"
              checked={formData.is_totus}
              onChange={(checked) => updateField('is_totus', checked)}
            />
            <ToggleSwitch
              label="Migrado"
              checked={formData.is_migrated}
              onChange={(checked) => updateField('is_migrated', checked)}
            />
          </div>
        </div>

        {/* Court Information */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SelectField
            label="Órgão"
            value={formData.organ}
            options={['TJSP', 'TJRJ', 'TJMG', 'TRF', 'STJ', 'STF']}
            onChange={(value) => updateField('organ', value)}
          />
          <SelectField
            label="Distribuição"
            value={formData.distribution}
            options={['Sorteio', 'Dependência', 'Prevenção']}
            onChange={(value) => updateField('distribution', value)}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="entry_date">
              Entrada
            </label>
            <input
              type="date"
              id="entry_date"
              value={formData.entry_date}
              onChange={(e) => updateField('entry_date', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00B8D9] focus:border-[#00B8D9]"
            />
          </div>
          <SelectField
            label="Status"
            value={formData.status}
            options={['Ativo', 'Suspenso', 'Arquivado', 'Concluído']}
            onChange={(value) => updateField('status', value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FormField
            label="Cód.Interno"
            value={formData.internal_code}
            onChange={(value) => updateField('internal_code', value)}
            placeholder="Código interno"
          />
          <SelectField
            label="Tipo Pesquisa"
            value={formData.search_type}
            options={['Padrão', 'Avançada', 'Personalizada']}
            onChange={(value) => updateField('search_type', value)}
          />
          <FormField
            label="Código"
            value={formData.code}
            onChange={(value) => updateField('code', value)}
            placeholder="Código"
          />
          <FormField
            label="Juiz"
            value={formData.judge}
            onChange={(value) => updateField('judge', value)}
            placeholder="Nome do juiz"
          />
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SelectField
            label="Área"
            value={formData.area}
            options={['Cível', 'Trabalhista', 'Criminal', 'Tributário']}
            onChange={(value) => updateField('area', value)}
          />
          <SelectField
            label="Comarca"
            value={formData.district}
            options={['São Paulo', 'Rio de Janeiro', 'Belo Horizonte']}
            onChange={(value) => updateField('district', value)}
          />
          <SelectField
            label="Sócio"
            value={formData.partner}
            options={['Dr. João Silva', 'Dra. Maria Santos']}
            onChange={(value) => updateField('partner', value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SelectField
            label="SubÁrea"
            value={formData.sub_area}
            options={['Contratos', 'Família', 'Consumidor']}
            onChange={(value) => updateField('sub_area', value)}
          />
          <SelectField
            label="Foro"
            value={formData.court}
            options={['Central', 'Regional']}
            onChange={(value) => updateField('court', value)}
          />
          <SelectField
            label="Coordenador"
            value={formData.coordinator}
            options={['Carlos Mendes', 'Ana Costa']}
            onChange={(value) => updateField('coordinator', value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SelectField
            label="Núcleo"
            value={formData.core}
            options={['Norte', 'Sul', 'Centro']}
            onChange={(value) => updateField('core', value)}
          />
          <SelectField
            label="Vara"
            value={formData.court_division}
            options={['1ª Vara', '2ª Vara', '3ª Vara']}
            onChange={(value) => updateField('court_division', value)}
          />
          <SelectField
            label="Advogado"
            value={formData.lawyer}
            options={['Dr. Pedro Lima', 'Dra. Julia Martins']}
            onChange={(value) => updateField('lawyer', value)}
          />
        </div>

        {/* Poles Section */}
        <div className="border-t border-gray-100 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <ToggleSwitch
                label="Polo ativo"
                checked={formData.is_active_pole}
                onChange={(checked) => updateField('is_active_pole', checked)}
              />
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <ToggleSwitch
                label="Polo passivo"
                checked={formData.is_passive_pole}
                onChange={(checked) => updateField('is_passive_pole', checked)}
              />
            </div>
          </div>
        </div>

        {/* Observations Section */}
        <div className="border-t border-gray-100 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TextareaField
              label="Observação"
              value={formData.observation}
              onChange={(value) => updateField('observation', value)}
              placeholder="Digite aqui..."
            />
            <TextareaField
              label="Detalhamento do objeto"
              value={formData.object_detail}
              onChange={(value) => updateField('object_detail', value)}
              placeholder="Digite aqui..."
            />
            <TextareaField
              label="Último andamento"
              value={formData.last_movement}
              onChange={(value) => updateField('last_movement', value)}
              placeholder="Digite aqui..."
            />
          </div>
        </div>

        {/* Submit Button */}
        {onSubmit && (
          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#00B8D9] text-white rounded-lg hover:bg-[#00A3C4] focus:outline-none focus:ring-2 focus:ring-[#00B8D9] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export type { FolderFormData }
