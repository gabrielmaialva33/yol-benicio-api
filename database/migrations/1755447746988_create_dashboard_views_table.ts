import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  /**
   * Check if a table exists in the database
   */
  private async tableExists(tableName: string): Promise<boolean> {
    const result = await this.schema.raw(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = '${tableName}'
      )
    `)
    return result.rows[0].exists
  }

  async up() {
    // Limpar views/materialized views existentes
    await this.schema.raw(`
      DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_folder_activity CASCADE;
      DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_top_clients CASCADE;
      DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_requests CASCADE;
      DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_billing CASCADE;
      DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_monthly_evolution CASCADE;
    `)

    // Check if legacy tables exist (production) or not (test environment)
    const hasLegacyTables = await this.tableExists('tabela_open_processos')

    if (hasLegacyTables) {
      // PRODUCTION: Create views with real legacy table data
      await this.createProductionViews()
    } else {
      // TEST: Create views with mock data
      await this.createTestViews()
    }

    // Criar índices
    await this.schema.raw(`
      CREATE INDEX IF NOT EXISTS idx_mv_monthly_evolution_month ON mv_dashboard_monthly_evolution(month_date);
      CREATE INDEX IF NOT EXISTS idx_mv_billing_total ON mv_dashboard_billing(total_value);
    `)
  }

  /**
   * Create views for production environment (with real legacy tables)
   */
  private async createProductionViews() {
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

    // VIEW 2: Divisão por Área - Simplificada
    await this.schema.raw(`
      CREATE OR REPLACE VIEW vw_dashboard_area_division AS
      SELECT 
        'Trabalhista' as name,
        35 as value,
        '#00A76F' as color
      UNION ALL
      SELECT 
        'Cível' as name,
        30 as value,
        '#00B8D9' as color
      UNION ALL
      SELECT 
        'Tributário' as name,
        20 as value,
        '#FFAB00' as color
      UNION ALL
      SELECT 
        'Criminal' as name,
        15 as value,
        '#FF5630' as color;
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
  }

  /**
   * Create views for test environment (with mock data)
   */
  private async createTestViews() {
    // VIEW 1: Estatísticas de Processos Ativos (Mock)
    await this.schema.raw(`
      CREATE OR REPLACE VIEW vw_dashboard_active_folders AS
      SELECT 
        50 as active_count,
        10 as new_this_month,
        60 as total_count;
    `)

    // VIEW 2: Divisão por Área (Same as production - static data)
    await this.schema.raw(`
      CREATE OR REPLACE VIEW vw_dashboard_area_division AS
      SELECT 
        'Trabalhista' as name,
        35 as value,
        '#00A76F' as color
      UNION ALL
      SELECT 
        'Cível' as name,
        30 as value,
        '#00B8D9' as color
      UNION ALL
      SELECT 
        'Tributário' as name,
        20 as value,
        '#FFAB00' as color
      UNION ALL
      SELECT 
        'Criminal' as name,
        15 as value,
        '#FF5630' as color;
    `)

    // MATERIALIZED VIEW: Evolução Mensal (Mock)
    await this.schema.raw(`
      CREATE MATERIALIZED VIEW mv_dashboard_monthly_evolution AS
      SELECT 
        'Jan' as month,
        DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 months') as month_date,
        8 as value
      UNION ALL
      SELECT 
        'Feb' as month,
        DATE_TRUNC('month', CURRENT_DATE - INTERVAL '4 months') as month_date,
        12 as value
      UNION ALL
      SELECT 
        'Mar' as month,
        DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 months') as month_date,
        15 as value
      UNION ALL
      SELECT 
        'Apr' as month,
        DATE_TRUNC('month', CURRENT_DATE - INTERVAL '2 months') as month_date,
        10 as value
      UNION ALL
      SELECT 
        'May' as month,
        DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') as month_date,
        18 as value
      UNION ALL
      SELECT 
        TO_CHAR(CURRENT_DATE, 'Mon') as month,
        DATE_TRUNC('month', CURRENT_DATE) as month_date,
        20 as value;
    `)

    // MATERIALIZED VIEW: Faturamento (Mock)
    await this.schema.raw(`
      CREATE MATERIALIZED VIEW mv_dashboard_billing AS
      SELECT
        TO_CHAR(CURRENT_DATE, 'Mon') as month_name,
        125000.00 as total_value,
        15 as invoice_count;
    `)

    // MATERIALIZED VIEW: Atividade de Pastas (Mock)
    await this.schema.raw(`
      CREATE MATERIALIZED VIEW mv_dashboard_folder_activity AS
      SELECT
        'Novas esta semana' as label,
        5 as value,
        'bg-cyan-500' as color,
        20 as percentage
      UNION ALL
      SELECT
        'Novas este mês' as label,
        10 as value,
        'bg-purple-500' as color,
        30 as percentage
      UNION ALL
      SELECT
        'Total ativo' as label,
        50 as value,
        'bg-blue-500' as color,
        50 as percentage;
    `)

    // MATERIALIZED VIEW: Requests (Mock)
    await this.schema.raw(`
      CREATE MATERIALIZED VIEW mv_dashboard_requests AS
      SELECT
        TO_CHAR(CURRENT_DATE, 'Mon') as month,
        25 as value,
        8 as new,
        25 as percentage;
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
