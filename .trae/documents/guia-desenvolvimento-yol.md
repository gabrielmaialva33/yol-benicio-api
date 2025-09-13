# Guia de Desenvolvimento - Sistema YOL Benício

## 1. Introdução

Este guia fornece todas as informações necessárias para desenvolvedores que trabalharão no Sistema YOL Benício. Abrange desde a configuração inicial do ambiente até padrões de código e práticas de desenvolvimento.

## 2. Pré-requisitos

### 2.1 Ferramentas Obrigatórias

| Ferramenta     | Versão Mínima | Propósito              |
| -------------- | ------------- | ---------------------- |
| **Node.js**    | 22.19.0+      | Runtime JavaScript     |
| **pnpm**       | 8.0+          | Gerenciador de pacotes |
| **PostgreSQL** | 15+           | Banco de dados         |
| **Redis**      | 7+            | Cache e sessões        |
| **Git**        | 2.30+         | Controle de versão     |

### 2.2 Ferramentas Recomendadas

- **VS Code** com extensões:
  - AdonisJS Extension Pack
  - TypeScript Hero
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier
- **Docker** (para ambiente containerizado)
- **Postman/Insomnia** (para testes de API)
- **DBeaver/pgAdmin** (para administração do banco)

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

- `snake_case` para arquivos: `user_controller.ts`
- `kebab-case` para diretórios: `user-management/`
- `PascalCase` para classes: `UserController`
- `camelCase` para métodos e variáveis: `getUserById`

**Banco de Dados:**

- Tabelas em `snake_case` plural: `users`, `user_roles`
- Colunas em `snake_case`: `full_name`, `created_at`
- Chaves estrangeiras: `user_id`, `role_id`

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

    const users = await User.query().preload('roles').paginate(page, limit)

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
    return this.roles.some((role) => role.slug === roleSlug)
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
   * Busca usuários com filtros
   */
  async searchUsers(filters: UserFilters) {
    const query = User.query()

    if (filters.name) {
      query.whereILike('full_name', `%${filters.name}%`)
    }

    if (filters.email) {
      query.whereILike('email', `%${filters.email}%`)
    }

    if (filters.role) {
      query.whereHas('roles', (roleQuery) => {
        roleQuery.where('slug', filters.role)
      })
    }

    return query.paginate(filters.page || 1, filters.limit || 20)
  }
}
```

## 6. Frontend com React + Inertia.js

### 6.1 Estrutura de Componentes

```typescript
// inertia/features/users/components/UserForm.tsx
import React from 'react'
import { useForm } from '@inertiajs/react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Card } from '@/shared/ui/Card'

interface UserFormProps {
  user?: User
  onSubmit?: () => void
}

export function UserForm({ user, onSubmit }: UserFormProps) {
  const { data, setData, post, put, processing, errors } = useForm({
    fullName: user?.fullName || '',
    email: user?.email || '',
    username: user?.username || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (user) {
      put(`/users/${user.id}`, {
        onSuccess: () => onSubmit?.()
      })
    } else {
      post('/users', {
        onSuccess: () => onSubmit?.()
      })
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome Completo"
          value={data.fullName}
          onChange={(e) => setData('fullName', e.target.value)}
          error={errors.fullName}
          required
        />

        <Input
          label="Email"
          type="email"
          value={data.email}
          onChange={(e) => setData('email', e.target.value)}
          error={errors.email}
          required
        />

        <Input
          label="Nome de Usuário"
          value={data.username}
          onChange={(e) => setData('username', e.target.value)}
          error={errors.username}
        />

        <div className="flex justify-end space-x-2">
          <Button type="submit" loading={processing}>
            {user ? 'Atualizar' : 'Criar'} Usuário
          </Button>
        </div>
      </form>
    </Card>
  )
}
```

### 6.2 Hooks Personalizados

```typescript
// inertia/shared/hooks/usePermissions.ts
import { usePage } from '@inertiajs/react'
import { PageProps } from '@/shared/types'

export function usePermissions() {
  const { auth } = usePage<PageProps>().props

  const hasPermission = (permission: string): boolean => {
    return auth.user.permissions?.includes(permission) || false
  }

  const hasRole = (role: string): boolean => {
    return auth.user.roles?.some((r) => r.slug === role) || false
  }

  const isAdmin = (): boolean => {
    return hasRole('admin') || hasRole('root')
  }

  return {
    hasPermission,
    hasRole,
    isAdmin,
    permissions: auth.user.permissions || [],
    roles: auth.user.roles || [],
  }
}
```

## 7. Testes

### 7.1 Configuração de Testes

```typescript
// tests/bootstrap.ts
import { assert } from '@japa/assert'
import { apiClient } from '@japa/api-client'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import { configure, processCLIArgs, run } from '@japa/runner'

processCLIArgs(process.argv.splice(2))

configure({
  files: ['tests/**/*.spec.ts'],
  plugins: [assert(), apiClient(), pluginAdonisJS()],
  reporters: {
    activated: ['spec'],
  },
  importer: (filePath) => import(filePath),
})

run()
```

### 7.2 Testes Funcionais

```typescript
// tests/functional/users/create_user.spec.ts
import { test } from '@japa/runner'
import User from '#models/user'

test.group('Users - Create', (group) => {
  group.each.setup(async () => {
    // Setup para cada teste
  })

  test('should create a new user', async ({ client, assert }) => {
    const userData = {
      fullName: 'João Silva',
      email: 'joao@example.com',
      password: '123456',
    }

    const response = await client.post('/users').json(userData)

    response.assertStatus(201)
    response.assertBodyContains({
      fullName: userData.fullName,
      email: userData.email,
    })

    const user = await User.findBy('email', userData.email)
    assert.isNotNull(user)
    assert.equal(user!.fullName, userData.fullName)
  })

  test('should validate required fields', async ({ client }) => {
    const response = await client.post('/users').json({})

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        { field: 'fullName', message: 'The fullName field is required' },
        { field: 'email', message: 'The email field is required' },
        { field: 'password', message: 'The password field is required' },
      ],
    })
  })
})
```

### 7.3 Testes Unitários

```typescript
// tests/unit/user/user_service.spec.ts
import { test } from '@japa/runner'
import { UserService } from '#modules/user/services/user_service'
import User from '#models/user'

test.group('UserService', () => {
  test('should create user with default role', async ({ assert }) => {
    const userService = new UserService()

    const userData = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: '123456',
    }

    const user = await userService.createUser(userData)
    await user.load('roles')

    assert.equal(user.fullName, userData.fullName)
    assert.equal(user.email, userData.email)
    assert.isTrue(user.roles.length > 0)
    assert.equal(user.roles[0].slug, 'user')
  })
})
```

## 8. Deploy e Produção

### 8.1 Build para Produção

```bash
# Build do frontend
pnpm build

# Build do backend (se necessário)
node ace build
```

### 8.2 Variáveis de Ambiente - Produção

```env
# .env.production
TZ=UTC
PORT=3333
HOST=0.0.0.0
LOG_LEVEL=info
APP_KEY=your-production-32-character-secret-key
NODE_ENV=production

# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
DB_DATABASE=yol_benicio_prod

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# JWT
JWT_SECRET=your-production-jwt-secret

# Mail
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USERNAME=your-smtp-user
SMTP_PASSWORD=your-smtp-password
```

### 8.3 Docker para Produção

```dockerfile
# Dockerfile
FROM node:22-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY . .

# Build da aplicação
RUN pnpm build

# Expor porta
EXPOSE 3333

# Comando de inicialização
CMD ["node", "bin/server.js"]
```

### 8.4 CI/CD com GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: yol_benicio_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test
        env:
          DB_HOST: localhost
          DB_PORT: 5432
          DB_USER: postgres
          DB_PASSWORD: postgres
          DB_DATABASE: yol_benicio_test
          REDIS_HOST: localhost
          REDIS_PORT: 6379
```

## 9. Troubleshooting

### 9.1 Problemas Comuns

**Erro de Conexão com Banco:**

```bash
# Verificar se PostgreSQL está rodando
brew services list | grep postgresql

# Reiniciar PostgreSQL
brew services restart postgresql
```

**Erro de Permissões:**

```bash
# Sincronizar permissões
node ace sync:permissions

# Verificar roles no banco
psql -d yol_benicio_dev -c "SELECT * FROM roles;"
```

**Problemas com Cache:**

```bash
# Limpar cache Redis
redis-cli FLUSHALL

# Reiniciar Redis
brew services restart redis
```

### 9.2 Logs e Debugging

```typescript
// Configurar logs detalhados
// config/logger.ts
export default defineConfig({
  default: 'app',
  loggers: {
    app: {
      enabled: true,
      name: env.get('APP_NAME'),
      level: env.get('LOG_LEVEL', 'info'),
      transport: {
        targets: [
          {
            target: 'pino-pretty',
            level: 'info',
            options: {
              colorize: true,
            },
          },
        ],
      },
    },
  },
})
```

## 10. Recursos Adicionais

### 10.1 Documentação Oficial

- [AdonisJS Documentation](https://docs.adonisjs.com/)
- [Inertia.js Documentation](https://inertiajs.com/)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

### 10.2 Ferramentas de Desenvolvimento

- [AdonisJS DevTools](https://github.com/adonisjs/devtools)
- [Lucid ORM](https://lucid.adonisjs.com/)
- [Vine Validator](https://vinejs.dev/)
- [Japa Testing](https://japa.dev/)

### 10.3 Comunidade

- [AdonisJS Discord](https://discord.gg/vDcEjq6)
- [GitHub Discussions](https://github.com/adonisjs/core/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/adonisjs)

---

**Última atualização:** Janeiro 2024  
**Versão do documento:** 1.0  
**Mantenedor:** Equipe de Desenvolvimento YOL Benício
