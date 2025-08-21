import { Calendar, ChevronDown } from 'lucide-react'
import type { FolderDetail } from '@/features/folders/types'
import { SelectField, FormField, TextareaField, ToggleSwitch } from '@/shared/ui/form'

interface FolderDetailFormProps {
  folder: FolderDetail
  isEditing?: boolean
  onChange?: (field: string, value: any) => void
}

export function FolderDetailForm({ folder, isEditing = false, onChange }: FolderDetailFormProps) {
  const handleChange = (field: string, value: any) => {
    if (onChange) {
      onChange(field, value)
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      {/* Process Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 border-b pb-6 mb-6">
        <FormField
          label="Nº Processo"
          value={folder.process_number}
          readOnly={!isEditing}
          onChange={(value) => handleChange('process_number', value)}
        />
        <FormField
          label="Nº CNJ"
          value={folder.cnj_number}
          readOnly={!isEditing}
          onChange={(value) => handleChange('cnj_number', value)}
        />
        <SelectField
          label="Instância"
          options={['Primeira Instância', 'Segunda Instância']}
          value={folder.instance}
          readOnly={!isEditing}
          onChange={(value) => handleChange('instance', value)}
        />
        <SelectField
          label="Natureza"
          options={['Cível', 'Criminal', 'Trabalhista']}
          value={folder.nature}
          readOnly={!isEditing}
          onChange={(value) => handleChange('nature', value)}
        />
        <SelectField
          label="Tipo de Ação"
          options={['Ordinária', 'Sumária', 'Cautelar']}
          value={folder.action_type}
          readOnly={!isEditing}
          onChange={(value) => handleChange('action_type', value)}
        />
        <SelectField
          label="Fase"
          options={['Conhecimento', 'Execução', 'Recursal']}
          value={folder.phase}
          readOnly={!isEditing}
          onChange={(value) => handleChange('phase', value)}
        />
        <SelectField
          label="Eletrônico"
          options={['Sim', 'Não']}
          value={folder.is_electronic ? 'Sim' : 'Não'}
          readOnly={!isEditing}
          onChange={(value) => handleChange('is_electronic', value === 'Sim')}
        />
        <FormField
          label="Cód. Cliente"
          value={folder.client_code}
          readOnly={!isEditing}
          onChange={(value) => handleChange('client_code', value)}
        />
        <FormField
          label="Pasta"
          value={folder.folder_number}
          readOnly={!isEditing}
          onChange={(value) => handleChange('folder_number', value)}
        />
        <SelectField
          label="Caso Padrão Faturamento"
          options={['Sim', 'Não']}
          value={folder.is_default_billing_case ? 'Sim' : 'Não'}
          readOnly={!isEditing}
          onChange={(value) => handleChange('is_default_billing_case', value === 'Sim')}
        />
        <div className="flex items-end">
          <ToggleSwitch
            label="TOTUS"
            checked={folder.is_totus}
            disabled={!isEditing}
            onChange={(checked) => handleChange('is_totus', checked)}
          />
        </div>
        <div className="flex items-end">
          <ToggleSwitch
            label="Migrado"
            checked={folder.is_migrated}
            disabled={!isEditing}
            onChange={(checked) => handleChange('is_migrated', checked)}
          />
        </div>
        <SelectField
          label="Órgão"
          options={['TJSP', 'TJRJ', 'STJ', 'STF']}
          value={folder.organ}
          readOnly={!isEditing}
          onChange={(value) => handleChange('organ', value)}
        />
        <SelectField
          label="Distribuição"
          options={['Sorteio', 'Distribuição Livre', 'Prevenção']}
          value={folder.distribution}
          readOnly={!isEditing}
          onChange={(value) => handleChange('distribution', value)}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="entry_date">
            Entrada
          </label>
          <div className="relative">
            <input
              className="w-full bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              id="entry_date"
              readOnly={!isEditing}
              type="date"
              value={folder.entry_date}
              onChange={(e) => handleChange('entry_date', e.target.value)}
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <SelectField
          label="Status"
          options={['Ativo', 'Inativo', 'Arquivado']}
          value={folder.status}
          readOnly={!isEditing}
          onChange={(value) => handleChange('status', value)}
        />
        <FormField
          label="Código Interno"
          value={folder.internal_code}
          readOnly={!isEditing}
          onChange={(value) => handleChange('internal_code', value)}
        />
        <SelectField
          label="Tipo de Pesquisa"
          options={['Padrão', 'Avançada', 'Personalizada']}
          value={folder.search_type}
          readOnly={!isEditing}
          onChange={(value) => handleChange('search_type', value)}
        />
        <FormField
          label="Código"
          value={folder.code}
          readOnly={!isEditing}
          onChange={(value) => handleChange('code', value)}
        />
        <FormField
          label="Juiz"
          value={folder.judge}
          readOnly={!isEditing}
          onChange={(value) => handleChange('judge', value)}
        />
      </div>

      {/* Location and Responsibility Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b pb-6 mb-6">
        <SelectField
          label="Área"
          options={['Cível Contencioso', 'Trabalhista', 'Criminal', 'Tributário']}
          value={folder.area}
          readOnly={!isEditing}
          onChange={(value) => handleChange('area', value)}
        />
        <SelectField
          label="Comarca"
          options={['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília']}
          value={folder.district}
          readOnly={!isEditing}
          onChange={(value) => handleChange('district', value)}
        />
        <SelectField
          label="Sócio"
          options={['Dr. João', 'Dra. Maria', 'Dr. Carlos']}
          value={folder.partner}
          readOnly={!isEditing}
          onChange={(value) => handleChange('partner', value)}
        />
        <SelectField
          label="SubÁrea"
          options={['Contratos', 'Responsabilidade Civil', 'Direito do Consumidor']}
          value={folder.sub_area}
          readOnly={!isEditing}
          onChange={(value) => handleChange('sub_area', value)}
        />
        <SelectField
          label="Foro"
          options={['Foro Central Cível', 'Foro Regional', 'Foro da Barra Funda']}
          value={folder.court}
          readOnly={!isEditing}
          onChange={(value) => handleChange('court', value)}
        />
        <SelectField
          label="Coordenador"
          options={['Dra. Maria', 'Dr. João', 'Dr. Carlos']}
          value={folder.coordinator}
          readOnly={!isEditing}
          onChange={(value) => handleChange('coordinator', value)}
        />
        <SelectField
          label="Núcleo"
          options={['Equipe 1', 'Equipe 2', 'Equipe 3']}
          value={folder.core}
          readOnly={!isEditing}
          onChange={(value) => handleChange('core', value)}
        />
        <SelectField
          label="Vara"
          options={['1ª Vara Cível', '2ª Vara Cível', '3ª Vara Cível']}
          value={folder.court_division}
          readOnly={!isEditing}
          onChange={(value) => handleChange('court_division', value)}
        />
        <SelectField
          label="Advogado"
          options={['Dr. Carlos', 'Dra. Ana', 'Dr. Pedro']}
          value={folder.lawyer}
          readOnly={!isEditing}
          onChange={(value) => handleChange('lawyer', value)}
        />
      </div>

      {/* Position Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="flex gap-4">
          <ToggleSwitch
            label="Polo Ativo"
            checked={folder.is_active_pole}
            disabled={!isEditing}
            onChange={(checked) => handleChange('is_active_pole', checked)}
          />
          <ToggleSwitch
            label="Polo Passivo"
            checked={folder.is_passive_pole}
            disabled={!isEditing}
            onChange={(checked) => handleChange('is_passive_pole', checked)}
          />
        </div>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TextareaField
          label="Observação"
          value={folder.observation}
          readOnly={!isEditing}
          onChange={(value) => handleChange('observation', value)}
        />
        <TextareaField
          label="Detalhamento do Objeto"
          value={folder.object_detail}
          readOnly={!isEditing}
          onChange={(value) => handleChange('object_detail', value)}
        />
        <TextareaField
          label="Último Andamento"
          value={folder.last_movement}
          readOnly={!isEditing}
          onChange={(value) => handleChange('last_movement', value)}
        />
      </div>
    </div>
  )
}
