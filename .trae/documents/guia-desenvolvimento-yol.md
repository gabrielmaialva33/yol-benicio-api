# Guia de Desenvolvimento - Sistema YOL Benício

## 1. Introdução

Este guia fornece todas as informações necessárias para desenvolvedores que trabalharão no Sistema YOL Benício. Abrange desde a configuração inicial do ambiente até padrões de código e práticas de desenvolvimento.

## 2. Pré-requisitos

### 2.1 Ferramentas Obrigatórias

| Ferramenta     | Versão Mínima | Propósito              |
| -------------- | ------------- | ---------------------- |
| **Node.js**    | 22.18.0+      | Runtime JavaScript     |
| **pnpm**       | 8.0+          | Gerenciador de pacotes |
| **PostgreSQL** | 15+           | Banco de dados         |
| **Redis**      | 7+            | Cache e sessões        |
| **Git**        | 2.30+         | Controle de versão     |

### 2.2 Ferramentas Recomendadas

* **VS Code** com extensões:

  * AdonisJS Extension Pack

  * TypeScript Hero

  * Tailwind CSS IntelliSense

  * ESLint

  * Prettier

* **Docker** (para ambiente containerizado)

* **Postman/Insomnia** (para testes de API)

* **DBeaver/pgAdmin** (para administração do banco)

## 3. Setup do Ambiente

### 3.1 Clonagem e Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/yol-benicio-api.git
cd yol-benicio-api

# Instalar dependências
pnpm install

# Copiar arquivo de ambiente
cp .env.example .env
```

### 3.2 Configuração do Banco de Dados

**Opção 1: PostgreSQL Local**

```bash
# Instalar PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Criar banco de dados
createdb yol_benicio_dev
createdb yol_benicio_test
```

**Opção 2: Docker**

```bash
# Subir serviços com Docker Compose
docker-compose -f docker-compose.dev.yml up -d
```

### 3.3 Configuração do Redis

```bash
# Instalar Redis (macOS)
brew install redis
brew services start redis

# Ou via Docker (já incluído no docker-compose.dev.yml)
```

### 3.4 Variáveis de Ambiente

```env
# .env
TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=your-32-character-secret-key
NODE_ENV=development

# Database
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=yol_benicio_dev

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-jwt-secret-key

# Mail (desenvolvimento)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USERNAME=
SMTP_PASSWORD=
```

### 3.5 Executar Migrações e Seeds

```bash
# Executar migrações
node ace migration:run

# Executar seeds (dados iniciais)
node ace db:seed

# Sincronizar permissões
node ace sync:permissions
```

### 3.6 Iniciar o Servidor

```bash
# Desenvolvimento (com hot reload)
pnpm dev

# Ou usando o AdonisJS CLI
node ace serve --hmr

# Servidor estará disponível em http://localhost:3333
```

## 4. Estrutura do Projeto

### 4.1 Organização de Diretórios

```
yol-benicio-api/
├── app/                    # Código da aplicação
│   ├── controllers/        # Controladores HTTP
│   ├── middleware/         # Middlewares personalizados
│   ├── models/            # Modelos Lucid
│   ├── modules/           # Módulos de negócio
│   │   ├── auth/          # Autenticação
│   │   ├── user/          # Usuários
│   │   ├── role/          # Papéis
│   │   ├── permission/    # Permissões
│   │   ├── folder/        # Pastas/Processos
│   │   ├── file/          # Arquivos
│   │   ├── audit/         # Auditoria
│   │   └── health/        # Health checks
│   ├── validators/        # Validadores Vine
│   └── exceptions/        # Exceções personalizadas
├── config/                # Configurações
├── database/              # Migrações, seeds, factories
├── inertia/               # Frontend React
│   ├── pages/             # Páginas Inertia
│   ├── features/          # Funcionalidades por módulo
│   ├── shared/            # Componentes compartilhados
│   └── mocks/             # Mocks para testes
├── resources/             # Recursos (views, lang)
├── start/                 # Arquivos de inicialização
├── tests/                 # Testes automatizados
└── types/                 # Definições de tipos
```

### 4.2 Arquitetura Modular

Cada módulo segue a estrutura:

```
app/modules/exemplo/
├── controllers/           # Controladores do módulo
├── models/               # Modelos específicos
├── services/             # Lógica de negócio
├── validators/           # Validações específicas
├── types/                # Tipos TypeScript
├── exceptions/           # Exceções do módulo
└── tests/                # Testes do módulo
```

## 5. Padrões de Desenvolvimento

### 5.1 Convenções de Nomenclatura

**Arquivos e Diretórios:**

* `snake_case` para arquivos: `user_controller.ts`

* `kebab-case` para diretórios: `user-management/`

* `PascalCase` para classes: `UserController`

* `camelCase` para métodos e variáveis: `getUserById`

**Banco de Dados:**

* Tabelas em `snake_case` plural: `users`, `user_roles`

* Colunas em `snake_case`: `full_name`, `created_at`

* Chaves estrangeiras: `user_id`, `role_id`

### 5.2 Estrutura de Controladores

```typescript
// app/controllers/users_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/user'

export default class UsersController {
  /**
   * Lista todos os usuários com paginação
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    
    const users = await User.query()
      .preload('roles')
      .paginate(page, limit)
    
    return response.ok(users)
  }

  /**
   * Cria um novo usuário
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)
    const user = await User.create(payload)
    
    return response.created(user)
  }

  /**
   * Exibe um usuário específico
   */
  async show({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.load('roles')
    
    return response.ok(user)
  }

  /**
   * Atualiza um usuário
   */
  async update({ params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const payload = await request.validateUsing(updateUserValidator)
    
    user.merge(payload)
    await user.save()
    
    return response.ok(user)
  }

  /**
   * Remove um usuário (soft delete)
   */
  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    
    return response.noContent()
  }
}
```

### 5.3 Estrutura de Modelos

```typescript
// app/models/user.ts
import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import Role from './role.js'
import Folder from './folder.js'
import hash from '@adonisjs/core/services/hash'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Role, {
    pivotTable: 'user_roles',
  })
  declare roles: ManyToMany<typeof Role>

  @hasMany(() => Folder)
  declare folders: HasMany<typeof Folder>

  /**
   * Hash da senha antes de salvar
   */
  static async beforeSave(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }

  /**
   * Verifica se o usuário tem um papel específico
   */
  async hasRole(roleSlug: string): Promise<boolean> {
    await this.load('roles')
    return this.roles.some(role => role.slug === roleSlug)
  }

  /**
   * Verifica se o usuário tem uma permissão específica
   */
  async hasPermission(permission: string): Promise<boolean> {
    // Implementação da verificação de permissão
    return true // Placeholder
  }
}
```

### 5.4 Estrutura de Validadores

```typescript
// app/validators/user.ts
import vine from '@vinejs/vine'

/**
 * Validador para criação de usuário
 */
export const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(255),
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(6).maxLength(255),
    username: vine.string().trim().minLength(3).maxLength(50).optional(),
  })
)

/**
 * Validador para atualização de usuário
 */
export const updateUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(255).optional(),
    email: vine.string().email().normalizeEmail().optional(),
    username: vine.string().trim().minLength(3).maxLength(50).optional(),
  })
)

/**
 * Validador para login
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(1),
  })
)
```

### 5.5 Estrutura de Services

```typescript
// app/modules/user/services/user_service.ts
import User from '#models/user'
import Role from '#models/role'
import { CreateUserData, UpdateUserData } from '../types/user_types.js'

export class UserService {
  /**
   * Cria um novo usuário com papel padrão
   */
  async createUser(data: CreateUserData): Promise<User> {
    const user = await User.create(data)
    
    // Atribuir papel padrão
    const defaultRole = await Role.findByOrFail('slug', 'user')
    await user.related('roles').attach([defaultRole.id])
    
    return user
  }

  /**
   * Atualiza dados do usuário
   */
  async updateUser(userId: number, data: UpdateUserData): Promise<User> {
    const user = await User.findOrFail(userId)
    user.merge(data)
    await user.save()
    
    return user
  }

  /**
```

