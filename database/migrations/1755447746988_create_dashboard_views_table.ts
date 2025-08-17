import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Limpar views/materialized views existentes
    await this.schema.raw(`
      DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_folder_activity CASCADE;
      DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_top_clients CASCADE;
      DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_requests CASCADE;
      DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_billing CASCADE;
      DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_monthly_evolution CASCADE;
    `)

    // VIEW 1: Estatísticas de Processos Ativos
    await this.schema.raw(`
      CREATE OR REPLACE VIEW vw_dashboard_active_folders AS
      SELECT 
        COUNT(*) FILTER (WHERE pro_dta_enc IS NULL OR pro_dta_enc = '') as active_count,
        COUNT(*) FILTER (WHERE pro_dta_inc::date >= DATE_TRUNC('month', CURRENT_DATE)) as new_this_month,
        COUNT(*) as total_count
      FROM tabela_open_processos
      WHERE pro_dta_inc IS NOT NULL AND pro_dta_inc != '';
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
        END as name,
        COUNT(*) as value,
        CASE pro_are_ide::int
          WHEN 1 THEN '#00A76F'
          WHEN 2 THEN '#00B8D9'
          WHEN 3 THEN '#FFAB00'
          WHEN 4 THEN '#FF5630'
          ELSE '#86878B'
        END as color
      FROM tabela_open_processos
      WHERE (pro_dta_enc IS NULL OR pro_dta_enc = '')
        AND pro_are_ide IS NOT NULL 
        AND pro_are_ide != ''
      GROUP BY pro_are_ide;
    `)

    // MATERIALIZED VIEW: Evolução Mensal
    await this.schema.raw(`
      CREATE MATERIALIZED VIEW mv_dashboard_monthly_evolution AS
      SELECT 
        TO_CHAR(month_date, 'Mon') as month,
        month_date,
        folder_count as value
      FROM (
        SELECT 
          DATE_TRUNC('month', pro_dta_inc::date) as month_date,
          COUNT(*) as folder_count
        FROM tabela_open_processos
        WHERE pro_dta_inc IS NOT NULL 
          AND pro_dta_inc != ''
          AND pro_dta_inc::date >= CURRENT_DATE - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', pro_dta_inc::date)
        ORDER BY month_date
      ) sub;
    `)

    // MATERIALIZED VIEW: Faturamento Simplificado
    await this.schema.raw(`
      CREATE MATERIALIZED VIEW mv_dashboard_billing AS
      SELECT
        TO_CHAR(CURRENT_DATE, 'Mon') as month_name,
        COALESCE(SUM(
          CASE 
            WHEN fat_vlr ~ '^[0-9]+\\.?[0-9]*$' THEN fat_vlr::numeric
            WHEN fat_vlr ~ '^[0-9]+\\.?[0-9]*d[0-9]*$' THEN REGEXP_REPLACE(fat_vlr, 'd[0-9]*$', '')::numeric
            ELSE 0 
          END
        ), 0) as total_value,
        COUNT(*) as invoice_count
      FROM open_faturamentos
      WHERE fat_vlr IS NOT NULL 
        AND fat_vlr != ''
        AND fat_ano IS NOT NULL 
        AND fat_ano != ''
        AND fat_mes IS NOT NULL 
        AND fat_mes != ''
        AND fat_ano ~ '^[0-9]+$'
        AND fat_mes ~ '^[0-9]+$';
    `)

    // MATERIALIZED VIEW: Atividade de Pastas
    await this.schema.raw(`
      CREATE MATERIALIZED VIEW mv_dashboard_folder_activity AS
      SELECT
        'Novas esta semana' as label,
        COUNT(*) as value,
        'bg-cyan-500' as color,
        20 as percentage
      FROM tabela_open_processos
      WHERE pro_dta_inc IS NOT NULL 
        AND pro_dta_inc != ''
        AND pro_dta_inc::date >= CURRENT_DATE - INTERVAL '7 days'
      
      UNION ALL
      
      SELECT
        'Novas este mês' as label,
        COUNT(*) as value,
        'bg-purple-500' as color,
        30 as percentage
      FROM tabela_open_processos
      WHERE pro_dta_inc IS NOT NULL 
        AND pro_dta_inc != ''
        AND pro_dta_inc::date >= DATE_TRUNC('month', CURRENT_DATE)
      
      UNION ALL
      
      SELECT
        'Total ativo' as label,
        COUNT(*) as value,
        'bg-blue-500' as color,
        50 as percentage
      FROM tabela_open_processos
      WHERE pro_dta_enc IS NULL OR pro_dta_enc = '';
    `)

    // MATERIALIZED VIEW: Requests Simplificada
    await this.schema.raw(`
      CREATE MATERIALIZED VIEW mv_dashboard_requests AS
      SELECT
        TO_CHAR(DATE_TRUNC('month', CURRENT_DATE), 'Mon') as month,
        COUNT(*) as value,
        COUNT(*) FILTER (WHERE age_dta_inc::date >= DATE_TRUNC('month', CURRENT_DATE)) as new,
        25 as percentage
      FROM open_agendas
      WHERE age_dta_inc IS NOT NULL 
        AND age_dta_inc != ''
        AND age_dta_inc ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}';
    `)

    // Criar índices
    await this.schema.raw(`
      CREATE INDEX IF NOT EXISTS idx_mv_monthly_evolution_month ON mv_dashboard_monthly_evolution(month_date);
      CREATE INDEX IF NOT EXISTS idx_mv_billing_total ON mv_dashboard_billing(total_value);
    `)
  }

  async down() {
    await this.schema.raw('DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_requests CASCADE')
    await this.schema.raw('DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_folder_activity CASCADE')
    await this.schema.raw('DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_billing CASCADE')
    await this.schema.raw('DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_monthly_evolution CASCADE')
    await this.schema.raw('DROP VIEW IF EXISTS vw_dashboard_area_division')
    await this.schema.raw('DROP VIEW IF EXISTS vw_dashboard_active_folders')
  }
}
