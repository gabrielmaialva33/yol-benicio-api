import React from 'react'
import { Link } from '@inertiajs/react'
import type { Folder } from '~/shared/types'

interface FolderDetailHeaderProps {
  folder: Folder
}

const statusColors: Record<string, string> = {
  'active': 'bg-blue-50 text-blue-700 border border-blue-200',
  'completed': 'bg-green-50 text-green-700 border border-green-200',
  'pending': 'bg-orange-50 text-orange-700 border border-orange-200',
  'cancelled': 'bg-red-50 text-red-700 border border-red-200',
  'archived': 'bg-gray-50 text-gray-700 border border-gray-200'
}

const statusNames: Record<string, string> = {
  'active': 'Ativo',
  'completed': 'Concluído',
  'pending': 'Pendente',
  'cancelled': 'Cancelado',
  'archived': 'Arquivado'
}

export function FolderDetailHeader({ folder }: FolderDetailHeaderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left side - Folder info */}
        <div className="flex-1">
          {/* Breadcrumb */}
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-gray-500 text-sm"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link
                    href="/folders/consultation"
                    className="ml-4 text-gray-400 hover:text-gray-500 text-sm"
                  >
                    Pastas
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-gray-500 text-sm">{folder.code}</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Title and status */}
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{folder.title}</h1>
              <p className="text-gray-600 mt-1">Código: {folder.code}</p>
              {folder.description && (
                <p className="text-gray-500 mt-2">{folder.description}</p>
              )}
            </div>
            
            <span className={`
              px-3 py-1 text-sm font-medium rounded-full
              ${statusColors[folder.status] || statusColors.pending}
            `}>
              {statusNames[folder.status] || folder.status}
            </span>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exportar
          </button>
          
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
          
          <div className="relative">
            <button className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}