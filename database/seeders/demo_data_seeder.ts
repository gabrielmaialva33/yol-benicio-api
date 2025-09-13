import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#modules/user/models/user'
import Role from '#modules/role/models/role'
import Permission from '#modules/permission/models/permission'
import Message from '#modules/message/models/message'
import Notification from '#modules/notification/models/notification'
import FolderFavorite from '#modules/folder/models/folder_favorite'
import { UserFactory } from '../factories/user_factory.js'
import { ClientFactory } from '../factories/client_factory.js'
import { FolderFactory } from '../factories/folder_factory.js'
import { TaskFactory } from '../factories/task_factory.js'
import { HearingFactory } from '../factories/hearing_factory.js'

export default class extends BaseSeeder {
  async run() {
    // Ensure admin user has proper permissions
    const admin = await User.findBy('email', 'admin@benicio.com.br')
    if (!admin) {
      console.log('Admin user not found, creating...')
      await UserFactory.apply('admin').create()
    }

    // Ensure admin role exists and has all permissions
    let adminRole = await Role.findBy('slug', 'admin')
    if (!adminRole) {
      adminRole = await Role.create({
        name: 'admin',
        slug: 'admin',
        description: 'Acesso total ao sistema',
      })
    }

    // Grant all permissions to admin role
    const allPermissions = await Permission.all()
    if (allPermissions.length > 0) {
      const permissionIds = allPermissions.map(p => p.id)
      await adminRole.related('permissions').sync(permissionIds)
    }

    // Attach admin role to admin user
    if (admin) {
      await admin.related('roles').sync([adminRole.id])
    }

    // Create sample users with roles
    const lawyers = await UserFactory.apply('lawyer').createMany(3)
    const secretaries = await UserFactory.apply('secretary').createMany(2)
    const interns = await UserFactory.apply('intern').createMany(2)

    // Create sample clients
    const clients = await ClientFactory.createMany(20)

    // Create sample folders with relationships
    const folders = await FolderFactory.createMany(30)

    // Assign random clients to folders
    for (const folder of folders) {
      const randomClient = clients[Math.floor(Math.random() * clients.length)]
      folder.client_id = randomClient.id
      await folder.save()
    }

    // Create tasks for some folders
    for (let i = 0; i < 15; i++) {
      const randomFolder = folders[Math.floor(Math.random() * folders.length)]
      const randomUser = [...lawyers, ...secretaries, ...interns][
        Math.floor(Math.random() * (lawyers.length + secretaries.length + interns.length))
      ]

      await TaskFactory.merge({
        folder_id: randomFolder.id,
        assignee_id: randomUser.id,
        creator_id: admin?.id || randomUser.id,
      }).create()
    }

    // Create hearings for some folders
    for (let i = 0; i < 10; i++) {
      const randomFolder = folders[Math.floor(Math.random() * folders.length)]
      const randomUser = [...lawyers, ...secretaries][
        Math.floor(Math.random() * (lawyers.length + secretaries.length))
      ]

      await HearingFactory.merge({
        folder_id: randomFolder.id,
        creator_id: admin?.id || randomUser.id,
        assignee_id: randomUser.id,
      }).create()
    }

    // Create favorite folders for admin
    if (admin) {
      const favoriteFolders = folders.slice(0, 5)
      for (const folder of favoriteFolders) {
        await FolderFavorite.create({
          userId: admin.id,
          folderId: folder.id,
        })
      }
    }

    // Create sample messages for admin
    if (admin) {
      const messageTemplates = [
        {
          subject: 'Novo processo judicial recebido',
          body: 'Foi protocolado um novo processo judicial que requer sua análise urgente. O prazo para manifestação é de 15 dias.',
          priority: 'high' as const,
        },
        {
          subject: 'Audiência reagendada',
          body: 'A audiência do processo 2024.123.456-7 foi reagendada para o dia 20/01/2025 às 14h30.',
          priority: 'normal' as const,
        },
        {
          subject: 'Prazo processual se aproximando',
          body: 'Atenção: O prazo para apresentação de defesa no processo 2024.789.012-3 termina em 3 dias úteis.',
          priority: 'high' as const,
        },
        {
          subject: 'Documentos pendentes de assinatura',
          body: 'Existem 5 documentos aguardando sua assinatura digital no sistema.',
          priority: 'normal' as const,
        },
        {
          subject: 'Relatório mensal disponível',
          body: 'O relatório de atividades do mês anterior está disponível para visualização.',
          priority: 'low' as const,
        },
      ]

      for (const template of messageTemplates) {
        await Message.create({
          userId: admin.id,
          senderId: lawyers[0]?.id || null,
          ...template,
        })
      }
    }

    // Create sample notifications for admin
    if (admin) {
      const notificationTemplates = [
        {
          type: 'task' as const,
          title: 'Nova tarefa atribuída',
          message: 'Você tem uma nova tarefa para revisar os documentos do processo 2024.456.789-0.',
          actionUrl: '/tasks',
          actionText: 'Ver tarefa',
        },
        {
          type: 'hearing' as const,
          title: 'Audiência hoje às 15h',
          message: 'Audiência do processo 2024.789.012-3 agendada para hoje às 15h no 2º Fórum Cível.',
          actionUrl: '/hearings',
          actionText: 'Ver detalhes',
        },
        {
          type: 'deadline' as const,
          title: 'Prazo urgente',
          message: 'O prazo para o recurso do processo 2024.345.678-9 vence amanhã.',
          actionUrl: '/folders',
          actionText: 'Ver processo',
        },
        {
          type: 'success' as const,
          title: 'Processo concluído',
          message: 'O processo 2024.111.222-3 foi concluído com êxito.',
        },
        {
          type: 'warning' as const,
          title: 'Documentos pendentes',
          message: 'Há 3 documentos pendentes de assinatura no processo 2024.555.666-7.',
          actionUrl: '/documents',
          actionText: 'Assinar agora',
        },
        {
          type: 'info' as const,
          title: 'Nova jurisprudência',
          message: 'Foi publicada nova jurisprudência relevante para seus casos de direito trabalhista.',
          actionUrl: '/jurisprudence',
          actionText: 'Ler mais',
        },
        {
          type: 'error' as const,
          title: 'Falha no upload',
          message: 'O upload do documento no processo 2024.888.999-0 falhou. Por favor, tente novamente.',
          actionUrl: '/folders',
          actionText: 'Tentar novamente',
        },
      ]

      for (const template of notificationTemplates) {
        await Notification.create({
          userId: admin.id,
          ...template,
        })
      }
    }

    console.log('Demo data seeded successfully!')
    console.log('- Users created: ', lawyers.length + secretaries.length + interns.length + 1)
    console.log('- Clients created: ', clients.length)
    console.log('- Folders created: ', folders.length)
    console.log('- Tasks created: 15')
    console.log('- Hearings created: 10')
    console.log('- Messages created: 5')
    console.log('- Notifications created: 7')
  }
}