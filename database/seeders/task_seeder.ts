import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Task from '#modules/task/models/task'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    // Create sample tasks for testing
    await Task.createMany([
      {
        title: 'Revisar contrato de prestação de serviços',
        description: 'Análise detalhada do contrato antes da assinatura',
        status: 'pending',
        priority: 'high',
        due_date: DateTime.now().plus({ days: 3 }),
        creator_id: 1,
      },
      {
        title: 'Preparar petição inicial',
        description: 'Elaborar petição para processo trabalhista',
        status: 'in_progress',
        priority: 'urgent',
        due_date: DateTime.now().plus({ days: 1 }),
        creator_id: 1,
      },
      {
        title: 'Audiência de conciliação',
        description: 'Participar da audiência no TRT',
        status: 'pending',
        priority: 'medium',
        due_date: DateTime.now().plus({ days: 7 }),
        creator_id: 1,
      },
      {
        title: 'Análise de jurisprudência',
        description: 'Pesquisar precedentes para o caso',
        status: 'completed',
        priority: 'low',
        due_date: DateTime.now().minus({ days: 1 }),
        creator_id: 1,
      },
      {
        title: 'Elaborar parecer jurídico',
        description: 'Parecer sobre questão tributária',
        status: 'pending',
        priority: 'medium',
        due_date: DateTime.now().plus({ days: 5 }),
        creator_id: 1,
      },
      {
        title: 'Reunião com cliente',
        description: 'Apresentar estratégia processual',
        status: 'completed',
        priority: 'high',
        due_date: DateTime.now().startOf('day'),
        creator_id: 1,
      },
    ])
  }
}
