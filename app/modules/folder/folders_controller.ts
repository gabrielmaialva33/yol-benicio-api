import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import FolderService from './folder_service.js'

@inject()
export default class FoldersController {
  constructor(private folderService: FolderService) {}

  /**
   * Show folders consultation page with filters and pagination
   */
  async consultation({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('per_page', 10)
    const sortBy = request.input('sort_by', 'created_at')
    const order = request.input('order', 'desc')
    const search = request.input('search', '')
    const clientNumber = request.input('client_number', '')
    const area = request.input('area', '')
    const status = request.input('status', '')
    const dateFrom = request.input('date_from', '')
    const dateTo = request.input('date_to', '')

    const filters = {
      clientNumber,
      dateRange: dateFrom && dateTo ? `${dateFrom} to ${dateTo}` : '',
      area: area || 'Total',
      status: status || 'Total',
      search,
      page,
      per_page: perPage,
      sort_by: sortBy,
      order,
    }

    const folders = await this.folderService.paginate({
      page,
      perPage,
      sortBy,
      order,
      search,
      clientNumber,
      area,
      status,
      dateFrom,
      dateTo,
    })

    return inertia.render('folders/consultation', {
      folders,
      filters,
    })
  }

  /**
   * Show specific folder details
   */
  async show({ params, inertia }: HttpContext) {
    const folder = await this.folderService.findOrFail(params.id)

    return inertia.render('folders/show', {
      folder,
    })
  }

  /**
   * Show folder registration form
   */
  async register({ inertia }: HttpContext) {
    return inertia.render('folders/register')
  }

  /**
   * Create a new folder
   */
  async store({ request, response, session }: HttpContext) {
    const data = request.only([
      'code',
      'title',
      'description',
      'status',
      'area',
      'court',
      'case_number',
      'opposing_party',
      'client_id',
      'responsible_lawyer_id',
    ])

    try {
      const folder = await this.folderService.create(data)

      session.flash('success', 'Pasta criada com sucesso!')
      return response.redirect().toRoute('folders.show', { id: folder.id })
    } catch (error) {
      session.flash('error', 'Erro ao criar pasta.')
      return response.redirect().back()
    }
  }

  /**
   * Update folder
   */
  async update({ params, request, response, session }: HttpContext) {
    const data = request.only([
      'code',
      'title',
      'description',
      'status',
      'area',
      'court',
      'case_number',
      'opposing_party',
      'client_id',
      'responsible_lawyer_id',
    ])

    try {
      const folder = await this.folderService.update(params.id, data)

      session.flash('success', 'Pasta atualizada com sucesso!')
      return response.redirect().toRoute('folders.show', { id: folder.id })
    } catch (error) {
      session.flash('error', 'Erro ao atualizar pasta.')
      return response.redirect().back()
    }
  }

  /**
   * Delete folder
   */
  async destroy({ params, response, session }: HttpContext) {
    try {
      await this.folderService.delete(params.id)

      session.flash('success', 'Pasta excluída com sucesso!')
      return response.redirect().toRoute('folders.consultation')
    } catch (error) {
      session.flash('error', 'Erro ao excluir pasta.')
      return response.redirect().back()
    }
  }
}
