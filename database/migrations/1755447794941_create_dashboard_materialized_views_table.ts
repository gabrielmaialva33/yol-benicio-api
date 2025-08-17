import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // MATERIALIZED VIEW 1: Evolução Mensal de Processos (últimos 6 meses)
    await this.schema.raw(`
      CREATE MATERIALIZED VIEW mv_dashboard_monthly_evolution AS
      SELECT 
        TO_CHAR(DATE_TRUNC('month', pro_dta_inc::timestamp), 'Mon') as month,
        DATE_TRUNC('month', pro_dta_inc::timestamp) as month_date,
        COUNT(*) as folder_count,
        COUNT(*) FILTER (WHERE pro_dta_enc IS NULL OR pro_dta_enc = '') as active_count,
        COUNT(*) FILTER (WHERE pro_dta_enc IS NOT NULL AND pro_dta_enc != '') as completed_count
      FROM tabela_open_processos
      WHERE pro_dta_inc::timestamp >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', pro_dta_inc::timestamp)
      ORDER BY month_date;
    `)

    // Index para performance
    await this.schema.raw(`
      CREATE INDEX idx_mv_monthly_evolution_month ON mv_dashboard_monthly_evolution(month_date);
    `)

    // MATERIALIZED VIEW 2: Estatísticas de Faturamento
    await this.schema.raw(`
      CREATE MATERIALIZED VIEW mv_dashboard_billing AS
      SELECT
        fat_ano::int as year,
        fat_mes::int as month,
        SUM(
          CASE 
            WHEN fat_vlr ~ '^[0-9]+\.?[0-9]*$' 
            THEN fat_vlr::numeric 
            WHEN fat_vlr ~ '^[0-9]+\.?[0-9]*d[0-9]*$'
            THEN REGEXP_REPLACE(fat_vlr, 'd[0-9]*$', '')::numeric
            ELSE 0 
          END
        ) as total_value,
        COUNT(*) as invoice_count,
        AVG(
          CASE 
            WHEN fat_vlr ~ '^[0-9]+\.?[0-9]*$' 
            THEN fat_vlr::numeric 
            WHEN fat_vlr ~ '^[0-9]+\.?[0-9]*d[0-9]*$'
            THEN REGEXP_REPLACE(fat_vlr, 'd[0-9]*$', '')::numeric
            ELSE 0 
          END
        ) as avg_value,
        TO_CHAR(MAKE_DATE(fat_ano::int, fat_mes::int, 1), 'Mon') as month_name
      FROM open_faturamentos
      WHERE fat_ano IS NOT NULL AND fat_ano != ''
        AND fat_mes IS NOT NULL AND fat_mes != ''
        AND fat_ano ~ '^[0-9]+$'
        AND fat_mes ~ '^[0-9]+$'
        AND fat_ano::int >= EXTRACT(YEAR FROM CURRENT_DATE) - 1
        AND fat_vlr IS NOT NULL
        AND fat_vlr != ''
      GROUP BY fat_ano::int, fat_mes::int
      ORDER BY year DESC, month DESC;
    `)

    // MATERIALIZED VIEW 3: Estatísticas de Solicitações (Requests)
    await this.schema.raw(`
      CREATE MATERIALIZED VIEW mv_dashboard_requests AS
      SELECT
        TO_CHAR(DATE_TRUNC('month', 
          CASE 
            WHEN age_dta_inc ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}' 
            THEN age_dta_inc::timestamp 
            ELSE CURRENT_DATE::timestamp 
          END
        ), 'Mon') as month,
        DATE_TRUNC('month', 
          CASE 
            WHEN age_dta_inc ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}' 
            THEN age_dta_inc::timestamp 
            ELSE CURRENT_DATE::timestamp 
          END
        ) as month_date,
        COUNT(*) as total_requests,
        COUNT(*) FILTER (
          WHERE age_dta_inc ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
          AND DATE(age_dta_inc::timestamp) >= DATE_TRUNC('month', CURRENT_DATE)
        ) as new_requests,
        ROUND((
          COUNT(*) FILTER (
            WHERE age_dta_inc ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
            AND DATE(age_dta_inc::timestamp) >= DATE_TRUNC('month', CURRENT_DATE)
          ) * 100.0 / NULLIF(COUNT(*), 0)
        ), 2) as percentage
      FROM open_agendas
      WHERE age_dta_inc IS NOT NULL 
        AND age_dta_inc != ''
        AND age_dta_inc ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
        AND age_dta_inc::timestamp >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', age_dta_inc::timestamp)
      ORDER BY month_date;
    `)

    // MATERIALIZED VIEW 4: Top Clientes por Atividade
    await this.schema.raw(`
      CREATE MATERIALIZED VIEW mv_dashboard_top_clients AS
      SELECT 
        c.cli_ide,
        c.cli_nom as client_name,
        c.cli_cod as client_code,
        COUNT(DISTINCT p.pro_ide) as folder_count,
        COUNT(DISTINCT a.age_ide) as agenda_count,
        SUM(
          CASE 
            WHEN f.fat_vlr ~ '^[0-9]+\.?[0-9]*$' 
            THEN f.fat_vlr::numeric 
            WHEN f.fat_vlr ~ '^[0-9]+\.?[0-9]*d[0-9]*$'
            THEN REGEXP_REPLACE(f.fat_vlr, 'd[0-9]*$', '')::numeric
            ELSE 0 
          END
        ) as total_billing
      FROM open_clientes c
      LEFT JOIN tabela_open_processos p ON p.pro_cas_ide::text = c.cli_ide
      LEFT JOIN open_agendas a ON a.age_pro_ide::text = p.pro_ide::text
      LEFT JOIN open_faturamentos f ON f.fat_coc_ide = c.cli_ide
      GROUP BY c.cli_ide, c.cli_nom, c.cli_cod
      HAVING COUNT(DISTINCT p.pro_ide) > 0 OR COUNT(DISTINCT a.age_ide) > 0
      ORDER BY folder_count DESC, total_billing DESC
      LIMIT 20;
    `)

    // MATERIALIZED VIEW 5: Atividade de Pastas por Período
    await this.schema.raw(`
      CREATE MATERIALIZED VIEW mv_dashboard_folder_activity AS
      SELECT
        'Novas esta semana' as label,
        COUNT(*) as value,
        'bg-cyan-500' as color,
        ROUND((COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM tabela_open_processos), 0)), 2) as percentage
      FROM tabela_open_processos
      WHERE pro_dta_inc::timestamp >= CURRENT_DATE - INTERVAL '7 days'
      
      UNION ALL
      
      SELECT
        'Novas este mês' as label,
        COUNT(*) as value,
        'bg-purple-500' as color,
        ROUND((COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM tabela_open_processos), 0)), 2) as percentage
      FROM tabela_open_processos
      WHERE pro_dta_inc::timestamp >= DATE_TRUNC('month', CURRENT_DATE)
      
      UNION ALL
      
      SELECT
        'Concluídas este mês' as label,
        COUNT(*) as value,
        'bg-emerald-500' as color,
        ROUND((COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM tabela_open_processos), 0)), 2) as percentage
      FROM tabela_open_processos
      WHERE pro_dta_enc IS NOT NULL AND pro_dta_enc != ''
        AND pro_dta_alt::timestamp >= DATE_TRUNC('month', CURRENT_DATE)
      
      UNION ALL
      
      SELECT
        'Total ativo' as label,
        COUNT(*) as value,
        'bg-blue-500' as color,
        ROUND((COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM tabela_open_processos), 0)), 2) as percentage
      FROM tabela_open_processos
      WHERE pro_dta_enc IS NULL OR pro_dta_enc = '';
    `)

    // Criar índices para otimização
    await this.schema.raw(`
      CREATE INDEX idx_mv_billing_year_month ON mv_dashboard_billing(year, month);
      CREATE INDEX idx_mv_requests_month ON mv_dashboard_requests(month_date);
      CREATE INDEX idx_mv_top_clients_folder_count ON mv_dashboard_top_clients(folder_count DESC);
    `)
  }

  async down() {
    await this.schema.raw('DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_folder_activity CASCADE')
    await this.schema.raw('DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_top_clients CASCADE')
    await this.schema.raw('DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_requests CASCADE')
    await this.schema.raw('DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_billing CASCADE')
    await this.schema.raw('DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_monthly_evolution CASCADE')
  }
}
