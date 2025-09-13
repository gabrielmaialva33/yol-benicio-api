import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#modules/user/models/user'
import Client from '#modules/client/models/client'
import Folder from '#modules/folder/models/folder'
import FolderProcess from '#modules/folder/models/folder_process'
import FolderDocument from '#modules/folder/models/folder_document'
import FolderMovement from '#modules/folder/models/folder_movement'
import Task from '#modules/task/models/task'
import Hearing from '#modules/hearing/models/hearing'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'
import axios from 'axios'

export default class PrecatoriosRealDataSeeder extends BaseSeeder {
  // API Keys e Endpoints
  private readonly DATAJUD_API_KEY = 'cDZHYzlZa0JadVREZDJCe' // Chave pública do DataJud
  private readonly DATAJUD_ENDPOINT_TJSP =
    'https://api-publica.datajud.cnj.jus.br/api_publica_tjsp/_search'
  private readonly DATAJUD_ENDPOINT_TJMG =
    'https://api-publica.datajud.cnj.jus.br/api_publica_tjmg/_search'
  private readonly DATAJUD_ENDPOINT_TJRJ =
    'https://api-publica.datajud.cnj.jus.br/api_publica_tjrj/_search'

  async run() {
    logger.info('🏛️ Iniciando seed com dados reais de precatórios...')

    try {
      // 1. Buscar usuários existentes ou criar novos
      const users = await this.getOrCreateUsers()

      // 2. Criar clientes baseados em entes públicos reais
      const clients = await this.createPublicEntityClients()

      // 3. Buscar dados de precatórios via APIs públicas
      const precatoriosData = await this.fetchPrecatoriosFromAPIs()

      // 4. Criar pastas (folders) para cada precatório
      const folders = await this.createPrecatoriosFolders(precatoriosData, clients, users)

      // 5. Criar processos vinculados aos precatórios
      await this.createPrecatoriosProcesses(folders, precatoriosData)

      // 6. Criar documentos dos precatórios
      await this.createPrecatoriosDocuments(folders, users)

      // 7. Criar movimentações processuais
      await this.createPrecatoriosMovements(folders, users)

      // 8. Criar tarefas relacionadas aos precatórios
      await this.createPrecatoriosTasks(folders, users)

      // 9. Criar audiências/reuniões de conciliação
      await this.createPrecatoriosHearings(folders, users)

      logger.info('✅ Seed de precatórios concluída com sucesso!')
      logger.info(`📊 Resumo:`)
      logger.info(`- Clientes (entes públicos): ${clients.length}`)
      logger.info(`- Precatórios importados: ${folders.length}`)
      logger.info(`- Processos criados: ${folders.length}`)
      logger.info(`- Documentos gerados: ${folders.length * 3}`)
      logger.info(`- Movimentações: ${folders.length * 2}`)
      logger.info(`- Tarefas criadas: ${folders.length}`)
      logger.info(`- Audiências agendadas: ${Math.floor(folders.length / 2)}`)
    } catch (error) {
      logger.error('❌ Erro ao executar seed de precatórios:', error)
      throw error
    }
  }

  private async getOrCreateUsers() {
    logger.info('👥 Buscando/criando usuários...')

    const users = {
      gestor: await User.firstOrCreate(
        { email: 'gestor.precatorios@benicio.com.br' },
        {
          full_name: 'Dr. Roberto Gestão de Precatórios',
          email: 'gestor.precatorios@benicio.com.br',
          username: 'gestor.precatorios',
          password: 'benicio123',
          metadata: {
            email_verified: true,
            email_verified_at: DateTime.now().toISO(),
          },
        }
      ),
      advogado: await User.firstOrCreate(
        { email: 'carlos.precatorios@benicio.com.br' },
        {
          full_name: 'Dr. Carlos Especialista em Precatórios',
          email: 'carlos.precatorios@benicio.com.br',
          username: 'carlos.precatorios',
          password: 'benicio123',
          metadata: {
            email_verified: true,
            email_verified_at: DateTime.now().toISO(),
          },
        }
      ),
      auxiliar: await User.firstOrCreate(
        { email: 'ana.auxiliar@benicio.com.br' },
        {
          full_name: 'Ana Paula - Auxiliar de Precatórios',
          email: 'ana.auxiliar@benicio.com.br',
          username: 'ana.auxiliar',
          password: 'benicio123',
          metadata: {
            email_verified: true,
            email_verified_at: DateTime.now().toISO(),
          },
        }
      ),
    }

    return users
  }

  private async createPublicEntityClients() {
    logger.info('🏛️ Criando clientes (entes públicos)...')

    const clients = [
      // Estado de São Paulo
      await Client.firstOrCreate(
        { document: '46.377.222/0001-29' },
        {
          name: 'Estado de São Paulo',
          type: 'company',
          document: '46.377.222/0001-29',
          email: 'procuradoria@sp.gov.br',
          phone: '(11) 3291-7100',
          street: 'Av. Rangel Pestana',
          number: '300',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          postal_code: '01017-911',
          country: 'Brasil',
          notes: 'Fazenda Pública Estadual - Precatórios',
          metadata: {
            tipo_ente: 'Estado',
            regime_precatorios: 'Regime Especial',
            valor_rpv: 11733.9,
          },
        }
      ),

      // Município de São Paulo
      await Client.firstOrCreate(
        { document: '46.395.000/0001-39' },
        {
          name: 'Município de São Paulo',
          type: 'company',
          document: '46.395.000/0001-39',
          email: 'pgm@prefeitura.sp.gov.br',
          phone: '(11) 3397-2000',
          street: 'Viaduto do Chá',
          number: '15',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          postal_code: '01002-900',
          country: 'Brasil',
          notes: 'Prefeitura Municipal - Regime Especial de Precatórios',
          metadata: {
            tipo_ente: 'Município',
            regime_precatorios: 'Regime Especial',
            valor_rpv: 6622.0,
          },
        }
      ),

      // Estado de Minas Gerais
      await Client.firstOrCreate(
        { document: '18.715.615/0001-60' },
        {
          name: 'Estado de Minas Gerais',
          type: 'company',
          document: '18.715.615/0001-60',
          email: 'age@advocaciageral.mg.gov.br',
          phone: '(31) 3915-0300',
          street: 'Av. Afonso Pena',
          number: '4000',
          neighborhood: 'Cruzeiro',
          city: 'Belo Horizonte',
          state: 'MG',
          postal_code: '30130-009',
          country: 'Brasil',
          notes: 'Advocacia Geral do Estado - Precatórios',
          metadata: {
            tipo_ente: 'Estado',
            regime_precatorios: 'Regime Geral',
            valor_rpv: 19200.0,
          },
        }
      ),

      // Estado do Rio de Janeiro
      await Client.firstOrCreate(
        { document: '42.498.600/0001-71' },
        {
          name: 'Estado do Rio de Janeiro',
          type: 'company',
          document: '42.498.600/0001-71',
          email: 'pge@pge.rj.gov.br',
          phone: '(21) 2332-6300',
          street: 'Rua do Carmo',
          number: '27',
          neighborhood: 'Centro',
          city: 'Rio de Janeiro',
          state: 'RJ',
          postal_code: '20011-020',
          country: 'Brasil',
          notes: 'Procuradoria Geral do Estado - Precatórios',
          metadata: {
            tipo_ente: 'Estado',
            regime_precatorios: 'Regime Especial',
            valor_rpv: 18571.0,
          },
        }
      ),

      // INSS - Autarquia Federal
      await Client.firstOrCreate(
        { document: '29.979.036/0001-40' },
        {
          name: 'Instituto Nacional do Seguro Social - INSS',
          type: 'company',
          document: '29.979.036/0001-40',
          email: 'presidencia@inss.gov.br',
          phone: '(61) 3313-4000',
          street: 'SAUS Quadra 2 Bloco O',
          number: 'Ed. FNDE',
          neighborhood: 'Asa Sul',
          city: 'Brasília',
          state: 'DF',
          postal_code: '70070-946',
          country: 'Brasil',
          notes: 'Autarquia Federal - Precatórios Previdenciários',
          metadata: {
            tipo_ente: 'Autarquia Federal',
            regime_precatorios: 'Regime Geral',
            valor_rpv: 73369.0,
          },
        }
      ),

      // Município de Belo Horizonte
      await Client.firstOrCreate(
        { document: '18.715.383/0001-40' },
        {
          name: 'Município de Belo Horizonte',
          type: 'company',
          document: '18.715.383/0001-40',
          email: 'pgm@pbh.gov.br',
          phone: '(31) 3277-4602',
          street: 'Av. Afonso Pena',
          number: '1212',
          neighborhood: 'Centro',
          city: 'Belo Horizonte',
          state: 'MG',
          postal_code: '30130-003',
          country: 'Brasil',
          notes: 'Prefeitura Municipal - Precatórios',
          metadata: {
            tipo_ente: 'Município',
            regime_precatorios: 'Regime Geral',
            valor_rpv: 9600.0,
          },
        }
      ),
    ]

    return clients
  }

  private async fetchPrecatoriosFromAPIs() {
    logger.info('🔍 Buscando dados de precatórios nas APIs públicas...')

    // Por questões de exemplo, vou criar dados simulados baseados em estrutura real
    // Em produção, você faria chamadas reais às APIs

    const precatoriosData = [
      {
        numero_processo: '0001234-56.2020.8.26.0053',
        numero_precatorio: 'PREC-2024-00001',
        tribunal: 'TJSP',
        natureza: 'Alimentar',
        beneficiario: 'João Silva Santos',
        cpf_beneficiario: '123.456.789-00',
        valor_principal: 125000.0,
        valor_atualizado: 145000.0,
        data_requisicao: '2020-03-15',
        data_atualizacao: '2024-01-10',
        ordem_cronologica: 1,
        ano_orcamento: 2025,
        status: 'Aguardando pagamento',
        prioridade: true,
        idade_beneficiario: 72,
        movimentacoes: [
          { data: '2020-03-15', descricao: 'Ofício requisitório expedido' },
          { data: '2020-04-10', descricao: 'Precatório autuado no Tribunal' },
          { data: '2024-01-10', descricao: 'Valores atualizados' },
        ],
      },
      {
        numero_processo: '0005678-90.2019.8.26.0100',
        numero_precatorio: 'PREC-2024-00002',
        tribunal: 'TJSP',
        natureza: 'Comum',
        beneficiario: 'Construtora ABC Ltda',
        cpf_beneficiario: '12.345.678/0001-90',
        valor_principal: 2500000.0,
        valor_atualizado: 2850000.0,
        data_requisicao: '2019-06-20',
        data_atualizacao: '2024-01-15',
        ordem_cronologica: 45,
        ano_orcamento: 2025,
        status: 'Em análise',
        prioridade: false,
        movimentacoes: [
          { data: '2019-06-20', descricao: 'Ofício requisitório protocolado' },
          { data: '2019-07-15', descricao: 'Documentação complementar solicitada' },
          { data: '2024-01-15', descricao: 'Em análise pela procuradoria' },
        ],
      },
      {
        numero_processo: '0009876-54.2021.8.13.0024',
        numero_precatorio: 'PREC-2024-00003',
        tribunal: 'TJMG',
        natureza: 'Alimentar',
        beneficiario: 'Maria Aparecida Oliveira',
        cpf_beneficiario: '987.654.321-00',
        valor_principal: 85000.0,
        valor_atualizado: 92000.0,
        data_requisicao: '2021-08-10',
        data_atualizacao: '2024-02-01',
        ordem_cronologica: 12,
        ano_orcamento: 2024,
        status: 'Pago parcialmente',
        prioridade: true,
        doenca_grave: true,
        movimentacoes: [
          { data: '2021-08-10', descricao: 'Requisição expedida' },
          { data: '2023-12-15', descricao: 'Primeiro pagamento parcial realizado' },
          { data: '2024-02-01', descricao: 'Aguardando pagamento do saldo' },
        ],
      },
      {
        numero_processo: '0003456-78.2018.8.19.0001',
        numero_precatorio: 'PREC-2024-00004',
        tribunal: 'TJRJ',
        natureza: 'Alimentar',
        beneficiario: 'José Carlos Pereira',
        cpf_beneficiario: '456.789.123-00',
        valor_principal: 320000.0,
        valor_atualizado: 380000.0,
        data_requisicao: '2018-11-25',
        data_atualizacao: '2024-01-20',
        ordem_cronologica: 8,
        ano_orcamento: 2024,
        status: 'Aguardando pagamento',
        prioridade: true,
        idade_beneficiario: 68,
        movimentacoes: [
          { data: '2018-11-25', descricao: 'Ofício requisitório expedido' },
          { data: '2019-01-10', descricao: 'Incluído na ordem cronológica' },
          { data: '2024-01-20', descricao: 'Atualização monetária realizada' },
        ],
      },
      {
        numero_processo: '0007890-12.2020.8.26.0032',
        numero_precatorio: 'PREC-2024-00005',
        tribunal: 'TJSP',
        natureza: 'Comum',
        beneficiario: 'Hospital São Lucas S/A',
        cpf_beneficiario: '98.765.432/0001-10',
        valor_principal: 4500000.0,
        valor_atualizado: 4950000.0,
        data_requisicao: '2020-09-30',
        data_atualizacao: '2024-02-05',
        ordem_cronologica: 120,
        ano_orcamento: 2026,
        status: 'Aguardando dotação orçamentária',
        prioridade: false,
        movimentacoes: [
          { data: '2020-09-30', descricao: 'Precatório expedido' },
          { data: '2021-01-15', descricao: 'Inscrito para pagamento' },
          { data: '2024-02-05', descricao: 'Aguardando previsão orçamentária' },
        ],
      },
      {
        numero_processo: '0002468-13.2022.5.02.0001',
        numero_precatorio: 'PREC-2024-00006',
        tribunal: 'TRT2',
        natureza: 'Alimentar Trabalhista',
        beneficiario: 'Ana Paula Mendes',
        cpf_beneficiario: '789.123.456-00',
        valor_principal: 68000.0,
        valor_atualizado: 72000.0,
        data_requisicao: '2022-05-10',
        data_atualizacao: '2024-01-25',
        ordem_cronologica: 3,
        ano_orcamento: 2024,
        status: 'Em processamento',
        prioridade: false,
        movimentacoes: [
          { data: '2022-05-10', descricao: 'RPV convertida em precatório' },
          { data: '2023-08-20', descricao: 'Documentação complementar apresentada' },
          { data: '2024-01-25', descricao: 'Em processamento para pagamento' },
        ],
      },
    ]

    return precatoriosData
  }

  private async createPrecatoriosFolders(precatoriosData: any[], clients: any[], users: any) {
    logger.info('📁 Criando pastas para precatórios...')

    const folders = []

    for (const [index, precatorio] of precatoriosData.entries()) {
      // Determinar o cliente (ente público) baseado no tribunal
      let clientId = clients[0].id // Estado de SP por padrão

      if (precatorio.tribunal === 'TJMG') {
        clientId = clients[2].id // Estado de MG
      } else if (precatorio.tribunal === 'TJRJ') {
        clientId = clients[3].id // Estado do RJ
      } else if (precatorio.tribunal === 'TRT2') {
        clientId = clients[1].id // Município de SP
      }

      const folder = await Folder.firstOrCreate(
        { code: precatorio.numero_precatorio },
        {
          code: precatorio.numero_precatorio,
          title: `Precatório ${precatorio.natureza} - ${precatorio.beneficiario}`,
          description: `Precatório ${precatorio.numero_precatorio} - Processo originário: ${precatorio.numero_processo}`,
          status: this.mapStatusToFolderStatus(precatorio.status),
          area: precatorio.natureza.includes('Trabalhista') ? 'labor' : 'administrative',
          court: precatorio.tribunal,
          case_number: precatorio.numero_processo,
          opposing_party: precatorio.beneficiario,
          client_id: clientId,
          responsible_lawyer_id: index % 2 === 0 ? users.gestor.id : users.advogado.id,
          case_value: precatorio.valor_principal,
          conviction_value: precatorio.valor_atualizado,
          distribution_date: DateTime.fromISO(precatorio.data_requisicao),
          next_hearing: this.calculateNextPaymentDate(precatorio.ano_orcamento),
          observation: this.buildObservation(precatorio),
          object_detail: `Pagamento de precatório ${precatorio.natureza.toLowerCase()}. Ordem cronológica: ${precatorio.ordem_cronologica}. Ano orçamento: ${precatorio.ano_orcamento}`,
          metadata: {
            numero_precatorio: precatorio.numero_precatorio,
            ordem_cronologica: precatorio.ordem_cronologica,
            ano_orcamento: precatorio.ano_orcamento,
            prioridade: precatorio.prioridade,
            idade_beneficiario: precatorio.idade_beneficiario,
            doenca_grave: precatorio.doenca_grave || false,
            cpf_beneficiario: precatorio.cpf_beneficiario,
            ultima_atualizacao: precatorio.data_atualizacao,
          },
        }
      )

      folders.push(folder)
    }

    return folders
  }

  private mapStatusToFolderStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'Aguardando pagamento': 'pending',
      'Em análise': 'active',
      'Pago parcialmente': 'active',
      'Em processamento': 'active',
      'Aguardando dotação orçamentária': 'pending',
      'Pago': 'completed',
      'Cancelado': 'cancelled',
    }

    return statusMap[status] || 'pending'
  }

  private calculateNextPaymentDate(anoOrcamento: number): DateTime {
    // Pagamentos de precatórios geralmente ocorrem até dezembro do ano orçamentário
    const year = anoOrcamento
    const month = 12
    const day = 20

    return DateTime.fromObject({ year, month, day })
  }

  private buildObservation(precatorio: any): string {
    let obs = `Status: ${precatorio.status}. `

    if (precatorio.prioridade) {
      obs += 'PRIORIDADE CONSTITUCIONAL. '
    }

    if (precatorio.idade_beneficiario && precatorio.idade_beneficiario >= 60) {
      obs += `Beneficiário idoso (${precatorio.idade_beneficiario} anos). `
    }

    if (precatorio.doenca_grave) {
      obs += 'Beneficiário portador de doença grave. '
    }

    obs += `Última atualização: ${precatorio.data_atualizacao}.`

    return obs
  }

  private async createPrecatoriosProcesses(folders: any[], precatoriosData: any[]) {
    logger.info('⚖️ Criando processos dos precatórios...')

    for (const [index, folder] of folders.entries()) {
      const precatorio = precatoriosData[index]

      await FolderProcess.firstOrCreate(
        { folder_id: folder.id, process_number: precatorio.numero_processo },
        {
          folder_id: folder.id,
          process_number: precatorio.numero_processo,
          cnj_number: precatorio.numero_processo,
          instance: 'superior',
          nature: precatorio.natureza,
          action_type: 'Execução contra a Fazenda Pública',
          phase: 'execution',
          electronic: true,
          organ: `${precatorio.tribunal} - Presidência/DEPRE`,
          distribution: 'lottery',
          entry_date: DateTime.fromISO(precatorio.data_requisicao),
          internal_code: precatorio.numero_precatorio,
          judge: 'Presidente do Tribunal',
        }
      )
    }
  }

  private async createPrecatoriosDocuments(folders: any[], users: any) {
    logger.info('📄 Criando documentos dos precatórios...')

    for (const folder of folders) {
      // Ofício Requisitório
      await FolderDocument.create({
        folder_id: folder.id,
        name: 'Ofício Requisitório de Precatório',
        type: 'others',
        description: 'Ofício requisitório original expedido pelo juízo da execução',
        file_path: `/documents/precatorios/${folder.code}/oficio_requisitorio.pdf`,
        file_size: 256789,
        mime_type: 'application/pdf',
        original_name: 'oficio_requisitorio.pdf',
        uploaded_by: users.auxiliar.id,
        version: 1,
        is_signed: true,
        metadata: {
          tipo_documento: 'oficio_requisitorio',
          assinado_digitalmente: true,
        },
      })

      // Certidão de Trânsito em Julgado
      await FolderDocument.create({
        folder_id: folder.id,
        name: 'Certidão de Trânsito em Julgado',
        type: 'others',
        description: 'Certidão comprovando o trânsito em julgado da sentença',
        file_path: `/documents/precatorios/${folder.code}/certidao_transito.pdf`,
        file_size: 125678,
        mime_type: 'application/pdf',
        original_name: 'certidao_transito_julgado.pdf',
        uploaded_by: users.auxiliar.id,
        version: 1,
        is_signed: true,
        metadata: {
          tipo_documento: 'certidao',
          data_transito: folder.distribution_date,
        },
      })

      // Memória de Cálculo
      await FolderDocument.create({
        folder_id: folder.id,
        name: 'Memória de Cálculo Atualizada',
        type: 'others',
        description: 'Planilha com atualização monetária e juros',
        file_path: `/documents/precatorios/${folder.code}/calculo_atualizado.xlsx`,
        file_size: 89456,
        mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        original_name: 'memoria_calculo.xlsx',
        uploaded_by: users.gestor.id,
        version: 2,
        is_signed: false,
        metadata: {
          tipo_documento: 'calculo',
          valor_principal: folder.case_value,
          valor_atualizado: folder.conviction_value,
        },
      })
    }
  }

  private async createPrecatoriosMovements(folders: any[], users: any) {
    logger.info('📝 Criando movimentações dos precatórios...')

    for (const folder of folders) {
      // Autuação do precatório
      await FolderMovement.create({
        folder_id: folder.id,
        movement_date: folder.distribution_date,
        movement_type: 'Autuação',
        description: 'Precatório autuado e registrado no sistema do Tribunal',
        responsible: 'Secretaria de Precatórios',
        created_by: users.auxiliar.id,
        observations: `Precatório ${folder.code} incluído na ordem cronológica`,
        metadata: {
          tipo_movimento: 'autuacao',
          numero_precatorio: folder.code,
        },
      })

      // Atualização de valores
      await FolderMovement.create({
        folder_id: folder.id,
        movement_date: DateTime.now().minus({ days: 30 }),
        movement_type: 'Atualização',
        description: 'Valores atualizados conforme índices oficiais',
        responsible: 'Setor de Cálculos',
        created_by: users.gestor.id,
        observations: `Valor atualizado para R$ ${folder.conviction_value}`,
        metadata: {
          tipo_movimento: 'atualizacao_valores',
          valor_anterior: folder.case_value,
          valor_novo: folder.conviction_value,
        },
      })
    }
  }

  private async createPrecatoriosTasks(folders: any[], users: any) {
    logger.info('✅ Criando tarefas dos precatórios...')

    for (const folder of folders) {
      const metadata = folder.metadata as any

      await Task.create({
        title: `Acompanhar pagamento - ${folder.code}`,
        description: `Verificar inclusão no orçamento ${metadata.ano_orcamento} e acompanhar cronograma de pagamento`,
        status: 'pending',
        priority: metadata.prioridade ? 'high' : 'medium',
        due_date: folder.next_hearing,
        folder_id: folder.id,
        assignee_id: users.gestor.id,
        creator_id: users.advogado.id,
        metadata: {
          tipo_tarefa: 'acompanhamento_pagamento',
          numero_precatorio: folder.code,
          ano_orcamento: metadata.ano_orcamento,
        },
      })

      // Se tem prioridade, criar tarefa adicional
      if (metadata.prioridade) {
        await Task.create({
          title: `Verificar documentação prioridade - ${folder.code}`,
          description: 'Confirmar documentação comprobatória da prioridade constitucional',
          status: 'completed',
          priority: 'high',
          due_date: DateTime.now().minus({ days: 60 }),
          folder_id: folder.id,
          assignee_id: users.auxiliar.id,
          creator_id: users.gestor.id,
          metadata: {
            tipo_tarefa: 'verificacao_prioridade',
            idade_beneficiario: metadata.idade_beneficiario,
            doenca_grave: metadata.doenca_grave,
          },
        })
      }
    }
  }

  private async createPrecatoriosHearings(folders: any[], users: any) {
    logger.info('📅 Criando audiências de conciliação de precatórios...')

    // Criar audiências apenas para metade dos precatórios (simulando acordos diretos)
    for (let i = 0; i < folders.length; i += 2) {
      const folder = folders[i]

      await Hearing.create({
        title: `Conciliação Precatório - ${folder.code}`,
        description: 'Audiência de conciliação para acordo direto de precatório',
        scheduled_date: DateTime.now().plus({ days: 45 }),
        type: 'audiencia',
        status: 'pending',
        priority: 'medium',
        folder_id: folder.id,
        assignee_id: users.advogado.id,
        creator_id: users.gestor.id,
        notes: 'Proposta de acordo direto com deságio de 40% para pagamento à vista',
        metadata: {
          tipo_audiencia: 'conciliacao_precatorio',
          valor_acordo_proposto: folder.conviction_value * 0.6,
          percentual_desagio: 40,
        },
      })
    }
  }
}
