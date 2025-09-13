import * as React from 'react'
import { Link } from '@inertiajs/react'
import { Star, StarOff, Eye, Edit, Archive, MoreVertical } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface Client {
  id: number
  name: string
  cpf?: string
  cnpj?: string
}

interface Folder {
  id: number
  number: string
  type: string
  area: string
  status: string
  client: Client
  createdAt: string
  updatedAt: string
  isFavorite?: boolean
}

interface FolderTableProps {
  folders: Folder[]
  onToggleFavorite?: (folderId: number) => void
  onArchive?: (folderId: number) => void
  isLoading?: boolean
}

export function FolderTable({ folders, onToggleFavorite, onArchive, isLoading }: FolderTableProps) {
  const statusColors = {
    'Ativo': 'success',
    'Arquivado': 'secondary',
    'Suspenso': 'warning',
    'Em Andamento': 'info',
    'Concluído': 'default',
  } as const

  const areaColors = {
    Cível: 'blue',
    Criminal: 'red',
    Trabalhista: 'green',
    Família: 'purple',
    Previdenciário: 'orange',
    Tributário: 'yellow',
    Administrativo: 'gray',
  } as const

  if (isLoading) {
    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Número</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-8 bg-gray-200 rounded animate-pulse ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (folders.length === 0) {
    return (
      <div className="border rounded-lg p-8">
        <div className="text-center">
          <p className="text-gray-500">Nenhuma pasta encontrada</p>
          <p className="text-sm text-gray-400 mt-1">
            Tente ajustar os filtros ou adicione uma nova pasta
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Número</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Área</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {folders.map((folder) => (
            <TableRow key={folder.id} className="group">
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onToggleFavorite?.(folder.id)}
                >
                  {folder.isFavorite ? (
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ) : (
                    <StarOff className="h-4 w-4 text-gray-400 group-hover:text-yellow-400" />
                  )}
                </Button>
              </TableCell>
              <TableCell className="font-medium">
                <Link
                  href={`/folders/${folder.id}`}
                  className="hover:text-primary transition-colors"
                >
                  {folder.number}
                </Link>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{folder.client.name}</p>
                  <p className="text-xs text-gray-500">{folder.client.cpf || folder.client.cnpj}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    'border-transparent',
                    folder.area in areaColors &&
                      `bg-${areaColors[folder.area as keyof typeof areaColors]}-100 text-${areaColors[folder.area as keyof typeof areaColors]}-800`
                  )}
                >
                  {folder.area}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={statusColors[folder.status as keyof typeof statusColors] || 'default'}
                >
                  {folder.status}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(folder.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/folders/${folder.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/folders/${folder.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onArchive?.(folder.id)}>
                      <Archive className="mr-2 h-4 w-4" />
                      Arquivar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
