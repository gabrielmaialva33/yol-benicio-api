import { useState } from 'react'
import { Head } from '@inertiajs/react'
import type { PageProps } from '@adonisjs/inertia/types'
import type { Folder } from '~/shared/types'
import DashboardLayout from '../dashboard/layout'
import { FolderDetailHeader } from '~/features/folders/components/FolderDetailHeader'
import { FolderDetailSidebar } from '~/features/folders/components/FolderDetailSidebar'
import { ProcessTimeline } from '~/features/folders/components/ProcessTimeline'

interface FolderShowProps extends PageProps {
  folder: Folder & {
    client?: {
      id: number
      full_name: string
      email: string
      code?: string
    }
    responsible_lawyer?: {
      id: number
      full_name: string
      email: string
      avatar_url?: string
    }
    processes?: Array<{
      id: number
      process_number: string
      cnj_number?: string
      instance: string
      nature: string
      action_type: string
      phase: string
      electronic: boolean
    }>
    documents?: Array<{
      id: number
      name: string
      type: string
      file_path: string
      file_size: number
      created_at: string
    }>
    movements?: Array<{
      id: number
      movement_date: string
      description: string
      responsible: string
      movement_type?: string
    }>
  }
}

const tabs = [
  { key: 'processo', label: 'Processo' },
  { key: 'andamento', label: 'Andamento' },
  { key: 'informacoes', label: 'Informações' },
  { key: 'publicacoes', label: 'Publicações' },
  { key: 'agenda', label: 'Agenda' },
  { key: 'financeiro', label: 'Financeiro' },
  { key: 'documentos', label: 'Documentos' },
]

export default function FolderShow({ folder }: FolderShowProps) {
  const [activeTab, setActiveTab] = useState('processo')

  const renderContent = () => {
    switch (activeTab) {
      case 'processo':
        return (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-[#161C24] mb-6">
              Informações do Processo
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código da Pasta
                </label>
                <p className="text-sm text-gray-900">{folder.code}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <p className="text-sm text-gray-900">{folder.title}</p>
              </div>
              
              {folder.description && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <p className="text-sm text-gray-900">{folder.description}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <p className="text-sm text-gray-900 capitalize">{folder.status}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Área
                </label>
                <p className="text-sm text-gray-900">{folder.area}</p>
              </div>
              
              {folder.court && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tribunal
                  </label>
                  <p className="text-sm text-gray-900">{folder.court}</p>
                </div>
              )}
              
              {folder.case_number && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número do Processo
                  </label>
                  <p className="text-sm text-gray-900">{folder.case_number}</p>
                </div>
              )}
              
              {folder.opposing_party && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parte Contrária
                  </label>
                  <p className="text-sm text-gray-900">{folder.opposing_party}</p>
                </div>
              )}
              
              {folder.client && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente
                  </label>
                  <p className="text-sm text-gray-900">{folder.client.full_name}</p>
                </div>
              )}
              
              {folder.responsible_lawyer && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Advogado Responsável
                  </label>
                  <p className="text-sm text-gray-900">{folder.responsible_lawyer.full_name}</p>
                </div>
              )}
            </div>
          </div>
        )
      
      case 'andamento':
        return <ProcessTimeline folderId={folder.id.toString()} movements={folder.movements || []} />
      
      case 'informacoes':
        return (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-[#161C24] mb-6">
              Informações Gerais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {folder.case_value && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor da Causa
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(folder.case_value)}
                  </p>
                </div>
              )}
              
              {folder.conviction_value && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor da Condenação
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(folder.conviction_value)}
                  </p>
                </div>
              )}
              
              {folder.distribution_date && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Distribuição
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(folder.distribution_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
              
              {folder.citation_date && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Citação
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(folder.citation_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
              
              {folder.next_hearing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Próxima Audiência
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(folder.next_hearing).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
              
              {folder.observation && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações
                  </label>
                  <p className="text-sm text-gray-900">{folder.observation}</p>
                </div>
              )}
            </div>
          </div>
        )
      
      case 'documentos':
        return (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-[#161C24] mb-6">
              Documentos
            </h3>
            
            {folder.documents && folder.documents.length > 0 ? (
              <div className="space-y-4">
                {folder.documents.map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{document.name}</p>
                        <p className="text-sm text-gray-500">
                          {document.type} • {(document.file_size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {new Date(document.created_at).toLocaleDateString('pt-BR')}
                      </span>
                      <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                        Baixar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhum documento encontrado.</p>
            )}
          </div>
        )
      
      default:
        return (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-[#161C24] mb-6">
              {tabs.find(tab => tab.key === activeTab)?.label}
            </h3>
            <p className="text-[#919EAB]">Conteúdo em desenvolvimento...</p>
          </div>
        )
    }
  }

  return (
    <DashboardLayout title={`Pasta ${folder.code}`}>
      <Head title={`Pasta ${folder.code} - ${folder.title}`} />
      
      <div className="p-4 sm:p-6 lg:p-8 bg-[#F1F1F2] min-h-full">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <FolderDetailHeader folder={folder} />
          
          <div className="mt-6 flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-80">
              <FolderDetailSidebar folder={folder} />
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              {/* Tabs */}
              <div className="bg-white rounded-t-2xl shadow-sm border border-gray-100">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8 px-6 pt-4" aria-label="Tabs">
                    {tabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`
                          whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm focus:outline-none
                          ${activeTab === tab.key
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }
                        `}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
              
              {/* Tab Content */}
              <div className="rounded-b-2xl">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}