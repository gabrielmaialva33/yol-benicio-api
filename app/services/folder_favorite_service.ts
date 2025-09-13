import FolderFavorite from '#modules/folder/models/folder_favorite'
import db from '@adonisjs/lucid/services/db'

export default class FolderFavoriteService {
  async getFavoriteFolders(userId: number) {
    const favorites = await FolderFavorite.query()
      .where('userId', userId)
      .preload('folder')
      .orderBy('createdAt', 'desc')

    return favorites.map((favorite) => favorite.folder)
  }

  async toggleFavorite(userId: number, folderId: number) {
    const existingFavorite = await FolderFavorite.query()
      .where('userId', userId)
      .where('folderId', folderId)
      .first()

    if (existingFavorite) {
      await existingFavorite.delete()
      return { action: 'removed', isFavorite: false }
    } else {
      await FolderFavorite.create({
        userId,
        folderId,
      })
      return { action: 'added', isFavorite: true }
    }
  }

  async isFavorite(userId: number, folderId: number) {
    const favorite = await FolderFavorite.query()
      .where('userId', userId)
      .where('folderId', folderId)
      .first()

    return !!favorite
  }

  async addFavorite(userId: number, folderId: number) {
    const existingFavorite = await FolderFavorite.query()
      .where('userId', userId)
      .where('folderId', folderId)
      .first()

    if (existingFavorite) {
      return existingFavorite
    }

    const favorite = await FolderFavorite.create({
      userId,
      folderId,
    })

    return favorite
  }

  async removeFavorite(userId: number, folderId: number) {
    const favorite = await FolderFavorite.query()
      .where('userId', userId)
      .where('folderId', folderId)
      .first()

    if (favorite) {
      await favorite.delete()
    }
  }

  async getFavoriteFolderIds(userId: number) {
    const favorites = await FolderFavorite.query().where('userId', userId).select('folderId')

    return favorites.map((favorite) => favorite.folderId)
  }

  async bulkToggleFavorites(userId: number, folderIds: number[]) {
    const trx = await db.transaction()

    try {
      const existingFavorites = await FolderFavorite.query({ client: trx })
        .where('userId', userId)
        .whereIn('folderId', folderIds)

      const existingFolderIds = existingFavorites.map((f) => f.folderId)
      const toAdd = folderIds.filter((id) => !existingFolderIds.includes(id))
      const toRemove = existingFolderIds

      if (toRemove.length > 0) {
        await FolderFavorite.query({ client: trx })
          .where('userId', userId)
          .whereIn('folderId', toRemove)
          .delete()
      }

      if (toAdd.length > 0) {
        const favoritesToAdd = toAdd.map((folderId) => ({
          userId,
          folderId,
        }))
        await FolderFavorite.createMany(favoritesToAdd, { client: trx })
      }

      await trx.commit()

      return {
        added: toAdd,
        removed: toRemove,
      }
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
