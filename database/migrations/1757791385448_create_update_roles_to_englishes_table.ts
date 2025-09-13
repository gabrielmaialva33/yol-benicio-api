import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Update existing roles from Portuguese to English
    await this.db.rawQuery(`
      UPDATE roles
      SET slug = CASE slug
        WHEN 'advogado' THEN 'lawyer'
        WHEN 'secretaria' THEN 'secretary'
        WHEN 'estagiario' THEN 'intern'
        ELSE slug
      END,
      name = CASE slug
        WHEN 'advogado' THEN 'Lawyer'
        WHEN 'secretaria' THEN 'Secretary'
        WHEN 'estagiario' THEN 'Intern'
        WHEN 'admin' THEN 'Administrator'
        ELSE name
      END,
      description = CASE slug
        WHEN 'advogado' THEN 'Access to lawyer functionalities'
        WHEN 'secretaria' THEN 'Access to administrative functionalities'
        WHEN 'estagiario' THEN 'Limited access for interns'
        WHEN 'admin' THEN 'Full system access'
        ELSE description
      END
      WHERE slug IN ('advogado', 'secretaria', 'estagiario', 'admin')
    `)
  }

  async down() {
    // Rollback to Portuguese slugs
    await this.db.rawQuery(`
      UPDATE roles
      SET slug = CASE slug
        WHEN 'lawyer' THEN 'advogado'
        WHEN 'secretary' THEN 'secretaria'
        WHEN 'intern' THEN 'estagiario'
        ELSE slug
      END,
      name = CASE slug
        WHEN 'lawyer' THEN 'Advogado'
        WHEN 'secretary' THEN 'Secretária'
        WHEN 'intern' THEN 'Estagiário'
        WHEN 'admin' THEN 'Administrador'
        ELSE name
      END,
      description = CASE slug
        WHEN 'lawyer' THEN 'Acesso às funcionalidades de advogado'
        WHEN 'secretary' THEN 'Acesso às funcionalidades administrativas'
        WHEN 'intern' THEN 'Acesso limitado para estagiários'
        WHEN 'admin' THEN 'Acesso total ao sistema'
        ELSE description
      END
      WHERE slug IN ('lawyer', 'secretary', 'intern', 'admin')
    `)
  }
}
