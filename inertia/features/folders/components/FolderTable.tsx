import type { Folder } from '~/shared/types'
import { Link } from '@inertiajs/react'
import { generateAvatar } from '~/shared/utils/generate-avatar'

const areaNames: Record<string, string> = {
  civil_litigation: 'Cível Contencioso',
  labor: 'Trabalhista',
  tax: 'Tributário',
  criminal: 'Criminal',
  administrative: 'Administrativo',
  consumer: 'Consumidor',
  family: 'Família',
  corporate: 'Empresarial',
  environmental: 'Ambiental',
  intellectual_property: 'Propriedade Intelectual',
  real_estate: 'Imobiliário',
  international: 'Internacional',
}

const statusNames: Record<string, string> = {
  active: 'Ativo',
  completed: 'Concluído',
  pending: 'Pendente',
  cancelled: 'Cancelado',
  archived: 'Arquivado',
}

const statusColors: Record<string, string> = {
  active: 'bg-blue-50 text-blue-700 border border-blue-200',
  completed: 'bg-green-50 text-green-700 border border-green-200',
  pending: 'bg-orange-50 text-orange-700 border border-orange-200',
  cancelled: 'bg-red-50 text-red-700 border border-red-200',
  archived: 'bg-gray-50 text-gray-700 border border-gray-200',
}

interface FolderTableProps {
  folders: Folder[]
  sort: {
    column: string
    direction: string
  }
  setSort: (sort: { column: string; direction: string }) => void
  selectedFolders: string[]
  setSelectedFolders: (selectedFolders: string[]) => void
}

const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses =
    'px-4 py-2 text-sm font-medium rounded-full inline-block min-w-[80px] text-center'

  return (
    <span className={`${baseClasses} ${statusColors[status] || statusColors.pending}`}>
      {statusNames[status] || status}
    </span>
  )
}

export function FolderTable({
  folders,
  sort,
  setSort,
  selectedFolders,
  setSelectedFolders,
}: FolderTableProps) {
  const handleSort = (column: string) => {
    const direction = sort.column === column && sort.direction === 'asc' ? 'desc' : 'asc'
    setSort({ column, direction })
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedFolders(folders.map((folder) => folder.id.toString()))
    } else {
      setSelectedFolders([])
    }
  }

  const handleSelectOne = (id: string) => {
    const selectedIndex = selectedFolders.indexOf(id)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedFolders, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedFolders.slice(1))
    } else if (selectedIndex === selectedFolders.length - 1) {
      newSelected = newSelected.concat(selectedFolders.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedFolders.slice(0, selectedIndex),
        selectedFolders.slice(selectedIndex + 1)
      )
    }

    setSelectedFolders(newSelected)
  }

  const SortIcon = ({ column }: { column: string }) => {
    if (sort.column !== column) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      )
    }

    return sort.direction === 'asc' ? (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    )
  }

  if (folders.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="text-gray-500 mb-2">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma pasta encontrada</h3>
        <p className="text-gray-500">Não há pastas que correspondam aos filtros selecionados.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={selectedFolders.length === folders.length && folders.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('code')}
              >
                <div className="flex items-center space-x-1">
                  <span>Código</span>
                  <SortIcon column="code" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center space-x-1">
                  <span>Título</span>
                  <SortIcon column="title" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('area')}
              >
                <div className="flex items-center space-x-1">
                  <span>Área</span>
                  <SortIcon column="area" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <SortIcon column="status" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responsável
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center space-x-1">
                  <span>Data de Inclusão</span>
                  <SortIcon column="created_at" />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {folders.map((folder) => (
              <tr key={folder.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={selectedFolders.indexOf(folder.id.toString()) !== -1}
                    onChange={() => handleSelectOne(folder.id.toString())}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{folder.code}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{folder.title}</div>
                  {folder.description && (
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {folder.description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {areaNames[folder.area] || folder.area}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={folder.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {folder.responsible_lawyer ? (
                        folder.responsible_lawyer.avatar_url ? (
                          <img
                            className="h-8 w-8 rounded-full"
                            src={folder.responsible_lawyer.avatar_url}
                            alt={folder.responsible_lawyer.full_name}
                          />
                        ) : (
                          <div
                            className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium text-white"
                            style={{
                              backgroundColor: generateAvatar(folder.responsible_lawyer.full_name),
                            }}
                          >
                            {folder.responsible_lawyer.full_name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                        )
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {folder.responsible_lawyer?.full_name || 'Não atribuído'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(folder.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={`/folders/${folder.id}`}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      Ver detalhes
                    </Link>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
