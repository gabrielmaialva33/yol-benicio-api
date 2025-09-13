import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#modules/user/models/user'
import Role from '#modules/role/models/role'
import Permission from '#modules/permission/models/permission'
import Client from '#modules/client/models/client'
import Folder from '#modules/folder/models/folder'
import Task from '#modules/task/models/task'
import Hearing from '#modules/hearing/models/hearing'
import Message from '#modules/message/models/message'
import Notification from '#modules/notification/models/notification'
import FolderFavorite from '#modules/folder/models/folder_favorite'
import FolderProcess from '#modules/folder/models/folder_process'
import FolderDocument from '#modules/folder/models/folder_document'
import FolderMovement from '#modules/folder/models/folder_movement'
import File from '#modules/file/models/file'
import AuditLog from '#modules/audit/models/audit_log'
import IRole from '#modules/role/interfaces/role_interface'
import Database from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    logger.info('🚀 Starting realistic data seeder based on Benício Advogados cases...')

    // ============================
    // 1. Create Roles
    // ============================
    const adminRole = await Role.firstOrCreate(
      { slug: IRole.Slugs.ADMIN },
      {
        name: 'Administrator',
        slug: IRole.Slugs.ADMIN,
        description: 'Full system access',
      }
    )

    const lawyerRole = await Role.firstOrCreate(
      { slug: IRole.Slugs.LAWYER },
      {
        name: 'Lawyer',
        slug: IRole.Slugs.LAWYER,
        description: 'Access to lawyer functionalities',
      }
    )

    const secretaryRole = await Role.firstOrCreate(
      { slug: IRole.Slugs.SECRETARY },
      {
        name: 'Secretary',
        slug: IRole.Slugs.SECRETARY,
        description: 'Access to administrative functionalities',
      }
    )

    const internRole = await Role.firstOrCreate(
      { slug: IRole.Slugs.INTERN },
      {
        name: 'Intern',
        slug: IRole.Slugs.INTERN,
        description: 'Limited access for interns',
      }
    )

    // ============================
    // 1.5. Create Enhanced Legal-Specific Permissions
    // ============================
    logger.info('📋 Creating enhanced legal-specific permissions...')
    await this.createLegalPermissions()

    // Grant all permissions to admin role
    const allPermissions = await Permission.all()
    if (allPermissions.length > 0) {
      await adminRole.related('permissions').sync(allPermissions.map((p) => p.id))
    }

    // ============================
    // 2. Create Users (Based on real Benício team structure)
    // ============================
    const users = {
      admin: await User.firstOrCreate(
        { email: 'admin@benicio.com.br' },
        {
          full_name: 'Administrador do Sistema',
          email: 'admin@benicio.com.br',
          username: 'admin',
          password: 'benicio123',
          metadata: {
            email_verified: true,
            email_verification_token: null,
            email_verification_sent_at: null,
            email_verified_at: DateTime.now().toISO(),
          },
        }
      ),

      // Senior Partners
      benicio: await User.firstOrCreate(
        { email: 'benedicto.benicio@benicio.com.br' },
        {
          full_name: 'Dr. Benedicto Celso Benício',
          email: 'benedicto.benicio@benicio.com.br',
          username: 'benedicto.benicio',
          password: 'benicio123',
          metadata: {
            email_verified: true,
            email_verification_token: null,
            email_verification_sent_at: null,
            email_verified_at: DateTime.now().toISO(),
          },
        }
      ),

      // Lawyers mentioned in the research
      andre: await User.firstOrCreate(
        { email: 'andre.camara@benicio.com.br' },
        {
          full_name: 'Dr. André Câmara',
          email: 'andre.camara@benicio.com.br',
          username: 'andre.camara',
          password: 'benicio123',
          metadata: {
            email_verified: true,
            email_verification_token: null,
            email_verification_sent_at: null,
            email_verified_at: DateTime.now().toISO(),
          },
        }
      ),

      marcos: await User.firstOrCreate(
        { email: 'marcos.lemos@benicio.com.br' },
        {
          full_name: 'Dr. Marcos Lemos',
          email: 'marcos.lemos@benicio.com.br',
          username: 'marcos.lemos',
          password: 'benicio123',
          metadata: {
            email_verified: true,
            email_verification_token: null,
            email_verification_sent_at: null,
            email_verified_at: DateTime.now().toISO(),
          },
        }
      ),

      // Additional team members
      patricia: await User.firstOrCreate(
        { email: 'patricia.silva@benicio.com.br' },
        {
          full_name: 'Dra. Patrícia Silva',
          email: 'patricia.silva@benicio.com.br',
          username: 'patricia.silva',
          password: 'benicio123',
          metadata: {
            email_verified: true,
            email_verification_token: null,
            email_verification_sent_at: null,
            email_verified_at: DateTime.now().toISO(),
          },
        }
      ),

      // Secretaries
      mariana: await User.firstOrCreate(
        { email: 'mariana.costa@benicio.com.br' },
        {
          full_name: 'Mariana Costa',
          email: 'mariana.costa@benicio.com.br',
          username: 'mariana.costa',
          password: 'benicio123',
          metadata: {
            email_verified: true,
            email_verification_token: null,
            email_verification_sent_at: null,
            email_verified_at: DateTime.now().toISO(),
          },
        }
      ),

      fernanda: await User.firstOrCreate(
        { email: 'fernanda.santos@benicio.com.br' },
        {
          full_name: 'Fernanda Santos',
          email: 'fernanda.santos@benicio.com.br',
          username: 'fernanda.santos',
          password: 'benicio123',
          metadata: {
            email_verified: true,
            email_verification_token: null,
            email_verification_sent_at: null,
            email_verified_at: DateTime.now().toISO(),
          },
        }
      ),

      // Interns
      pedro: await User.firstOrCreate(
        { email: 'pedro.henrique@benicio.com.br' },
        {
          full_name: 'Pedro Henrique Oliveira',
          email: 'pedro.henrique@benicio.com.br',
          username: 'pedro.henrique',
          password: 'benicio123',
          metadata: {
            email_verified: true,
            email_verification_token: null,
            email_verification_sent_at: null,
            email_verified_at: DateTime.now().toISO(),
          },
        }
      ),

      julia: await User.firstOrCreate(
        { email: 'julia.martins@benicio.com.br' },
        {
          full_name: 'Julia Martins',
          email: 'julia.martins@benicio.com.br',
          username: 'julia.martins',
          password: 'benicio123',
          metadata: {
            email_verified: true,
            email_verification_token: null,
            email_verification_sent_at: null,
            email_verified_at: DateTime.now().toISO(),
          },
        }
      ),
    }

    // Assign roles to users
    await users.admin.related('roles').sync([adminRole.id])
    await users.benicio.related('roles').sync([lawyerRole.id])
    await users.andre.related('roles').sync([lawyerRole.id])
    await users.marcos.related('roles').sync([lawyerRole.id])
    await users.patricia.related('roles').sync([lawyerRole.id])
    await users.mariana.related('roles').sync([secretaryRole.id])
    await users.fernanda.related('roles').sync([secretaryRole.id])
    await users.pedro.related('roles').sync([internRole.id])
    await users.julia.related('roles').sync([internRole.id])

    // ============================
    // 3. Create Clients (Based on real case types)
    // ============================
    const clients = [
      await Client.firstOrCreate(
        { document: '00.416.968/0001-01' },
        {
          name: 'Banco Inter S.A.',
          type: 'company',
          document: '00.416.968/0001-01',
          email: 'juridico@bancointer.com.br',
          phone: '(31) 3003-4070',
          street: 'Av. Barbacena',
          number: '1219',
          neighborhood: 'Santo Agostinho',
          city: 'Belo Horizonte',
          state: 'MG',
          postal_code: '30190-131',
          country: 'Brasil',
          notes: 'Cliente de grande porte - Setor bancário digital',
          metadata: {
            sector: 'Financial Services',
            size: 'Large Enterprise',
            since: '2019',
          },
        }
      ),

      await Client.firstOrCreate(
        { document: '17.197.385/0001-21' },
        {
          name: 'Zurich Minas Brasil Seguros S.A.',
          type: 'company',
          document: '17.197.385/0001-21',
          email: 'juridico@zurich.com.br',
          phone: '(11) 3133-0000',
          street: 'Av. Jornalista Roberto Marinho',
          number: '85',
          neighborhood: 'Brooklin',
          city: 'São Paulo',
          state: 'SP',
          postal_code: '04576-010',
          country: 'Brasil',
          notes: 'Seguradora multinacional',
          metadata: {
            sector: 'Insurance',
            size: 'Large Enterprise',
            since: '2020',
          },
        }
      ),

      await Client.firstOrCreate(
        { document: '08.123.456/0001-99' },
        {
          name: 'Gallo Ferreira Comércio de Frutas Ltda',
          type: 'company',
          document: '08.123.456/0001-99',
          email: 'contato@galloferreira.com.br',
          phone: '(11) 4123-5678',
          street: 'CEAGESP - Pavilhão MLP',
          number: 'Box 123',
          neighborhood: 'Vila Leopoldina',
          city: 'São Paulo',
          state: 'SP',
          postal_code: '05429-000',
          country: 'Brasil',
          notes: 'Distribuidor de frutas - CEAGESP',
          metadata: {
            sector: 'Agriculture',
            size: 'Medium Enterprise',
            since: '2021',
          },
        }
      ),

      await Client.firstOrCreate(
        { document: '123.456.789-00' },
        {
          name: 'Carlos Ulisses Parente',
          type: 'individual',
          document: '123.456.789-00',
          email: 'carlos.parente@email.com',
          phone: '(21) 98765-4321',
          street: 'Rua Visconde de Pirajá',
          number: '550',
          complement: 'Apto 801',
          neighborhood: 'Ipanema',
          city: 'Rio de Janeiro',
          state: 'RJ',
          postal_code: '22410-002',
          country: 'Brasil',
          notes: 'Caso de conflito de competência - Barra da Tijuca',
          birthday: DateTime.fromISO('1975-03-15'),
          metadata: {
            profession: 'Empresário',
          },
        }
      ),

      await Client.firstOrCreate(
        { document: '15.789.456/0001-23' },
        {
          name: 'I.B.S. de Souza Muito+ Modas Eireli',
          type: 'company',
          document: '15.789.456/0001-23',
          email: 'contato@muitomais.com.br',
          phone: '(67) 3321-1234',
          street: 'Rua 14 de Julho',
          number: '2345',
          neighborhood: 'Centro',
          city: 'Campo Grande',
          state: 'MS',
          postal_code: '79002-333',
          country: 'Brasil',
          notes: 'Comércio varejista de vestuário',
          metadata: {
            sector: 'Retail',
            size: 'Small Enterprise',
            since: '2022',
          },
        }
      ),

      await Client.firstOrCreate(
        { document: '34.028.316/0001-03' },
        {
          name: 'Empresa Brasileira de Correios e Telégrafos',
          type: 'company',
          document: '34.028.316/0001-03',
          email: 'juridico@correios.com.br',
          phone: '(61) 3003-0100',
          street: 'SBN Quadra 1 Bloco A',
          number: 'Ed. Sede ECT',
          neighborhood: 'Asa Norte',
          city: 'Brasília',
          state: 'DF',
          postal_code: '70002-900',
          country: 'Brasil',
          notes: 'Empresa pública federal',
          metadata: {
            sector: 'Public Services',
            size: 'Large Enterprise',
            since: '2018',
          },
        }
      ),

      await Client.firstOrCreate(
        { document: '00.360.305/0001-04' },
        {
          name: 'Caixa Econômica Federal',
          type: 'company',
          document: '00.360.305/0001-04',
          email: 'juridico@caixa.gov.br',
          phone: '(61) 3206-9000',
          street: 'SBS Quadra 4 Bloco A',
          number: 'Lote 3/4',
          neighborhood: 'Asa Sul',
          city: 'Brasília',
          state: 'DF',
          postal_code: '70092-900',
          country: 'Brasil',
          notes: 'Banco público federal',
          metadata: {
            sector: 'Banking',
            size: 'Large Enterprise',
            since: '2017',
          },
        }
      ),

      await Client.firstOrCreate(
        { document: '987.654.321-00' },
        {
          name: 'Vanessa Cavalcanti Bizerra',
          type: 'individual',
          document: '987.654.321-00',
          email: 'vanessa.bizerra@email.com',
          phone: '(11) 97654-3210',
          street: 'Alameda Santos',
          number: '1234',
          complement: 'Sala 1502',
          neighborhood: 'Jardim Paulista',
          city: 'São Paulo',
          state: 'SP',
          postal_code: '01419-002',
          country: 'Brasil',
          notes: 'Ação trabalhista - Uso de veículo próprio',
          birthday: DateTime.fromISO('1985-07-22'),
          metadata: {
            profession: 'Consultora',
          },
        }
      ),
    ]

    logger.info(`✅ Created ${clients.length} clients`)

    // ============================
    // 4. Create Folders (Real cases based on research)
    // ============================
    const folders = [
      // Banco Inter - Crypto regulation case
      await Folder.firstOrCreate(
        { code: 'PROC-2024-001' },
        {
          code: 'PROC-2024-001',
          title: 'Banco Inter - Regulamentação Criptoativos BC',
          description:
            'Assessoria jurídica para adequação às novas normas do Banco Central sobre criptoativos - Consulta Pública 109/2024',
          status: 'active',
          area: 'corporate',
          court: 'Banco Central do Brasil',
          case_number: 'CP-109/2024',
          opposing_party: 'Banco Central do Brasil',
          client_id: clients[0].id, // Banco Inter
          responsible_lawyer_id: users.andre.id,
          case_value: 5000000.0,
          distribution_date: DateTime.fromISO('2024-01-15'),
          next_hearing: DateTime.fromISO('2025-02-20'),
          observation: 'Caso crítico - Primeira exchange a buscar autorização completa do BC',
          object_detail:
            'Adequação regulatória para operação como VASP (Virtual Asset Service Provider)',
          metadata: {
            priority: 'high',
            complexity: 'high',
            regulatory: true,
          },
        }
      ),

      // Zurich Seguros - Conflict case
      await Folder.firstOrCreate(
        { code: 'PROC-2024-002' },
        {
          code: 'PROC-2024-002',
          title: 'Zurich Seguros vs Carlos Parente - Conflito de Competência',
          description:
            'Conflito de competência entre 2ª Vara Cível da Barra da Tijuca e 5ª Vara de Jacarepaguá',
          status: 'active',
          area: 'civil_litigation',
          court: 'TJRJ - Tribunal de Justiça do Rio de Janeiro',
          case_number: '0838209-36.2024.8.19.0203',
          opposing_party: 'Carlos Ulisses Parente',
          client_id: clients[1].id, // Zurich
          responsible_lawyer_id: users.marcos.id,
          case_value: 850000.0,
          conviction_value: 425000.0,
          costs: 15000.0,
          fees: 85000.0,
          distribution_date: DateTime.fromISO('2024-03-10'),
          citation_date: DateTime.fromISO('2024-03-25'),
          next_hearing: DateTime.fromISO('2025-01-15'),
          observation: 'Aguardando decisão do relator Des. Luiz Umpierre',
          object_detail: 'Ação de cobrança de seguro - Sinistro veicular',
          metadata: {
            insurance_type: 'Auto',
            claim_number: 'ZUR-2024-0098',
          },
        }
      ),

      // Labor case - Vehicle usage
      await Folder.firstOrCreate(
        { code: 'PROC-2022-079' },
        {
          code: 'PROC-2022-079',
          title: 'Vanessa Bizerra vs I.B.S. Muito+ Modas - Uso Veículo Próprio',
          description:
            'Ação trabalhista - Indenização por uso de veículo particular para atividades empresariais',
          status: 'completed',
          area: 'labor',
          court: 'TRT24 - Tribunal Regional do Trabalho 24ª Região',
          case_number: '0024519-79.2022.5.24.0000',
          opposing_party: 'Vanessa Cavalcanti Bizerra',
          client_id: clients[4].id, // I.B.S. Muito+ Modas
          responsible_lawyer_id: users.marcos.id,
          case_value: 132690.0,
          conviction_value: 132690.0,
          costs: 5000.0,
          fees: 13269.0,
          distribution_date: DateTime.fromISO('2022-10-04'),
          citation_date: DateTime.fromISO('2022-10-20'),
          observation: 'Tese fixada: Uso de veículo próprio deve ser ressarcido pelo empregador',
          object_detail:
            'Ressarcimento por desgaste e depreciação de veículo usado em atividade empresarial',
          metadata: {
            result: 'unfavorable',
            appeal: 'pending',
          },
        }
      ),

      // CARF Tax case
      await Folder.firstOrCreate(
        { code: 'PROC-2016-033' },
        {
          code: 'PROC-2016-033',
          title: 'Caso CARF - Tráfico de Influência',
          description: 'Defesa em processo de corrupção e tráfico de influência no CARF',
          status: 'completed',
          area: 'criminal',
          court: 'Justiça Federal - 3ª Região',
          case_number: '0001234-56.2016.4.03.6100',
          opposing_party: 'Ministério Público Federal',
          client_id: clients[0].id,
          responsible_lawyer_id: users.benicio.id,
          case_value: 10000000.0,
          distribution_date: DateTime.fromISO('2016-05-03'),
          citation_date: DateTime.fromISO('2016-05-20'),
          observation: 'Caso de alta repercussão - Operação Zelotes',
          object_detail: 'Defesa contra acusações de tráfico de influência em julgamentos do CARF',
          metadata: {
            media_coverage: 'high',
            operation: 'Zelotes',
            result: 'acquitted',
          },
        }
      ),

      // Correios labor case
      await Folder.firstOrCreate(
        { code: 'PROC-2023-045' },
        {
          code: 'PROC-2023-045',
          title: 'ECT vs Adilson Santos - Ação Trabalhista',
          description: 'Defesa em reclamação trabalhista - Demissão por justa causa',
          status: 'active',
          area: 'labor',
          court: 'TRT2 - Tribunal Regional do Trabalho 2ª Região',
          case_number: '1000123-45.2023.5.02.0001',
          opposing_party: 'Adilson Santos Augusto',
          client_id: clients[5].id, // Correios
          responsible_lawyer_id: users.patricia.id,
          case_value: 245000.0,
          costs: 8000.0,
          fees: 24500.0,
          distribution_date: DateTime.fromISO('2023-06-15'),
          citation_date: DateTime.fromISO('2023-07-01'),
          next_hearing: DateTime.fromISO('2025-02-10'),
          observation: 'Contestação protocolada - Aguardando audiência de instrução',
          object_detail: 'Reversão de justa causa, verbas rescisórias e danos morais',
          metadata: {
            dismissal_reason: 'misconduct',
            employment_duration: '8 years',
          },
        }
      ),

      // Caixa Econômica - Real estate financing
      await Folder.firstOrCreate(
        { code: 'PROC-2024-067' },
        {
          code: 'PROC-2024-067',
          title: 'CEF - Execução Hipotecária Conjunto Residencial',
          description:
            'Execução de garantia hipotecária - Inadimplência em financiamento habitacional',
          status: 'active',
          area: 'real_estate',
          court: 'TJSP - 15ª Vara Cível Central',
          case_number: '1005678-90.2024.8.26.0100',
          opposing_party: 'Conjunto Residencial Vila Nova',
          client_id: clients[6].id, // Caixa
          responsible_lawyer_id: users.patricia.id,
          case_value: 2500000.0,
          costs: 25000.0,
          fees: 125000.0,
          distribution_date: DateTime.fromISO('2024-02-20'),
          citation_date: DateTime.fromISO('2024-03-05'),
          next_hearing: DateTime.fromISO('2025-01-25'),
          observation: 'Imóvel avaliado - Aguardando leilão judicial',
          object_detail: 'Execução de cédula de crédito imobiliário - 50 unidades habitacionais',
          metadata: {
            property_value: 2500000.0,
            units: 50,
            default_months: 18,
          },
        }
      ),

      // Gallo Ferreira - Commercial dispute
      await Folder.firstOrCreate(
        { code: 'PROC-2024-089' },
        {
          code: 'PROC-2024-089',
          title: 'Gallo Ferreira - Disputa Comercial CEAGESP',
          description: 'Ação de cobrança - Fornecimento de frutas não pago',
          status: 'active',
          area: 'civil_litigation',
          court: 'TJSP - 8ª Vara Cível Central',
          case_number: '1009876-54.2024.8.26.0100',
          opposing_party: 'Supermercados União Ltda',
          client_id: clients[2].id, // Gallo Ferreira
          responsible_lawyer_id: users.andre.id,
          case_value: 487000.0,
          costs: 10000.0,
          fees: 48700.0,
          distribution_date: DateTime.fromISO('2024-04-10'),
          citation_date: DateTime.fromISO('2024-04-25'),
          next_hearing: DateTime.fromISO('2025-02-05'),
          observation: 'Liminar deferida - Bloqueio de contas',
          object_detail: 'Cobrança por fornecimento de frutas - 6 meses de inadimplência',
          metadata: {
            product_type: 'Fresh Fruits',
            total_invoices: 24,
            unpaid_months: 6,
          },
        }
      ),

      // Regulatory - Open Finance
      await Folder.firstOrCreate(
        { code: 'PROC-2024-102' },
        {
          code: 'PROC-2024-102',
          title: 'Banco Inter - Implementação Open Finance',
          description: 'Assessoria regulatória para implementação de Open Finance e PIX',
          status: 'active',
          area: 'corporate',
          court: 'Banco Central do Brasil',
          case_number: 'REG-2024-0156',
          opposing_party: null,
          client_id: clients[0].id, // Banco Inter
          responsible_lawyer_id: users.andre.id,
          case_value: 3000000.0,
          fees: 300000.0,
          distribution_date: DateTime.fromISO('2024-05-01'),
          observation: 'Projeto estratégico - Fase 3 do Open Finance',
          object_detail:
            'Adequação completa aos requisitos do Open Finance e pagamentos instantâneos',
          metadata: {
            project_phase: 3,
            compliance_deadline: '2025-06-30',
            regulatory_framework: 'BCB Resolution 4.968/2021',
          },
        }
      ),
    ]

    logger.info(`✅ Created ${folders.length} folders`)

    // ============================
    // 5. Create Folder Processes
    // ============================
    const processes = [
      await FolderProcess.create({
        folder_id: folders[0].id,
        process_number: 'CP-109/2024-BCB',
        cnj_number: null,
        instance: 'first',
        nature: 'Administrativa',
        action_type: 'Consulta Pública Regulatória',
        phase: 'knowledge',
        electronic: true,
        organ: 'Banco Central do Brasil',
        distribution: 'lottery',
        entry_date: DateTime.fromISO('2024-01-15'),
        internal_code: 'INT-2024-001',
        judge: 'Otávio Damaso - Diretor de Regulação',
      }),

      await FolderProcess.create({
        folder_id: folders[1].id,
        process_number: '0838209-36.2024.8.19.0203',
        cnj_number: '0838209-36.2024.8.19.0203',
        instance: 'second',
        nature: 'Cível',
        action_type: 'Conflito de Competência',
        phase: 'appeal',
        electronic: true,
        organ: 'TJRJ - 21ª Câmara Cível',
        distribution: 'dependency',
        entry_date: DateTime.fromISO('2024-03-10'),
        internal_code: 'INT-2024-002',
        judge: 'Des. Luiz Umpierre de Mello Serra',
      }),

      await FolderProcess.create({
        folder_id: folders[2].id,
        process_number: '0024519-79.2022.5.24.0000',
        cnj_number: '0024519-79.2022.5.24.0000',
        instance: 'superior',
        nature: 'Trabalhista',
        action_type: 'Incidente de Uniformização de Jurisprudência',
        phase: 'appeal',
        electronic: true,
        organ: 'TRT24 - Tribunal Pleno',
        distribution: 'lottery',
        entry_date: DateTime.fromISO('2022-10-04'),
        internal_code: 'INT-2022-079',
        judge: 'Des. João Marcelo Balsanelli',
      }),
    ]

    logger.info(`✅ Created ${processes.length} folder processes`)

    // ============================
    // 6. Create Folder Documents
    // ============================
    const documents = [
      await FolderDocument.create({
        folder_id: folders[0].id,
        name: 'Parecer Técnico - Regulamentação Criptoativos',
        type: 'others',
        description: 'Análise completa das implicações da CP 109/2024',
        file_path: '/documents/2024/001/parecer_tecnico_crypto.pdf',
        file_size: 2456789,
        mime_type: 'application/pdf',
        original_name: 'parecer_tecnico_crypto.pdf',
        uploaded_by: users.andre.id,
        version: 3,
        is_signed: true,
        metadata: {
          pages: 127,
          confidential: true,
          document_type: 'legal_opinion',
        },
      }),

      await FolderDocument.create({
        folder_id: folders[1].id,
        name: 'Apólice de Seguro',
        type: 'contract',
        description: 'Contrato de seguro veicular - BMW X5',
        file_path: '/documents/2024/002/apolice_zurich.pdf',
        file_size: 856234,
        mime_type: 'application/pdf',
        original_name: 'apolice_zurich.pdf',
        uploaded_by: users.marcos.id,
        version: 1,
        is_signed: true,
        metadata: {
          policy_number: 'ZUR-AUTO-2023-98765',
          coverage: 'Comprehensive',
        },
      }),

      await FolderDocument.create({
        folder_id: folders[1].id,
        name: 'Laudo Pericial',
        type: 'others',
        description: 'Avaliação técnica do sinistro',
        file_path: '/documents/2024/002/laudo_pericial.pdf',
        file_size: 3567890,
        mime_type: 'application/pdf',
        original_name: 'laudo_pericial.pdf',
        uploaded_by: users.marcos.id,
        version: 1,
        is_signed: true,
        metadata: {
          expert: 'Eng. Roberto Silva - CREA/RJ 123456',
          conclusion: 'Total loss',
          document_type: 'expert_report',
        },
      }),

      await FolderDocument.create({
        folder_id: folders[2].id,
        name: 'Acórdão TRT24',
        type: 'decision',
        description: 'Decisão final - Tese sobre uso de veículo próprio',
        file_path: '/documents/2022/079/acordao_trt24.pdf',
        file_size: 1234567,
        mime_type: 'application/pdf',
        original_name: 'acordao_trt24.pdf',
        uploaded_by: users.marcos.id,
        version: 1,
        is_signed: true,
        metadata: {
          decision: 'Favorable to employee',
          votes: '8-0',
        },
      }),

      await FolderDocument.create({
        folder_id: folders[3].id,
        name: 'Petição Inicial - Defesa CARF',
        type: 'petition',
        description: 'Defesa inicial no caso de tráfico de influência',
        file_path: '/documents/2016/033/peticao_inicial_defesa.pdf',
        file_size: 987654,
        mime_type: 'application/pdf',
        original_name: 'peticao_inicial_defesa.pdf',
        uploaded_by: users.benicio.id,
        version: 1,
        is_signed: true,
        metadata: {
          pages: 89,
          confidential: true,
        },
      }),

      await FolderDocument.create({
        folder_id: folders[5].id,
        name: 'Cédula de Crédito Imobiliário',
        type: 'contract',
        description: 'CCI - Conjunto Residencial Vila Nova',
        file_path: '/documents/2024/067/cci_vila_nova.pdf',
        file_size: 4567890,
        mime_type: 'application/pdf',
        original_name: 'cci_vila_nova.pdf',
        uploaded_by: users.patricia.id,
        version: 1,
        is_signed: true,
        metadata: {
          contract_value: 2500000.0,
          units: 50,
          interest_rate: '8.5% a.a.',
        },
      }),
    ]

    logger.info(`✅ Created ${documents.length} folder documents`)

    // ============================
    // 7. Create Folder Movements
    // ============================
    const movements = [
      await FolderMovement.create({
        folder_id: folders[0].id,
        movement_date: DateTime.fromISO('2024-11-20'),
        movement_type: 'Protocolo',
        description: 'Protocolado parecer técnico sobre regulamentação de criptoativos',
        responsible: 'Dr. André Câmara',
        created_by: users.andre.id,
        observations: 'Parecer técnico completo com 127 páginas',
        metadata: {
          protocol_number: 'BCB-2024-789456',
        },
      }),

      await FolderMovement.create({
        folder_id: folders[1].id,
        movement_date: DateTime.fromISO('2024-12-15'),
        movement_type: 'Despacho',
        description: 'Autos conclusos para decisão do relator',
        responsible: 'Des. Luiz Umpierre de Mello Serra',
        created_by: users.marcos.id,
        observations: 'Aguardando decisão sobre conflito de competência',
        metadata: {
          expected_decision: '30 days',
        },
      }),

      await FolderMovement.create({
        folder_id: folders[2].id,
        movement_date: DateTime.fromISO('2023-04-03'),
        movement_type: 'Publicação',
        description: 'Publicado acórdão fixando tese sobre indenização por uso de veículo próprio',
        responsible: 'Tribunal Pleno TRT24',
        created_by: users.marcos.id,
        observations: 'Tese favorável ao empregado - precedente importante',
        metadata: {
          dj_edition: '2023/067',
        },
      }),

      await FolderMovement.create({
        folder_id: folders[5].id,
        movement_date: DateTime.fromISO('2024-11-10'),
        movement_type: 'Avaliação',
        description: 'Laudo de avaliação do imóvel protocolado',
        responsible: 'Perito Judicial',
        created_by: users.patricia.id,
        observations: 'Valor de avaliação acima do débito',
        metadata: {
          appraised_value: 2650000.0,
        },
      }),
    ]

    logger.info(`✅ Created ${movements.length} folder movements`)

    // ============================
    // 8. Create Tasks
    // ============================
    const tasks = [
      await Task.create({
        title: 'Preparar resposta à Consulta Pública BCB',
        description: 'Elaborar documento técnico respondendo aos questionamentos da CP 109/2024',
        status: 'in_progress',
        priority: 'high',
        due_date: DateTime.now().plus({ days: 7 }),
        folder_id: folders[0].id,
        assignee_id: users.andre.id,
        creator_id: users.benicio.id,
        metadata: {
          estimated_hours: 40,
          complexity: 'high',
        },
      }),

      await Task.create({
        title: 'Audiência de Conciliação - Caso Correios',
        description: 'Comparecer à audiência de conciliação no TRT2',
        status: 'pending',
        priority: 'high',
        due_date: DateTime.fromISO('2025-02-10'),
        folder_id: folders[4].id,
        assignee_id: users.patricia.id,
        creator_id: users.marcos.id,
        metadata: {
          location: 'TRT2 - Fórum Ruy Barbosa',
          time: '14:30',
        },
      }),

      await Task.create({
        title: 'Elaborar memorial para Des. Umpierre',
        description: 'Preparar memorial de julgamento para o conflito de competência',
        status: 'pending',
        priority: 'medium',
        due_date: DateTime.now().plus({ days: 15 }),
        folder_id: folders[1].id,
        assignee_id: users.marcos.id,
        creator_id: users.benicio.id,
        metadata: {
          pages_limit: 20,
        },
      }),

      await Task.create({
        title: 'Acompanhar leilão judicial - CEF',
        description: 'Participar do leilão judicial do Conjunto Residencial Vila Nova',
        status: 'pending',
        priority: 'high',
        due_date: DateTime.fromISO('2025-01-25'),
        folder_id: folders[5].id,
        assignee_id: users.patricia.id,
        creator_id: users.admin.id,
        metadata: {
          auction_platform: 'www.leiloesjudiciais.com.br',
          minimum_bid: 1750000.0,
        },
      }),

      await Task.create({
        title: 'Revisar contratos Open Finance',
        description: 'Análise final dos contratos de compartilhamento de dados',
        status: 'completed',
        priority: 'medium',
        due_date: DateTime.now().minus({ days: 5 }),
        folder_id: folders[7].id,
        assignee_id: users.andre.id,
        creator_id: users.benicio.id,
        metadata: {
          contracts_reviewed: 15,
        },
      }),

      await Task.create({
        title: 'Protocolar embargo de declaração',
        description: 'Preparar e protocolar embargos no caso de uso de veículo',
        status: 'completed',
        priority: 'high',
        due_date: DateTime.now().minus({ days: 30 }),
        folder_id: folders[2].id,
        assignee_id: users.marcos.id,
        creator_id: users.marcos.id,
        metadata: {
          protocol_number: 'TRT24-EMB-2023-4567',
        },
      }),
    ]

    logger.info(`✅ Created ${tasks.length} tasks`)

    // ============================
    // 9. Create Hearings
    // ============================
    const hearings = [
      await Hearing.create({
        title: 'Audiência de Instrução - Correios vs Adilson',
        description: 'Audiência de instrução e julgamento - TRT2',
        scheduled_date: DateTime.fromISO('2025-02-10T14:30:00'),
        type: 'audiencia',
        status: 'pending',
        priority: 'high',
        folder_id: folders[4].id,
        assignee_id: users.patricia.id,
        creator_id: users.marcos.id,
        notes:
          'Levar 3 testemunhas. Documentos já juntados aos autos. Local: TRT2 - Fórum Ruy Barbosa - Sala 405',
        metadata: {
          judge: 'Dr. Fernando Costa',
          witnesses: 3,
          estimated_duration: '2 hours',
        },
      }),

      await Hearing.create({
        title: 'Sessão de Julgamento - Conflito Competência Zurich',
        description: 'Sessão de julgamento do conflito de competência',
        scheduled_date: DateTime.fromISO('2025-01-15T10:00:00'),
        type: 'prazo_judicial',
        status: 'pending',
        priority: 'high',
        folder_id: folders[1].id,
        assignee_id: users.marcos.id,
        creator_id: users.benicio.id,
        notes: 'TJRJ - 21ª Câmara Cível - Sessão Virtual. Preparar sustentação oral em vídeo',
        metadata: {
          session_type: 'virtual',
          video_duration_limit: '15 minutes',
        },
      }),

      await Hearing.create({
        title: 'Leilão Judicial - Conjunto Residencial',
        description: 'Leilão judicial do imóvel penhorado',
        scheduled_date: DateTime.fromISO('2025-01-25T15:00:00'),
        type: 'prazo_fatal',
        status: 'pending',
        priority: 'urgent',
        folder_id: folders[5].id,
        assignee_id: users.patricia.id,
        creator_id: users.admin.id,
        notes:
          'Online - www.leiloesjudiciais.com.br. Primeiro leilão - Lance mínimo: 100% da avaliação',
        metadata: {
          auction_type: '1st_auction',
          minimum_value: 2650000.0,
          platform_fee: '5%',
        },
      }),

      await Hearing.create({
        title: 'Audiência de Conciliação - Gallo Ferreira',
        description: 'Audiência de conciliação no CEJUSC',
        scheduled_date: DateTime.fromISO('2025-02-05T09:00:00'),
        type: 'audiencia',
        status: 'pending',
        priority: 'medium',
        folder_id: folders[6].id,
        assignee_id: users.andre.id,
        creator_id: users.andre.id,
        notes: 'TJSP - CEJUSC Central - Sala 12. Cliente autoriza acordo até R$ 400.000,00',
        metadata: {
          settlement_limit: 400000.0,
          mediator: 'To be assigned',
        },
      }),

      await Hearing.create({
        title: 'Reunião BCB - Esclarecimentos CP 109/2024',
        description: 'Reunião técnica com equipe de regulação do BCB',
        scheduled_date: DateTime.fromISO('2025-02-20T10:00:00'),
        type: 'prazo_extrajudicial',
        status: 'pending',
        priority: 'high',
        folder_id: folders[0].id,
        assignee_id: users.andre.id,
        creator_id: users.benicio.id,
        notes: 'Banco Central - Brasília. Discussão sobre regulação de criptoativos',
        metadata: {
          attendees: ['BCB Team', 'Banco Inter Legal', 'Compliance'],
          agenda: 'Technical clarifications on crypto regulation',
        },
      }),
    ]

    logger.info(`✅ Created ${hearings.length} hearings`)

    // ============================
    // 10. Create Messages
    // ============================
    const messages = [
      await Message.create({
        user_id: users.andre.id,
        senderId: users.benicio.id,
        subject: 'Urgente: Prazo CP 109/2024 BCB',
        body: 'André, precisamos finalizar o parecer sobre a regulamentação de criptoativos até sexta-feira. O Banco Inter está contando com nossa análise detalhada.',
        priority: 'high',
        metadata: {
          folder_id: folders[0].id,
          deadline: '2025-01-17',
        },
      }),

      await Message.create({
        user_id: users.marcos.id,
        senderId: users.patricia.id,
        subject: 'Documentos para audiência Correios',
        body: 'Dr. Marcos, já preparei todos os documentos para a audiência de instrução. Estão na pasta compartilhada. As testemunhas foram notificadas.',
        priority: 'normal',
        readAt: DateTime.now().minus({ hours: 2 }),
        metadata: {
          folder_id: folders[4].id,
          documents_count: 12,
        },
      }),

      await Message.create({
        user_id: users.patricia.id,
        senderId: users.admin.id,
        subject: 'Avaliação do imóvel - CEF',
        body: 'Dra. Patrícia, o laudo de avaliação chegou. O imóvel foi avaliado em R$ 2.650.000,00. Favor preparar a petição informando o valor.',
        priority: 'normal',
        metadata: {
          folder_id: folders[5].id,
          appraisal_value: 2650000.0,
        },
      }),

      await Message.create({
        user_id: users.benicio.id,
        senderId: null, // System message
        subject: 'Publicação de Acórdão - TRT24',
        body: 'Foi publicado o acórdão do Incidente de Uniformização sobre uso de veículo próprio. Tese favorável ao empregado foi fixada.',
        priority: 'high',
        readAt: DateTime.now().minus({ days: 1 }),
        metadata: {
          folder_id: folders[2].id,
          publication_date: '2023-04-03',
        },
      }),

      await Message.create({
        user_id: users.andre.id,
        senderId: users.julia.id,
        subject: 'Pesquisa jurisprudencial - Open Finance',
        body: 'Dr. André, finalizei a pesquisa sobre precedentes de Open Finance. Encontrei 15 decisões relevantes do STJ e 8 normativos do BCB.',
        priority: 'normal',
        readAt: DateTime.now().minus({ hours: 5 }),
        metadata: {
          folder_id: folders[7].id,
          research_results: 23,
        },
      }),
    ]

    logger.info(`✅ Created ${messages.length} messages`)

    // ============================
    // 11. Create Notifications
    // ============================
    const notifications = [
      await Notification.create({
        user_id: users.andre.id,
        type: 'deadline',
        title: 'Prazo se aproximando',
        message: 'Prazo para resposta à CP 109/2024 vence em 7 dias',
        actionUrl: '/folders/PROC-2024-001',
        actionText: 'Ver processo',
        data: {
          folder_id: folders[0].id,
          days_remaining: 7,
        },
      }),

      await Notification.create({
        user_id: users.patricia.id,
        type: 'hearing',
        title: 'Audiência amanhã',
        message: 'Audiência de instrução - Correios vs Adilson às 14:30',
        actionUrl: '/hearings/2025-02-10',
        actionText: 'Ver detalhes',
        data: {
          folder_id: folders[4].id,
          location: 'TRT2 - Sala 405',
        },
      }),

      await Notification.create({
        user_id: users.marcos.id,
        type: 'task',
        title: 'Nova tarefa atribuída',
        message: 'Elaborar memorial para Des. Umpierre - Prazo: 15 dias',
        actionUrl: '/tasks',
        actionText: 'Ver tarefa',
        readAt: DateTime.now().minus({ hours: 1 }),
        data: {
          folder_id: folders[1].id,
          priority: 'medium',
        },
      }),

      await Notification.create({
        user_id: users.benicio.id,
        type: 'success',
        title: 'Liminar deferida',
        message: 'Liminar de bloqueio de contas deferida no caso Gallo Ferreira',
        actionUrl: '/folders/PROC-2024-089',
        actionText: 'Ver processo',
        readAt: DateTime.now().minus({ days: 2 }),
        data: {
          folder_id: folders[6].id,
          blocked_amount: 487000.0,
        },
      }),

      await Notification.create({
        user_id: users.andre.id,
        type: 'info',
        title: 'Novo normativo BCB',
        message: 'Publicada Resolução BCB 5.123/2024 sobre criptoativos',
        actionUrl: '/regulations',
        actionText: 'Ler normativo',
        data: {
          regulation: 'BCB 5.123/2024',
          impact: 'high',
        },
      }),

      await Notification.create({
        user_id: users.patricia.id,
        type: 'warning',
        title: 'Documento pendente',
        message: 'Falta juntar procuração no processo da CEF',
        actionUrl: '/folders/PROC-2024-067',
        actionText: 'Resolver',
        data: {
          folder_id: folders[5].id,
          document_type: 'power_of_attorney',
        },
      }),

      await Notification.create({
        user_id: users.admin.id,
        type: 'error',
        title: 'Erro no protocolo',
        message: 'Falha ao protocolar petição - Sistema TJSP indisponível',
        actionUrl: '/support',
        actionText: 'Tentar novamente',
        data: {
          error_code: 'TJSP_503',
          retry_after: '30 minutes',
        },
      }),
    ]

    logger.info(`✅ Created ${notifications.length} notifications`)

    // ============================
    // 12. Create Folder Favorites
    // ============================
    const favorites = [
      await FolderFavorite.firstOrCreate({
        userId: users.andre.id,
        folderId: folders[0].id, // Crypto regulation
      }),
      await FolderFavorite.firstOrCreate({
        userId: users.andre.id,
        folderId: folders[7].id, // Open Finance
      }),
      await FolderFavorite.firstOrCreate({
        userId: users.marcos.id,
        folderId: folders[1].id, // Zurich case
      }),
      await FolderFavorite.firstOrCreate({
        userId: users.marcos.id,
        folderId: folders[2].id, // Vehicle usage case
      }),
      await FolderFavorite.firstOrCreate({
        userId: users.patricia.id,
        folderId: folders[4].id, // Correios case
      }),
      await FolderFavorite.firstOrCreate({
        userId: users.patricia.id,
        folderId: folders[5].id, // CEF execution
      }),
      await FolderFavorite.firstOrCreate({
        userId: users.benicio.id,
        folderId: folders[0].id, // Crypto - high priority
      }),
      await FolderFavorite.firstOrCreate({
        userId: users.benicio.id,
        folderId: folders[3].id, // CARF case
      }),
    ]

    logger.info(`✅ Created ${favorites.length} folder favorites`)

    // ============================
    // 13. Create Auth Access Tokens
    // ============================
    logger.info('🔑 Creating authentication tokens...')
    const tokens = await this.createAuthTokens(users)
    logger.info(`✅ Created ${tokens.length} auth tokens`)

    // ============================
    // 14. Create Files
    // ============================
    logger.info('📁 Creating file records...')
    const files = await this.createFiles(users, clients)
    logger.info(`✅ Created ${files.length} file records`)

    // ============================
    // 15. Create Role Permissions (Enhanced)
    // ============================
    logger.info('🔒 Setting up role permissions...')
    await this.setupRolePermissions([adminRole, lawyerRole, secretaryRole, internRole])
    logger.info(`✅ Role permissions configured`)

    // ============================
    // 16. Create User Permissions (Specific)
    // ============================
    logger.info('👤 Creating specific user permissions...')
    const userPermissions = await this.createUserPermissions(users)
    logger.info(`✅ Created ${userPermissions} user-specific permissions`)

    // ============================
    // 17. Create Rate Limits
    // ============================
    logger.info('⚡ Creating rate limit records...')
    const rateLimits = await this.createRateLimits()
    logger.info(`✅ Created ${rateLimits.length} rate limit records`)

    // ============================
    // 18. Create Audit Logs
    // ============================
    logger.info('📜 Creating audit logs...')
    const auditLogs = await this.createAuditLogs(users, folders)
    logger.info(`✅ Created ${auditLogs.length} audit log entries`)

    // ============================
    // Summary
    // ============================
    logger.info('\n=================================')
    logger.info('✅ Realistic data seeding completed successfully!')
    logger.info('=================================')
    logger.info(`- Users: ${Object.keys(users).length}`)
    logger.info(`- Clients: ${clients.length}`)
    logger.info(`- Folders: ${folders.length}`)
    logger.info(`- Processes: ${processes.length}`)
    logger.info(`- Documents: ${documents.length}`)
    logger.info(`- Movements: ${movements.length}`)
    logger.info(`- Tasks: ${tasks.length}`)
    logger.info(`- Hearings: ${hearings.length}`)
    logger.info(`- Messages: ${messages.length}`)
    logger.info(`- Notifications: ${notifications.length}`)
    logger.info(`- Favorites: ${favorites.length}`)
    logger.info(`- Auth Tokens: ${tokens.length}`)
    logger.info(`- Files: ${files.length}`)
    logger.info(`- User Permissions: ${userPermissions}`)
    logger.info(`- Rate Limits: ${rateLimits.length}`)
    logger.info(`- Audit Logs: ${auditLogs.length}`)
    logger.info('=================================\n')

    logger.info('📝 Sample credentials:')
    logger.info('Admin: admin@benicio.com.br / benicio123')
    logger.info('Lawyer: andre.camara@benicio.com.br / benicio123')
    logger.info('Secretary: mariana.costa@benicio.com.br / benicio123')
  }

  /**
   * Create enhanced legal-specific permissions
   */
  private async createLegalPermissions() {
    const legalPermissions = [
      // Folders/Cases - Legal-specific actions
      {
        name: 'folders.archive',
        resource: 'folders',
        action: 'archive',
        description: 'Archive folders',
      },
      {
        name: 'folders.unarchive',
        resource: 'folders',
        action: 'unarchive',
        description: 'Unarchive folders',
      },
      {
        name: 'folders.assign',
        resource: 'folders',
        action: 'assign',
        description: 'Assign folders to lawyers',
      },
      {
        name: 'folders.status_change',
        resource: 'folders',
        action: 'status_change',
        description: 'Change folder status',
      },

      // Documents - Legal document management
      {
        name: 'documents.sign',
        resource: 'documents',
        action: 'sign',
        description: 'Sign documents',
      },
      {
        name: 'documents.version',
        resource: 'documents',
        action: 'version',
        description: 'Version documents',
      },
      {
        name: 'documents.approve',
        resource: 'documents',
        action: 'approve',
        description: 'Approve documents',
      },

      // Hearings - Court appearance management
      {
        name: 'hearings.schedule',
        resource: 'hearings',
        action: 'schedule',
        description: 'Schedule hearings',
      },
      {
        name: 'hearings.reschedule',
        resource: 'hearings',
        action: 'reschedule',
        description: 'Reschedule hearings',
      },
      {
        name: 'hearings.cancel',
        resource: 'hearings',
        action: 'cancel',
        description: 'Cancel hearings',
      },

      // Tasks - Legal task management
      { name: 'tasks.assign', resource: 'tasks', action: 'assign', description: 'Assign tasks' },
      {
        name: 'tasks.complete',
        resource: 'tasks',
        action: 'complete',
        description: 'Complete tasks',
      },

      // Messages - Communication
      { name: 'messages.send', resource: 'messages', action: 'send', description: 'Send messages' },
      {
        name: 'messages.broadcast',
        resource: 'messages',
        action: 'broadcast',
        description: 'Broadcast messages',
      },

      // Notifications
      {
        name: 'notifications.send',
        resource: 'notifications',
        action: 'send',
        description: 'Send notifications',
      },
      {
        name: 'notifications.manage',
        resource: 'notifications',
        action: 'manage',
        description: 'Manage notifications',
      },

      // Dashboard & Analytics
      {
        name: 'dashboard.view',
        resource: 'dashboard',
        action: 'view',
        description: 'View dashboard',
      },
      {
        name: 'analytics.view',
        resource: 'analytics',
        action: 'view',
        description: 'View analytics',
      },
      {
        name: 'analytics.export',
        resource: 'analytics',
        action: 'export',
        description: 'Export analytics',
      },

      // System Administration
      { name: 'system.backup', resource: 'system', action: 'backup', description: 'Backup system' },
      {
        name: 'system.maintenance',
        resource: 'system',
        action: 'maintenance',
        description: 'System maintenance',
      },
    ]

    for (const permission of legalPermissions) {
      await Permission.firstOrCreate({ name: permission.name }, permission)
    }
  }

  /**
   * Create authentication tokens for users
   */
  private async createAuthTokens(users: any) {
    const tokens = []
    const tokenTypes = ['access_token', 'refresh_token']
    const abilities = JSON.stringify(['*'])

    for (const [key, user] of Object.entries(users)) {
      if (key === 'admin') continue // Skip admin tokens for security

      for (const type of tokenTypes) {
        const tokenHash = await hash.make(`${key}_${type}_${Date.now()}`)

        await Database.table('auth_access_tokens').insert({
          tokenable_id: (user as any).id,
          type: type,
          name: `${key}_${type}`,
          hash: tokenHash,
          abilities: abilities,
          created_at: DateTime.now().toSQL(),
          updated_at: DateTime.now().toSQL(),
          last_used_at: DateTime.now()
            .minus({ hours: Math.floor(Math.random() * 24) })
            .toSQL(),
          expires_at: DateTime.now().plus({ days: 30 }).toSQL(),
        })

        tokens.push({ user: key, type, hash: tokenHash })
      }
    }

    return tokens
  }

  /**
   * Create file records for document management
   */
  private async createFiles(users: any, clients: any[]) {
    const files = []

    const fileTypes = [
      { ext: 'pdf', mime: 'application/pdf', category: 'document' },
      {
        ext: 'docx',
        mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        category: 'document',
      },
      {
        ext: 'xlsx',
        mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        category: 'spreadsheet',
      },
      { ext: 'jpg', mime: 'image/jpeg', category: 'image' },
      { ext: 'png', mime: 'image/png', category: 'image' },
    ]

    const sampleFiles = [
      { name: 'contrato_bancario_inter.pdf', size: 2456789, client_idx: 0, category: 'contract' },
      { name: 'peticao_inicial_zurich.docx', size: 856234, client_idx: 1, category: 'petition' },
      { name: 'laudo_pericial_sinistro.pdf', size: 3567890, client_idx: 1, category: 'evidence' },
      { name: 'acordao_trt24_veiculos.pdf', size: 1234567, client_idx: 4, category: 'decision' },
      {
        name: 'planilha_calculos_trabalhistas.xlsx',
        size: 456789,
        client_idx: 4,
        category: 'other',
      },
      { name: 'fotos_acidente_veiculo.jpg', size: 2890123, client_idx: 3, category: 'evidence' },
      {
        name: 'carta_citacao_correios.pdf',
        size: 567890,
        client_idx: 5,
        category: 'correspondence',
      },
      { name: 'cci_conjunto_residencial.pdf', size: 4567890, client_idx: 6, category: 'contract' },
      { name: 'invoice_frutas_gallo.pdf', size: 345678, client_idx: 2, category: 'other' },
      { name: 'parecer_juridico_crypto.pdf', size: 5678901, client_idx: 0, category: 'other' },
      {
        name: 'manifestacao_bcb_openfinance.docx',
        size: 1890234,
        client_idx: 0,
        category: 'correspondence',
      },
      { name: 'certidao_quitacao_eleitoral.pdf', size: 234567, client_idx: 3, category: 'other' },
      {
        name: 'comprovante_residencia_cliente.jpg',
        size: 1345678,
        client_idx: 3,
        category: 'evidence',
      },
      { name: 'ata_reuniao_diretoria.docx', size: 890123, client_idx: 0, category: 'other' },
      { name: 'balanco_patrimonial_2024.xlsx', size: 2345678, client_idx: 2, category: 'other' },
    ]

    for (const fileData of sampleFiles) {
      const fileType = fileTypes.find((ft) => fileData.name.includes(ft.ext)) || fileTypes[0]
      const randomUser = Object.values(users)[
        Math.floor(Math.random() * Object.values(users).length)
      ] as any

      const file = await File.create({
        owner_id: randomUser.id,
        client_name: clients[fileData.client_idx].name,
        file_name: fileData.name,
        file_size: fileData.size,
        file_type: fileType.mime,
        file_category: fileData.category,
        url: `/files/${DateTime.now().toFormat('yyyy/MM')}/${fileData.name}`,
      })

      files.push(file)
    }

    return files
  }

  /**
   * Setup role permissions with legal-specific assignments
   */
  private async setupRolePermissions(roles: any[]) {
    const permissions = await Permission.all()

    for (const role of roles) {
      let rolePermissions: any[] = []

      switch (role.slug) {
        case IRole.Slugs.ADMIN:
          // Admin gets almost all permissions except some system-critical ones
          rolePermissions = permissions.filter(
            (p) => !['system.backup', 'system.maintenance'].includes(p.name)
          )
          break

        case IRole.Slugs.LAWYER:
          // Lawyers get comprehensive access to legal operations
          rolePermissions = permissions.filter((p) =>
            [
              // Core legal operations
              'folders.create',
              'folders.read',
              'folders.update',
              'folders.list',
              'folders.assign',
              'folders.status_change',
              'documents.create',
              'documents.read',
              'documents.update',
              'documents.sign',
              'documents.approve',
              'documents.version',
              'tasks.create',
              'tasks.read',
              'tasks.update',
              'tasks.assign',
              'tasks.complete',
              'tasks.list',
              'hearings.create',
              'hearings.read',
              'hearings.update',
              'hearings.schedule',
              'hearings.reschedule',
              'clients.create',
              'clients.read',
              'clients.update',
              'clients.list',
              'messages.read',
              'messages.send',
              'notifications.read',
              'files.create',
              'files.read',
              'files.list',
              'analytics.view',
              'dashboard.view',
              // Own data management
              'users.read',
              'users.update',
            ].includes(p.name)
          )
          break

        case IRole.Slugs.SECRETARY:
          // Secretaries get administrative and support functions
          rolePermissions = permissions.filter((p) =>
            [
              // Administrative support
              'folders.read',
              'folders.list',
              'folders.update',
              'documents.create',
              'documents.read',
              'documents.update',
              'documents.list',
              'tasks.create',
              'tasks.read',
              'tasks.update',
              'tasks.list',
              'hearings.create',
              'hearings.read',
              'hearings.update',
              'hearings.schedule',
              'hearings.reschedule',
              'clients.create',
              'clients.read',
              'clients.update',
              'clients.list',
              'messages.read',
              'messages.send',
              'notifications.read',
              'notifications.send',
              'files.create',
              'files.read',
              'files.list',
              'dashboard.view',
              // Own profile
              'users.read',
              'users.update',
            ].includes(p.name)
          )
          break

        case IRole.Slugs.INTERN:
          // Interns get limited, read-mostly access
          rolePermissions = permissions.filter((p) =>
            [
              // Limited access
              'folders.read',
              'folders.list',
              'documents.read',
              'documents.list',
              'tasks.read',
              'tasks.list',
              'hearings.read',
              'hearings.list',
              'clients.read',
              'clients.list',
              'messages.read',
              'notifications.read',
              'files.read',
              'files.list',
              'dashboard.view',
              // Own profile
              'users.read',
              'users.update',
            ].includes(p.name)
          )
          break
      }

      if (rolePermissions.length > 0) {
        await role.related('permissions').sync(rolePermissions.map((p) => p.id))
      }
    }
  }

  /**
   * Create specific user permissions for edge cases
   */
  private async createUserPermissions(users: any) {
    let count = 0

    // Give Dr. Benício special system permissions as senior partner
    const systemPermissions = await Permission.query().whereIn('name', [
      'system.backup',
      'analytics.export',
      'reports.export',
    ])

    if (systemPermissions.length > 0) {
      await Database.table('user_permissions').insert(
        systemPermissions.map((permission) => ({
          user_id: users.benicio.id,
          permission_id: permission.id,
          created_at: DateTime.now().toSQL(),
          updated_at: DateTime.now().toSQL(),
        }))
      )
      count += systemPermissions.length
    }

    // Give André special crypto/tech permissions
    const techPermissions = await Permission.query()
      .where('resource', 'analytics')
      .orWhere('name', 'folders.archive')

    if (techPermissions.length > 0) {
      await Database.table('user_permissions').insert(
        techPermissions.map((permission) => ({
          user_id: users.andre.id,
          permission_id: permission.id,
          created_at: DateTime.now().toSQL(),
          updated_at: DateTime.now().toSQL(),
        }))
      )
      count += techPermissions.length
    }

    return count
  }

  /**
   * Create rate limiting records
   */
  private async createRateLimits() {
    const now = DateTime.now().toUnixInteger()
    const rateLimits = [
      // API rate limits per user
      { key: 'api:global', points: 1000, expire: now + 3600 }, // 1000 requests per hour globally
      { key: 'api:user:1', points: 100, expire: now + 3600 }, // 100 requests per hour per user
      { key: 'api:user:2', points: 150, expire: now + 3600 },
      { key: 'api:user:3', points: 120, expire: now + 3600 },

      // Login attempts
      { key: 'login:ip:192.168.1.100', points: 5, expire: now + 900 }, // 5 login attempts per 15 min
      { key: 'login:ip:192.168.1.101', points: 3, expire: now + 900 },
      { key: 'login:ip:10.0.0.50', points: 2, expire: now + 900 },

      // File upload limits
      { key: 'upload:user:1', points: 50, expire: now + 3600 }, // 50 uploads per hour
      { key: 'upload:user:2', points: 30, expire: now + 3600 },
      { key: 'upload:user:3', points: 25, expire: now + 3600 },

      // Search rate limits
      { key: 'search:user:1', points: 200, expire: now + 3600 }, // 200 searches per hour
      { key: 'search:user:2', points: 100, expire: now + 3600 },

      // Email sending limits
      { key: 'email:system', points: 500, expire: now + 3600 }, // 500 emails per hour system-wide
      { key: 'email:user:1', points: 20, expire: now + 3600 }, // 20 emails per user per hour
      { key: 'email:user:2', points: 15, expire: now + 3600 },
    ]

    for (const limit of rateLimits) {
      await Database.table('rate_limits').insert(limit)
    }

    return rateLimits
  }

  /**
   * Create comprehensive audit logs showing system activity
   */
  private async createAuditLogs(users: any, folders: any[]) {
    const auditLogs = []
    const actions = ['create', 'read', 'update', 'delete', 'list']
    const resources = ['folders', 'documents', 'users', 'clients', 'tasks', 'hearings']
    const userAgents = [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    ]
    const ipAddresses = [
      '192.168.1.100',
      '192.168.1.101',
      '10.0.0.50',
      '172.16.0.10',
      '203.0.113.45',
    ]

    // Generate realistic audit logs for the past 30 days
    const userList = Object.values(users) as any[]
    for (let i = 0; i < 150; i++) {
      const randomUser = userList[Math.floor(Math.random() * userList.length)]
      const randomAction = actions[Math.floor(Math.random() * actions.length)]
      const randomResource = resources[Math.floor(Math.random() * resources.length)]
      const randomResult = Math.random() > 0.1 ? 'granted' : 'denied' // 90% success rate
      const randomDate = DateTime.now().minus({
        days: Math.floor(Math.random() * 30),
        hours: Math.floor(Math.random() * 24),
        minutes: Math.floor(Math.random() * 60),
      })

      const logData = {
        userId: randomUser.id,
        session_id: `sess_${randomUser.id}_${Math.random().toString(36).substr(2, 9)}`,
        ip_address: ipAddresses[Math.floor(Math.random() * ipAddresses.length)],
        user_agent: userAgents[Math.floor(Math.random() * userAgents.length)],
        resource: randomResource,
        action: randomAction,
        context: 'any',
        resource_id:
          randomResource === 'folders'
            ? folders[Math.floor(Math.random() * folders.length)]?.id
            : null,
        method: ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)],
        url: `/api/${randomResource}`,
        request_data: randomAction === 'create' ? { name: 'Sample data' } : null,
        result: randomResult as 'granted' | 'denied',
        reason: randomResult === 'denied' ? 'Insufficient permissions' : null,
        response_code: randomResult === 'granted' ? 200 : 403,
        metadata: {
          duration_ms: Math.floor(Math.random() * 1000) + 50,
          source: 'web_app',
        },
        created_at: randomDate,
        updated_at: randomDate,
      }

      const auditLog = await AuditLog.create(logData)
      auditLogs.push(auditLog)
    }

    // Add some specific important audit events
    const importantEvents = [
      {
        user_id: users.benicio.id,
        resource: 'folders',
        action: 'create',
        result: 'granted' as const,
        url: '/api/folders',
        method: 'POST',
        metadata: { event: 'New crypto regulation case created', importance: 'high' },
      },
      {
        user_id: users.andre.id,
        resource: 'documents',
        action: 'sign',
        result: 'granted' as const,
        url: '/api/documents/123/sign',
        method: 'POST',
        metadata: { event: 'Legal opinion document signed', document_type: 'legal_opinion' },
      },
      {
        user_id: users.patricia.id,
        resource: 'hearings',
        action: 'schedule',
        result: 'granted' as const,
        url: '/api/hearings',
        method: 'POST',
        metadata: { event: 'Court hearing scheduled', court: 'TRT2' },
      },
      {
        userId: null, // System event
        resource: 'system',
        action: 'backup',
        result: 'granted' as const,
        url: '/system/backup',
        method: 'POST',
        metadata: { event: 'Automated system backup', size_mb: 1024 },
      },
    ]

    for (const event of importantEvents) {
      const auditLog = await AuditLog.create({
        ...event,
        session_id: event.user_id ? `sess_${event.user_id}_important` : null,
        ip_address: '192.168.1.100',
        user_agent: userAgents[0],
        context: 'any',
        response_code: 200,
        created_at: DateTime.now().minus({ days: Math.floor(Math.random() * 7) }),
        updated_at: DateTime.now().minus({ days: Math.floor(Math.random() * 7) }),
      })
      auditLogs.push(auditLog)
    }

    return auditLogs
  }
}
