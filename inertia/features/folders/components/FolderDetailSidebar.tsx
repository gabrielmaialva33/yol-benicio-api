import React from 'react'
import type { Folder } from '~/shared/types'
import { generateAvatar } from '~/shared/utils/generate-avatar'

interface FolderDetailSidebarProps {
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
  }
}

const areaNames: Record<string, string> = {
  'civil_litigation': 'Cível Contencioso',
  'labor': 'Trabalhista',
  'tax': 'Tributário',
  'criminal': 'Criminal',
  'administrative': 'Administrativo',
  'consumer': 'Consumidor',
  'family': 'Família',
  'corporate': 'Empresarial',
  'environmental': 'Ambiental',
  'intellectual_property': 'Propriedade Intelectual',
  'real_estate': 'Imobiliário',
  'international': 'Internacional'
}

export function FolderDetailSidebar({ folder }: FolderDetailSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nova Movimentação
          </button>
          
          <button className="w-full flex items-center px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Adicionar Documento
          </button>
          
          <button className="w-full flex items-center px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Agendar Compromisso
          </button>
        </div>
      </div>

      {/* Folder Details */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes da Pasta</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Área Jurídica
            </label>
            <p className="text-sm text-gray-900">{areaNames[folder.area] || folder.area}</p>
          </div>
          
          {folder.court && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Tribunal
              </label>
              <p className="text-sm text-gray-900">{folder.court}</p>
            </div>
          )}
          
          {folder.case_number && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Número do Processo
              </label>
              <p className="text-sm text-gray-900">{folder.case_number}</p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Data de Criação
            </label>
            <p className="text-sm text-gray-900">
              {new Date(folder.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Última Atualização
            </label>
            <p className="text-sm text-gray-900">
              {new Date(folder.updated_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Client Information */}
      {folder.client && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cliente</h3>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium text-white"
                style={{ backgroundColor: generateAvatar(folder.client.full_name) }}
              >
                {folder.client.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{folder.client.full_name}</p>
              <p className="text-sm text-gray-500">{folder.client.email}</p>
              {folder.client.code && (
                <p className="text-xs text-gray-400">Código: {folder.client.code}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Responsible Lawyer */}
      {folder.responsible_lawyer && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Advogado Responsável</h3>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              {folder.responsible_lawyer.avatar_url ? (
                <img
                  className="h-10 w-10 rounded-full"
                  src={folder.responsible_lawyer.avatar_url}
                  alt={folder.responsible_lawyer.full_name}
                />
              ) : (
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium text-white"
                  style={{ backgroundColor: generateAvatar(folder.responsible_lawyer.full_name) }}
                >
                  {folder.responsible_lawyer.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{folder.responsible_lawyer.full_name}</p>
              <p className="text-sm text-gray-500">{folder.responsible_lawyer.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-gray-900">Pasta criada</p>
              <p className="text-xs text-gray-500">
                {new Date(folder.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          
          {folder.updated_at !== folder.created_at && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Última atualização</p>
                <p className="text-xs text-gray-500">
                  {new Date(folder.updated_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}