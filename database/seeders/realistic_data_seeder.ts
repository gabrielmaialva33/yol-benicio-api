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
import IPermission from '#modules/permission/interfaces/permission_interface'
import Database from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    console.log('🚀 Starting realistic data seeder based on Benício Advogados cases...')

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
    console.log('📋 Creating enhanced legal-specific permissions...')
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
      await Client.create({
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
      }),

      await Client.create({
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
      }),

      await Client.create({
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
      }),

      await Client.create({
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
      }),

      await Client.create({
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
      }),

      await Client.create({
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
      }),

      await Client.create({
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
      }),

      await Client.create({
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
      }),
    ]

    console.log(`✅ Created ${clients.length} clients`)

    // ============================
    // 4. Create Folders (Real cases based on research)
    // ============================
    const folders = [
      // Banco Inter - Crypto regulation case
      await Folder.create({
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
      }),

      // Zurich Seguros - Conflict case
      await Folder.create({
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
      }),

      // Labor case - Vehicle usage
      await Folder.create({
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
      }),

      // CARF Tax case
      await Folder.create({
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
      }),

      // Correios labor case
      await Folder.create({
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
      }),

      // Caixa Econômica - Real estate financing
      await Folder.create({
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
      }),

      // Gallo Ferreira - Commercial dispute
      await Folder.create({
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
      }),

      // Regulatory - Open Finance
      await Folder.create({
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
      }),
    ]

    console.log(`✅ Created ${folders.length} folders`)

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

    console.log(`✅ Created ${processes.length} folder processes`)

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

    console.log(`✅ Created ${documents.length} folder documents`)

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

    console.log(`✅ Created ${movements.length} folder movements`)

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
        completed_at: DateTime.now().minus({ days: 3 }),
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
        completed_at: DateTime.now().minus({ days: 28 }),
        folder_id: folders[2].id,
        assignee_id: users.marcos.id,
        creator_id: users.marcos.id,
        metadata: {
          protocol_number: 'TRT24-EMB-2023-4567',
        },
      }),
    ]

    console.log(`✅ Created ${tasks.length} tasks`)

    // ============================
    // 9. Create Hearings
    // ============================
    const hearings = [
      await Hearing.create({
        title: 'Audiência de Instrução - Correios vs Adilson',
        date: DateTime.fromISO('2025-02-10T14:30:00'),
        type: 'instruction',
        location: 'TRT2 - Fórum Ruy Barbosa - Sala 405',
        folder_id: folders[4].id,
        assignee_id: users.patricia.id,
        creator_id: users.marcos.id,
        status: 'scheduled',
        notes: 'Levar 3 testemunhas. Documentos já juntados aos autos.',
        reminder: true,
        metadata: {
          judge: 'Dr. Fernando Costa',
          witnesses: 3,
          estimated_duration: '2 hours',
        },
      }),

      await Hearing.create({
        title: 'Sessão de Julgamento - Conflito Competência Zurich',
        date: DateTime.fromISO('2025-01-15T10:00:00'),
        type: 'trial',
        location: 'TJRJ - 21ª Câmara Cível - Sessão Virtual',
        folder_id: folders[1].id,
        assignee_id: users.marcos.id,
        creator_id: users.benicio.id,
        status: 'scheduled',
        notes: 'Sessão virtual - Preparar sustentação oral em vídeo',
        reminder: true,
        metadata: {
          session_type: 'virtual',
          video_duration_limit: '15 minutes',
        },
      }),

      await Hearing.create({
        title: 'Leilão Judicial - Conjunto Residencial',
        date: DateTime.fromISO('2025-01-25T15:00:00'),
        type: 'other',
        location: 'Online - www.leiloesjudiciais.com.br',
        folder_id: folders[5].id,
        assignee_id: users.patricia.id,
        creator_id: users.admin.id,
        status: 'scheduled',
        notes: 'Primeiro leilão - Lance mínimo: 100% da avaliação',
        reminder: true,
        metadata: {
          auction_type: '1st_auction',
          minimum_value: 2650000.0,
          platform_fee: '5%',
        },
      }),

      await Hearing.create({
        title: 'Audiência de Conciliação - Gallo Ferreira',
        date: DateTime.fromISO('2025-02-05T09:00:00'),
        type: 'conciliation',
        location: 'TJSP - CEJUSC Central - Sala 12',
        folder_id: folders[6].id,
        assignee_id: users.andre.id,
        creator_id: users.andre.id,
        status: 'scheduled',
        notes: 'Cliente autoriza acordo até R$ 400.000,00',
        reminder: true,
        metadata: {
          settlement_limit: 400000.0,
          mediator: 'To be assigned',
        },
      }),

      await Hearing.create({
        title: 'Reunião BCB - Esclarecimentos CP 109/2024',
        date: DateTime.fromISO('2025-02-20T10:00:00'),
        type: 'other',
        location: 'Banco Central - Brasília',
        folder_id: folders[0].id,
        assignee_id: users.andre.id,
        creator_id: users.benicio.id,
        status: 'scheduled',
        notes: 'Reunião técnica com equipe de regulação do BCB',
        reminder: true,
        metadata: {
          attendees: ['BCB Team', 'Banco Inter Legal', 'Compliance'],
          agenda: 'Technical clarifications on crypto regulation',
        },
      }),
    ]

    console.log(`✅ Created ${hearings.length} hearings`)

    // ============================
    // 10. Create Messages
    // ============================
    const messages = [
      await Message.create({
        userId: users.andre.id,
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
        userId: users.marcos.id,
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
        userId: users.patricia.id,
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
        userId: users.benicio.id,
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
        userId: users.andre.id,
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

    console.log(`✅ Created ${messages.length} messages`)

    // ============================
    // 11. Create Notifications
    // ============================
    const notifications = [
      await Notification.create({
        userId: users.andre.id,
        type: 'deadline',
        title: 'Prazo se aproximando',
        message: 'Prazo para resposta à CP 109/2024 vence em 7 dias',
        actionUrl: '/folders/PROC-2024-001',
        actionText: 'Ver processo',
        metadata: {
          folder_id: folders[0].id,
          days_remaining: 7,
        },
      }),

      await Notification.create({
        userId: users.patricia.id,
        type: 'hearing',
        title: 'Audiência amanhã',
        message: 'Audiência de instrução - Correios vs Adilson às 14:30',
        actionUrl: '/hearings/2025-02-10',
        actionText: 'Ver detalhes',
        metadata: {
          folder_id: folders[4].id,
          location: 'TRT2 - Sala 405',
        },
      }),

      await Notification.create({
        userId: users.marcos.id,
        type: 'task',
        title: 'Nova tarefa atribuída',
        message: 'Elaborar memorial para Des. Umpierre - Prazo: 15 dias',
        actionUrl: '/tasks',
        actionText: 'Ver tarefa',
        readAt: DateTime.now().minus({ hours: 1 }),
        metadata: {
          folder_id: folders[1].id,
          priority: 'medium',
        },
      }),

      await Notification.create({
        userId: users.benicio.id,
        type: 'success',
        title: 'Liminar deferida',
        message: 'Liminar de bloqueio de contas deferida no caso Gallo Ferreira',
        actionUrl: '/folders/PROC-2024-089',
        actionText: 'Ver processo',
        readAt: DateTime.now().minus({ days: 2 }),
        metadata: {
          folder_id: folders[6].id,
          blocked_amount: 487000.0,
        },
      }),

      await Notification.create({
        userId: users.andre.id,
        type: 'info',
        title: 'Novo normativo BCB',
        message: 'Publicada Resolução BCB 5.123/2024 sobre criptoativos',
        actionUrl: '/regulations',
        actionText: 'Ler normativo',
        metadata: {
          regulation: 'BCB 5.123/2024',
          impact: 'high',
        },
      }),

      await Notification.create({
        userId: users.patricia.id,
        type: 'warning',
        title: 'Documento pendente',
        message: 'Falta juntar procuração no processo da CEF',
        actionUrl: '/folders/PROC-2024-067',
        actionText: 'Resolver',
        metadata: {
          folder_id: folders[5].id,
          document_type: 'power_of_attorney',
        },
      }),

      await Notification.create({
        userId: users.admin.id,
        type: 'error',
        title: 'Erro no protocolo',
        message: 'Falha ao protocolar petição - Sistema TJSP indisponível',
        actionUrl: '/support',
        actionText: 'Tentar novamente',
        metadata: {
          error_code: 'TJSP_503',
          retry_after: '30 minutes',
        },
      }),
    ]

    console.log(`✅ Created ${notifications.length} notifications`)

    // ============================
    // 12. Create Folder Favorites
    // ============================
    const favorites = [
      await FolderFavorite.create({
        userId: users.andre.id,
        folderId: folders[0].id, // Crypto regulation
      }),
      await FolderFavorite.create({
        userId: users.andre.id,
        folderId: folders[7].id, // Open Finance
      }),
      await FolderFavorite.create({
        userId: users.marcos.id,
        folderId: folders[1].id, // Zurich case
      }),
      await FolderFavorite.create({
        userId: users.marcos.id,
        folderId: folders[2].id, // Vehicle usage case
      }),
      await FolderFavorite.create({
        userId: users.patricia.id,
        folderId: folders[4].id, // Correios case
      }),
      await FolderFavorite.create({
        userId: users.patricia.id,
        folderId: folders[5].id, // CEF execution
      }),
      await FolderFavorite.create({
        userId: users.benicio.id,
        folderId: folders[0].id, // Crypto - high priority
      }),
      await FolderFavorite.create({
        userId: users.benicio.id,
        folderId: folders[3].id, // CARF case
      }),
    ]

    console.log(`✅ Created ${favorites.length} folder favorites`)

    // ============================
    // Summary
    // ============================
    console.log('\n=================================')
    console.log('✅ Realistic data seeding completed successfully!')
    console.log('=================================')
    console.log(`- Users: ${Object.keys(users).length}`)
    console.log(`- Clients: ${clients.length}`)
    console.log(`- Folders: ${folders.length}`)
    console.log(`- Processes: ${processes.length}`)
    console.log(`- Documents: ${documents.length}`)
    console.log(`- Movements: ${movements.length}`)
    console.log(`- Tasks: ${tasks.length}`)
    console.log(`- Hearings: ${hearings.length}`)
    console.log(`- Messages: ${messages.length}`)
    console.log(`- Notifications: ${notifications.length}`)
    console.log(`- Favorites: ${favorites.length}`)
    console.log('=================================\n')

    console.log('📝 Sample credentials:')
    console.log('Admin: admin@benicio.com.br / benicio123')
    console.log('Lawyer: andre.camara@benicio.com.br / benicio123')
    console.log('Secretary: mariana.costa@benicio.com.br / benicio123')
  }
}
