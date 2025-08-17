import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // VIEW 1: Estatísticas de Processos Ativos
    await this.schema.raw(`
      CREATE OR REPLACE VIEW vw_dashboard_active_folders AS
      SELECT 
        COUNT(*) FILTER (WHERE pro_dta_enc IS NULL OR pro_dta_enc = '') as active_count,
        COUNT(*) FILTER (WHERE DATE(pro_dta_inc::timestamp) >= DATE_TRUNC('month', CURRENT_DATE)) as new_this_month,
        COUNT(*) as total_count
      FROM tabela_open_processos;
    `)

    // VIEW 2: Divisão por Área
    await this.schema.raw(`
      CREATE OR REPLACE VIEW vw_dashboard_area_division AS
      SELECT 
        CASE pro_are_ide::int
          WHEN 1 THEN 'Trabalhista'
          WHEN 2 THEN 'Cível'
          WHEN 3 THEN 'Tributário'
          WHEN 4 THEN 'Criminal'
          ELSE 'Outros'
        END as area_name,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()), 2) as percentage,
        CASE pro_are_ide::int
          WHEN 1 THEN '#00A76F'
          WHEN 2 THEN '#00B8D9'
          WHEN 3 THEN '#FFAB00'
          WHEN 4 THEN '#FF5630'
          ELSE '#86878B'
        END as color
      FROM tabela_open_processos
      WHERE pro_sta_ide = '1'
      GROUP BY pro_are_ide;
    `)

    // VIEW 3: Atividade de Tarefas
    await this.schema.raw(`
      CREATE OR REPLACE VIEW vw_dashboard_tasks AS
      SELECT
        COUNT(*) as total_tasks,
        COUNT(*) FILTER (WHERE age_sta_ide = '1') as pending_tasks,
        COUNT(*) FILTER (WHERE age_sta_ide = '2' AND DATE(age_dta_alt::timestamp) = CURRENT_DATE) as completed_today,
        COUNT(*) FILTER (WHERE age_sta_ide = '1' AND DATE(age_dta_ven::timestamp) < CURRENT_DATE) as overdue_tasks
      FROM open_agendas;
    `)

    // VIEW 4: Audiências e Prazos
    await this.schema.raw(`
      CREATE OR REPLACE VIEW vw_dashboard_hearings AS
      SELECT
        COUNT(*) FILTER (WHERE age_tip_ide = '1') as hearings_count,
        COUNT(*) FILTER (WHERE age_tip_ide = '1' AND DATE(age_dta_ven::timestamp) BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days') as hearings_this_week,
        COUNT(*) FILTER (WHERE age_tip_ide = '2') as deadlines_count,
        COUNT(*) FILTER (WHERE age_tip_ide = '2' AND DATE(age_dta_ven::timestamp) BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days') as deadlines_this_week
      FROM open_agendas
      WHERE age_sta_ide = '1';
    `)

    // VIEW 5: Estatísticas de Clientes
    await this.schema.raw(`
      CREATE OR REPLACE VIEW vw_dashboard_clients AS
      SELECT
        COUNT(DISTINCT cli_ide) as total_clients,
        COUNT(DISTINCT cli_ide) FILTER (
          WHERE EXISTS (
            SELECT 1 FROM tabela_open_processos p 
            WHERE p.pro_cas_ide::text = c.cli_ide 
            AND p.pro_sta_ide = '1'
          )
        ) as active_clients,
        COUNT(DISTINCT cli_ide) FILTER (
          WHERE DATE(cli_dta_inc::timestamp) >= DATE_TRUNC('month', CURRENT_DATE)
        ) as new_this_month
      FROM open_clientes c;
    `)
  }

  async down() {
    await this.schema.raw('DROP VIEW IF EXISTS vw_dashboard_clients')
    await this.schema.raw('DROP VIEW IF EXISTS vw_dashboard_hearings')
    await this.schema.raw('DROP VIEW IF EXISTS vw_dashboard_tasks')
    await this.schema.raw('DROP VIEW IF EXISTS vw_dashboard_area_division')
    await this.schema.raw('DROP VIEW IF EXISTS vw_dashboard_active_folders')
  }
}
