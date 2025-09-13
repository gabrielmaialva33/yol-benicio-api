import LucidRepositoryInterface from '#shared/lucid/lucid_repository_interface'
import Role from '#modules/role/models/role'

namespace IRole {
  export interface Repository extends LucidRepositoryInterface<typeof Role> {}

  export enum Slugs {
    ROOT = 'root',
    ADMIN = 'admin',
    LAWYER = 'lawyer',
    SECRETARY = 'secretary',
    INTERN = 'intern',
    USER = 'user',
    GUEST = 'guest',
    EDITOR = 'editor',
    // Legacy PT-BR slugs for backward compatibility
    ADVOGADO = 'advogado',
    SECRETARIA = 'secretaria',
    ESTAGIARIO = 'estagiario',
  }

  export interface RoleHierarchy {
    [key: string]: string[]
  }

  export const ROLE_HIERARCHY: RoleHierarchy = {
    [Slugs.ROOT]: [
      Slugs.ADMIN,
      Slugs.LAWYER,
      Slugs.SECRETARY,
      Slugs.INTERN,
      Slugs.USER,
      Slugs.GUEST,
      Slugs.EDITOR,
    ],
    [Slugs.ADMIN]: [
      Slugs.LAWYER,
      Slugs.SECRETARY,
      Slugs.INTERN,
      Slugs.USER,
      Slugs.GUEST,
      Slugs.EDITOR,
    ],
    [Slugs.LAWYER]: [Slugs.SECRETARY, Slugs.INTERN, Slugs.USER],
    [Slugs.SECRETARY]: [Slugs.INTERN, Slugs.USER],
    [Slugs.INTERN]: [Slugs.USER],
    [Slugs.EDITOR]: [Slugs.USER],
    [Slugs.USER]: [Slugs.GUEST],
    [Slugs.GUEST]: [],
  }
}

export default IRole
