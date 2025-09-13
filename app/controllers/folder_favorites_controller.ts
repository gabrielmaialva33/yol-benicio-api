import type { HttpContext } from '@adonisjs/core/http'
import FolderFavoriteService from '#services/folder_favorite_service'

export default class FolderFavoritesController {
  private folderFavoriteService = new FolderFavoriteService()

  async index({ response, auth }: HttpContext) {
    const user = auth.user!
    const favorites = await this.folderFavoriteService.getFavoriteFolders(user.id)
    return response.ok(favorites)
  }

  async toggle({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const folderId = params.id

    const result = await this.folderFavoriteService.toggleFavorite(user.id, folderId)
    return response.ok(result)
  }

  async store({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const folderId = params.id

    await this.folderFavoriteService.addFavorite(user.id, folderId)
    return response.created({ message: 'Folder added to favorites' })
  }

  async destroy({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const folderId = params.id

    await this.folderFavoriteService.removeFavorite(user.id, folderId)
    return response.ok({ message: 'Folder removed from favorites' })
  }

  async check({ params, response, auth }: HttpContext) {
    const user = auth.user!
    const folderId = params.id

    const isFavorite = await this.folderFavoriteService.isFavorite(user.id, folderId)
    return response.ok({ isFavorite })
  }

  async bulkToggle({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const folderIds = request.input('folderIds', [])

    const result = await this.folderFavoriteService.bulkToggleFavorites(user.id, folderIds)
    return response.ok(result)
  }
}
