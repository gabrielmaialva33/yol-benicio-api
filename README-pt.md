<h1 align="center">
    <img src=".github/assets/images/logo.svg" height="200" alt="Logo Yol Benício">
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/versão-2025.1.0-blue?style=for-the-badge&logo=semantic-release" alt="Versão" />
  <img src="https://img.shields.io/github/license/gabrielmaialva33/yol-benicio-api?color=00b8d3&style=for-the-badge&logo=mit" alt="Licença" />
  <img src="https://img.shields.io/badge/Node.js-22.18.0-339933?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/AdonisJS-6.0-5A45FF?style=for-the-badge&logo=adonisjs" alt="AdonisJS" />
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PostgreSQL-16.0-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-7.0-DC382D?style=for-the-badge&logo=redis" alt="Redis" />
  <img src="https://img.shields.io/badge/Docker-Pronto-2496ED?style=for-the-badge&logo=docker" alt="Docker" />
  <img src="https://img.shields.io/github/last-commit/gabrielmaialva33/yol-benicio-api?style=for-the-badge&logo=git" alt="Último Commit" />
  <img src="https://img.shields.io/badge/feito%20com-❤️%20por%20Maia-15c3d6?style=for-the-badge" alt="Feito por Maia" />
</p>

<br>

<p align="center">
    <a href="README.md">English</a>
    ·
    <a href="README-pt.md">Portuguese</a>
</p>

<p align="center">
  <a href="#bookmark-about">Sobre</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#computer-technologies">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#wrench-tools">Ferramentas</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#package-installation">Instalação</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-license">Licença</a>
</p>

<br>

## :bookmark: Sobre

**Yol Benício API** é um sistema de gerenciamento jurídico de nova geração construído para 2025 com tecnologias de ponta. Apresentando um poderoso backend AdonisJS v6 e frontend moderno React 19 + Inertia.js, oferece funcionalidades abrangentes para gerenciar processos jurídicos, clientes, agendas, faturamento e fluxos de documentos. O sistema implementa princípios de arquitetura limpa com design modular pronto para microsserviços e apresenta um sistema inteligente de navegação baseado em papéis otimizado para diferentes personas de usuários em escritórios jurídicos.

### 🚀 **Novidades em 2025**

- **⚡ React 19**: Recursos mais recentes do React com renderização concorrente e batching automático
- **🎨 TailwindCSS v4**: Framework CSS de nova geração com performance aprimorada
- **🔒 Segurança Aprimorada**: Implementação JWT avançada com rotação de refresh tokens
- **📱 Mobile-First**: Design responsivo otimizado para todos os dispositivos
- **🧪### 🧪 Estratégia de Testes Abrangente

```mermaid
graph TB
    subgraph "Backend Testing"
        A[Japa Framework]
        B[Testes Unitários]
        C[Testes Funcionais]
        D[Testes de Integração]
    end
    
    subgraph "Frontend Testing"
        E[MSW - Mock Service Worker]
        F[React Testing Library]
        G[Testes de Componentes]
        H[Testes E2E]
    end
    
    subgraph "Cobertura e Qualidade"
        I[Relatórios de Cobertura]
        J[Análise de Código]
        K[Performance Testing]
        L[Testes de Acessibilidade]
    end
    
    A --> B
    A --> C
    A --> D
    E --> F
    E --> G
    E --> H
    
    style A fill:#FF6B6B
    style E fill:#4ECDC4
    style I fill:#45B7D1
```

#### 🔬 Recursos de Teste

- **Japa Framework**: Framework de testes moderno para Node.js com suporte TypeScript
- **MSW (Mock Service Worker)**: Interceptação de requisições para testes de frontend
- **Cobertura Completa**: Relatórios detalhados de cobertura de código
- **Testes Automatizados**: Pipeline CI/CD com execução automática de testes
- **Testes de Performance**: Benchmarking e análise de performance
- **Testes de Acessibilidade**: Conformidade com padrões WCAG
- **🐳 Deployment e Containerização**

```mermaid
graph TB
    subgraph "Desenvolvimento"
        A[Docker Compose]
        B[Hot Reload]
        C[Debug Mode]
        D[Volume Mapping]
    end
    
    subgraph "Staging"
        E[Build Otimizado]
        F[Health Checks]
        G[Load Balancing]
        H[SSL/TLS]
    end
    
    subgraph "Produção"
        I[Multi-stage Build]
        J[Imagens Minificadas]
        K[Secrets Management]
        L[Monitoring]
    end
    
    A --> E
    E --> I
    B --> F
    F --> J
    C --> G
    G --> K
    D --> H
    H --> L
    
    style A fill:#2496ED
    style E fill:#FFA500
    style I fill:#32CD32
```

#### 🚀 Recursos de Deploy

- **Multi-stage Builds**: Imagens Docker otimizadas para produção
- **Docker Compose**: Orquestração completa de serviços (API, DB, Redis)
- **Health Checks**: Monitoramento automático de saúde dos containers
- **Secrets Management**: Gerenciamento seguro de variáveis de ambiente
- **Load Balancing**: Distribuição de carga para alta disponibilidade
- **SSL/TLS**: Certificados automáticos com Let's Encrypt
- **⚡ Performance e Otimizações**

```mermaid
graph TB
    subgraph "Cache Strategy"
        A[Redis Cache]
        B[Query Cache]
        C[Session Cache]
        D[File Cache]
    end
    
    subgraph "Database Optimization"
        E[Índices Otimizados]
        F[Query Optimization]
        G[Connection Pooling]
        H[Read Replicas]
    end
    
    subgraph "Frontend Performance"
        I[Code Splitting]
        J[Lazy Loading]
        K[Asset Optimization]
        L[CDN Integration]
    end
    
    subgraph "Monitoring"
        M[APM Tools]
        N[Real-time Metrics]
        O[Error Tracking]
        P[Performance Alerts]
    end
    
    A --> E
    B --> F
    C --> G
    D --> H
    E --> I
    F --> J
    G --> K
    H --> L
    I --> M
    J --> N
    K --> O
    L --> P
    
    style A fill:#DC382D
    style E fill:#336791
    style I fill:#61DAFB
    style M fill:#FF6B6B
```

#### 🏎️ Otimizações Implementadas

- **Redis Cache**: Cache distribuído para sessões, consultas e dados temporários
- **Database Indexing**: Índices otimizados para consultas frequentes
- **Code Splitting**: Carregamento sob demanda de componentes React
- **Asset Optimization**: Minificação e compressão de assets estáticos
- **Connection Pooling**: Pool de conexões para melhor utilização de recursos
- **Real-time Monitoring**: Métricas de performance em tempo real
- **Rate Limiting**: Proteção contra abuso de API com limitação inteligente
- **Gzip Compression**: Compressão automática de respostas HTTP
- **🔍 Monitoramento em Tempo Real**: Health checks avançados e log de auditoria

### 🏗️ Visão Geral da Arquitetura

```mermaid
graph TB
    subgraph "Camada Frontend"
        REACT[React 19 + TypeScript]
        INERTIA[Inertia.js]
        TAILWIND[TailwindCSS v4]
    end

    subgraph "Camada Cliente"
        WEB[Aplicações Web]
        MOB[Aplicações Mobile]
        API[APIs Externas]
    end

    subgraph "Gateway API - v1"
        ROUTES["/api/v1/*"]
        MW[Stack de Middleware]
    end

    subgraph "Módulos"
        AUTH[Módulo Auth<br/>JWT, Sessões]
        USER[Módulo Usuário<br/>CRUD, Perfil]
        ROLE[Módulo Papel<br/>RBAC, Hierarquia]
        PERM[Módulo Permissão<br/>Contextual, Herança]
        FILE[Módulo Arquivo<br/>Upload, Armazenamento]
        AUDIT[Módulo Auditoria<br/>Logs, Analytics]
        HEALTH[Módulo Saúde<br/>Status, Monitoramento]
    end

    subgraph "Serviços Core"
        JWT[Serviço JWT]
        HASH[Serviço Hash]
        VALIDATOR[Serviço Validador]
        STORAGE[Serviço Armazenamento]
    end

    subgraph "Camada de Dados"
        TS[(PostgreSQL<br/>Banco Principal)]
        REDIS[(Redis<br/>Cache & Sessões)]
        PGREST[PostgREST<br/>API REST Auto-gerada]
    end

    REACT --> INERTIA
    INERTIA --> ROUTES
    WEB --> ROUTES
    MOB --> ROUTES
    API --> ROUTES

    ROUTES --> MW
    MW --> AUTH
    MW --> USER
    MW --> ROLE
    MW --> PERM
    MW --> FILE
    MW --> AUDIT
    MW --> HEALTH

    AUTH --> JWT
    AUTH --> HASH
    USER --> VALIDATOR
    FILE --> STORAGE
    PERM --> REDIS
    AUDIT --> TS

    USER --> TS
    ROLE --> TS
    PERM --> TS
    AUTH --> TS
    AUTH --> REDIS
    AUDIT --> TS

    TS --> PGREST

    style ROUTES fill:#4A90E2
    style TS fill:#336791
    style REDIS fill:#DC382D
    style PGREST fill:#008080
```

### 🎯 Arquitetura Frontend Moderna

```mermaid
graph TB
    subgraph "Frontend Stack 2025"
        A[React 19] --> B[Inertia.js]
        B --> C[TypeScript 5.0]
        C --> D[TailwindCSS v4]
    end
    
    subgraph "Componentes de Interface"
        E[Dashboard Responsivo]
        F[Sistema de Abas]
        G[Timeline Interativa]
        H[Formulários Dinâmicos]
        I[Modais e Overlays]
    end
    
    subgraph "Hooks Personalizados"
        J[useRoleRedirect]
        K[useAuth]
        L[useProcess]
        M[usePermissions]
        N[useNotifications]
    end
    
    subgraph "Gerenciamento de Estado"
        O[Context API]
        P[Inertia State]
        Q[Local Storage]
        R[Session Storage]
    end
    
    A --> E
    B --> F
    C --> G
    D --> H
    
    style A fill:#61DAFB
    style B fill:#9333EA
    style C fill:#3178C6
    style D fill:#06B6D4
```

#### 🔧 Recursos Avançados do Frontend

- **React 19**: Renderização concorrente, batching automático, Suspense aprimorado
- **Inertia.js**: SPA sem API, roteamento do lado do servidor, compartilhamento de estado
- **TypeScript 5.0**: Tipagem estática, intellisense avançado, refatoração segura
- **TailwindCSS v4**: Utilitários CSS, design system, responsividade mobile-first
- **Componentes Reutilizáveis**: Biblioteca de componentes modular e testável

### 🔐 Fluxo de Autenticação

```mermaid
sequenceDiagram
    participant C as Cliente
    participant API as Gateway API
    participant AUTH as Módulo Auth
    participant JWT as Serviço JWT
    participant DB as PostgreSQL
    participant REDIS as Cache Redis

    C->>API: POST /api/v1/sessions/sign-in
    API->>AUTH: Validar credenciais
    AUTH->>DB: Buscar usuário por email
    DB-->>AUTH: Dados do usuário
    AUTH->>AUTH: Verificar hash da senha
    AUTH->>JWT: Gerar tokens
    JWT-->>AUTH: Tokens de acesso & refresh
    AUTH->>REDIS: Armazenar sessão
    AUTH-->>C: Retornar tokens + dados do usuário

    Note over C,API: Requisições subsequentes

    C->>API: GET /api/v1/users (Bearer token)
    API->>AUTH: Validar JWT
    AUTH->>REDIS: Verificar sessão
    REDIS-->>AUTH: Sessão válida
    AUTH-->>API: Usuário autenticado
    API-->>C: Retornar recurso protegido
```

### 📁 Estrutura Modular

```mermaid
graph TD
    subgraph "Estrutura da Aplicação"
        APP[app/]
        MODULES[modules/]

        subgraph "Módulo Usuário"
            USER_M[user/]
        end
        subgraph "Módulo Papel"
            ROLE_M[role/]
        end
        subgraph "Módulo Permissão"
            PERM_M[permission/]
        end
        subgraph "Módulo Arquivo"
            FILE_M[file/]
        end
        subgraph "Módulo Auditoria"
            AUDIT_M[audit/]
        end
        subgraph "Módulo Saúde"
            HEALTH_M[health/]
        end
        subgraph "Módulo Propriedade"
            OWNER_M[ownership/]
        end
    end

    APP --> MODULES
    MODULES --> USER_M
    MODULES --> ROLE_M
    MODULES --> PERM_M
    MODULES --> FILE_M
    MODULES --> AUDIT_M
    MODULES --> HEALTH_M
    MODULES --> OWNER_M
```

## 🌟 Principais Funcionalidades

### Funcionalidades Core

- **🔐 Autenticação JWT**: Autenticação segura baseada em tokens com refresh tokens
- **👥 Controle de Acesso Baseado em Papéis**: Permissões refinadas com papéis ROOT, ADMIN, USER, EDITOR e GUEST
- **📁 Arquitetura Modular**: Clara separação de responsabilidades com módulos de funcionalidades
- **🗄️ PostgreSQL**: Banco de dados robusto e confiável
- **🚀 API RESTful**: Endpoints bem estruturados seguindo princípios REST
- **📤 Upload de Arquivos**: Manipulação segura de arquivos com múltiplos drivers de armazenamento
- **🏥 Monitoramento de Saúde**: Endpoints integrados para verificação de saúde
- **🔒 Segurança em Primeiro Lugar**: Hash de senhas, CORS, rate limiting pronto
- **📝 Validação de Requisições**: DTOs com validação em tempo de execução

### Funcionalidades Frontend

- **⚛️ React 19**: React moderno com recursos e melhorias de performance mais recentes
- **🔄 Inertia.js**: Experiência SPA sem complexidade de API
- **📘 TypeScript**: Segurança de tipos completa entre frontend e backend
- **🎨 TailwindCSS v4**: Framework CSS moderno utility-first
- **🧪 Testes MSW**: Mock Service Worker para testes abrangentes do frontend
- **📱 Design Responsivo**: Abordagem mobile-first com otimização para desktop

### Sistema de Navegação Baseado em Papéis

- **👨‍💼 Dashboard do Gestor**: Acesso completo com gerenciamento de equipe e relatórios
- **👤 Dashboard do Cliente**: Visão limitada focada em processos pessoais
- **👨‍💻 Dashboard do Colaborador**: Operações diárias com consulta processual e timeline
- **🔄 Redirecionamentos Inteligentes**: Roteamento automático baseado em papéis após autenticação
- **🛡️ Guardas de Permissão**: Controle de acesso em nível de rota baseado em papéis de usuário
- **🌐 Pronto para i18n**: Suporte a internacionalização integrado
- **🔗 Integração PostgREST**: API REST auto-gerada para acesso direto ao banco

### Funcionalidades Avançadas de ACL

- **🎯 Permissões Contextuais**: Suporte para contextos `own`, `any`, `team` e `department`
- **🔄 Herança de Permissões**: Herança automática de permissões através da hierarquia de papéis
- **📋 Trilha de Auditoria Completa**: Rastreamento de todas as verificações de permissão e tentativas de acesso
- **⚡ Permissões em Cache Redis**: Verificação de permissões de alta performance com cache inteligente
- **🏢 Propriedade de Recursos**: Sistema de propriedade integrado com suporte a contextos de equipe e departamento
- **🔍 Controle Granular de Permissões**: Sistema de permissões baseado em Recurso + Ação + Contexto

### Esquema do Banco de Dados

```mermaid
erDiagram
    USERS ||--o{ USER_ROLES : possui
    ROLES ||--o{ USER_ROLES : possui
    USERS ||--o{ USER_PERMISSIONS : possui
    USERS ||--o{ FILES : envia
    ROLES ||--o{ ROLE_PERMISSIONS : possui
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : possui
    PERMISSIONS ||--o{ USER_PERMISSIONS : possui
    USERS ||--o{ AUDIT_LOGS : gera

    USERS {
        bigint id PK
        string first_name
        string last_name
        string email UK
        string username UK
        string password
        string avatar_url
        boolean is_online
        timestamp deleted_at
        timestamp created_at
        timestamp updated_at
    }

    ROLES {
        bigint id PK
        string name
        string slug UK
        string description
        timestamp created_at
        timestamp updated_at
    }

    PERMISSIONS {
        bigint id PK
        string name UK
        string resource
        string action
        string context
        string description
        timestamp created_at
        timestamp updated_at
    }

    USER_ROLES {
        bigint id PK
        bigint user_id FK
        bigint role_id FK
        timestamp created_at
        timestamp updated_at
    }

    ROLE_PERMISSIONS {
        bigint id PK
        bigint role_id FK
        bigint permission_id FK
        timestamp created_at
        timestamp updated_at
    }

    USER_PERMISSIONS {
        bigint id PK
        bigint user_id FK
        bigint permission_id FK
        boolean granted
        timestamp expires_at
        timestamp created_at
        timestamp updated_at
    }

    AUDIT_LOGS {
        bigint id PK
        bigint user_id FK
        string resource
        string action
        string context
        bigint resource_id
        string result
        string reason
        string ip_address
        string user_agent
        json metadata
        timestamp created_at
    }

    FILES {
        bigint id PK
        bigint owner_id FK
        string client_name
        string file_name
        bigint file_size
        string file_type
        string file_category
        string url
        timestamp created_at
        timestamp updated_at
    }
```

<br>

## :computer: Tecnologias

- **[Typescript](https://www.typescriptlang.org/)**
- **[Node.js](https://nodejs.org/)**
- **[AdonisJS](https://adonisjs.com/)**
- **[PostgreSQL](https://www.postgresql.org/)**
- **[Redis](https://redis.io/)** - Armazenamento de dados em memória
- **[PostgREST](https://postgrest.org/)** - API REST auto-gerada
- **[Docker](https://www.docker.com/)**

<br>

## :wrench: Ferramentas

- **[WebStorm](https://www.jetbrains.com/webstorm/)**
- **[Insomnia](https://insomnia.rest/)**
- **[DataGrip](https://www.jetbrains.com/datagrip/)**

<br>

## 🧭 Fluxo de Navegação Baseado em Papéis

O sistema YOL Benício implementa um fluxo de navegação inteligente que adapta a experiência do usuário baseado em seu papel no sistema.

### Fluxo Principal de Navegação

```mermaid
flowchart TD
    A[Login] --> B{Verificar Papel}
    B -->|Gestor| C[Dashboard Gestor]
    B -->|Cliente| D[Dashboard Cliente]
    B -->|Colaborador| E[Dashboard Colaborador]

    E --> F[Consulta Processual]
    F --> G[Detalhes do Processo]
    G --> H[Timeline de Movimentações]

    C --> I[Gerenciamento de Equipe]
    C --> J[Relatórios Gerenciais]

    D --> K[Meus Processos]
    D --> L[Documentos Pessoais]
```

### Fluxo Principal de Navegação (Colaborador)

O fluxo principal do sistema segue a jornada de um **Colaborador**:

1. **Login** → Autenticação segura com JWT
2. **Dashboard Colaborador** → Visão geral das tarefas e processos atribuídos
3. **Consulta Processual** → Busca e filtros avançados de processos
4. **Detalhes do Processo** → Visualização completa com abas organizadas
5. **Timeline** → Histórico cronológico de movimentações e atualizações

### Definição de Papéis

| Papel           | Nível de Acesso | Funcionalidades Principais                                    |
| --------------- | --------------- | ------------------------------------------------------------- |
| **Gestor**      | Completo        | Gerenciamento de equipe, relatórios, configurações do sistema |
| **Cliente**     | Limitado        | Visualização de processos pessoais, documentos, agendamentos  |
| **Colaborador** | Operacional     | Consulta processual, timeline, gestão de casos atribuídos     |

## :package: Instalação

### :heavy_check_mark: **Pré-requisitos**

Os seguintes softwares devem estar instalados:

- **[Node.js](https://nodejs.org/en/) 22+**
- **[Git](https://git-scm.com/)**
- **[PNPM](https://pnpm.io/) (recomendado)**, ou **[NPM](https://www.npmjs.com/)** / **[Yarn](https://yarnpkg.com/)**
- **[PostgreSQL](https://www.postgresql.org/download/)** ou **[Docker](https://www.docker.com/get-started/)**

<br>

### :arrow_down: **Clonando o repositório**

```sh
    $ git clone https://github.com/gabrielmaialva33/yol-benicio-api.git
```

<br>

### :arrow_forward: **Rodando o backend**

````sh
 :package: API

```sh
    $ cd yol-benicio-api
    # Instalação de dependências
    $ pnpm install  # ou npm install / yarn
    # Configuração ambiente de sistema
    $ cp .env.example .env
    # Criar estrutura do banco (garanta Postgres/Redis ativos)
    $ node ace migration:run  # ou docker compose -f docker-compose.dev.yml up --build
    # Iniciar API
    $ pnpm dev  # ou node ace serve --hmr
````

> Opcional: Usar Docker para tudo

> ```sh
> docker compose -f docker-compose.dev.yml up --build
> ```

````

<br>

## :twisted_rightwards_arrows: Rotas da API

A API é versionada e todos os endpoints são prefixados com `/api/v1/`. Abaixo está a estrutura completa de rotas:

### 🛣️ Organização das Rotas

```mermaid
graph LR
    subgraph "Rotas Públicas"
        HOME[GET /]
        HEALTH[GET /api/v1/health]
        SIGNIN[POST /api/v1/sessions/sign-in]
        SIGNUP[POST /api/v1/sessions/sign-up]
    end

    subgraph "Rotas Protegidas"
        subgraph "Rotas de Usuário"
            USER_LIST[GET /api/v1/users]
            USER_GET[GET /api/v1/users/:id]
            USER_CREATE[POST /api/v1/users]
            USER_UPDATE[PUT /api/v1/users/:id]
            USER_DELETE[DELETE /api/v1/users/:id]
        end

        subgraph "Rotas Admin"
            ROLE_LIST[GET /api/v1/admin/roles]
            ROLE_ATTACH[PUT /api/v1/admin/roles/attach]
        end

        subgraph "Rotas de Arquivo"
            FILE_UPLOAD[POST /api/v1/files/upload]
        end
    end

    style HOME fill:#90EE90
    style HEALTH fill:#90EE90
    style SIGNIN fill:#90EE90
    style SIGNUP fill:#90EE90
    style ROLE_LIST fill:#FFB6C1
    style ROLE_ATTACH fill:#FFB6C1
````

### 📋 Detalhes das Rotas

| Método     | Endpoint                                    | Descrição                           | Auth Obrigatória | Permissão/Papel    |
| ---------- | ------------------------------------------- | ----------------------------------- | ---------------- | ------------------ |
| **GET**    | `/`                                         | Informações da API                  | ❌               | -                  |
| **GET**    | `/api/v1/health`                            | Verificação de saúde                | ❌               | -                  |
| **POST**   | `/api/v1/sessions/sign-in`                  | Login de usuário                    | ❌               | -                  |
| **POST**   | `/api/v1/sessions/sign-up`                  | Registro de usuário                 | ❌               | -                  |
| **GET**    | `/api/v1/verify-email`                      | Verificar email do usuário          | ❌               | -                  |
| **POST**   | `/api/v1/resend-verification-email`         | Reenviar email de verificação       | ✅               | -                  |
| **GET**    | `/api/v1/me`                                | Obter perfil do usuário atual       | ✅               | -                  |
| **GET**    | `/api/v1/me/permissions`                    | Obter permissões do usuário atual   | ✅               | -                  |
| **GET**    | `/api/v1/me/roles`                          | Obter papéis do usuário atual       | ✅               | -                  |
| **GET**    | `/api/v1/users`                             | Listar usuários (paginado)          | ✅               | users.list         |
| **GET**    | `/api/v1/users/:id`                         | Obter usuário por ID                | ✅               | users.read         |
| **POST**   | `/api/v1/users`                             | Criar usuário                       | ✅               | users.create       |
| **PUT**    | `/api/v1/users/:id`                         | Atualizar usuário                   | ✅               | users.update       |
| **DELETE** | `/api/v1/users/:id`                         | Deletar usuário                     | ✅               | users.delete       |
| **GET**    | `/api/v1/admin/roles`                       | Listar papéis                       | ✅               | ROOT, ADMIN        |
| **PUT**    | `/api/v1/admin/roles/attach`                | Atribuir papel ao usuário           | ✅               | ROOT, ADMIN        |
| **GET**    | `/api/v1/admin/permissions`                 | Listar permissões                   | ✅               | permissions.list   |
| **POST**   | `/api/v1/admin/permissions`                 | Criar permissão                     | ✅               | permissions.create |
| **PUT**    | `/api/v1/admin/roles/permissions/sync`      | Sincronizar permissões do papel     | ✅               | permissions.update |
| **PUT**    | `/api/v1/admin/roles/permissions/attach`    | Anexar permissões ao papel          | ✅               | permissions.update |
| **PUT**    | `/api/v1/admin/roles/permissions/detach`    | Desanexar permissões do papel       | ✅               | permissions.update |
| **PUT**    | `/api/v1/admin/users/permissions/sync`      | Sincronizar permissões do usuário   | ✅               | permissions.update |
| **GET**    | `/api/v1/admin/users/:id/permissions`       | Obter permissões diretas do usuário | ✅               | permissions.list   |
| **POST**   | `/api/v1/admin/users/:id/permissions/check` | Verificar permissões do usuário     | ✅               | permissions.list   |
| **POST**   | `/api/v1/files/upload`                      | Upload de arquivo                   | ✅               | files.create       |

### 🔄 Fluxo de Requisição/Resposta

```mermaid
sequenceDiagram
    participant Cliente
    participant Router
    participant Middleware
    participant Controller
    participant Service
    participant Repository
    participant Database

    Cliente->>Router: Requisição HTTP
    Router->>Middleware: Match de Rota

    alt Rota Protegida
        Middleware->>Middleware: Verificação Auth
        Middleware->>Middleware: Verificação ACL
    end

    Middleware->>Controller: Requisição Validada
    Controller->>Service: Lógica de Negócio
    Service->>Repository: Acesso aos Dados
    Repository->>Database: Query
    Database-->>Repository: Resultado
    Repository-->>Service: Entidade/DTO
    Service-->>Controller: Dados de Resposta
    Controller-->>Cliente: Resposta HTTP
```

### 🔐 Sistema de Permissões

O sistema avançado de permissões suporta controle de acesso contextual:

```mermaid
graph TD
    subgraph "Estrutura de Permissão"
        P[Permissão]
        P --> R[Recurso]
        P --> A[Ação]
        P --> C[Contexto]

        R --> |exemplos| R1[users]
        R --> |exemplos| R2[files]
        R --> |exemplos| R3[permissions]

        A --> |exemplos| A1[create]
        A --> |exemplos| A2[read]
        A --> |exemplos| A3[update]
        A --> |exemplos| A4[delete]
        A --> |exemplos| A5[list]

        C --> |exemplos| C1[own - Apenas recursos próprios]
        C --> |exemplos| C2[any - Qualquer recurso]
        C --> |exemplos| C3[team - Recursos da equipe]
        C --> |exemplos| C4[department - Recursos do departamento]
    end
```

#### Hierarquia de Papéis e Herança

```
ROOT
├── ADMIN (herda todas as permissões ROOT)
│   ├── USER (herda permissões básicas ADMIN)
│   │   └── GUEST (herda permissões limitadas USER)
│   └── EDITOR (herda permissões de conteúdo ADMIN)
       └── USER (herda de EDITOR)
```

#### Exemplos de Contexto

- `users.update.own` - Pode atualizar apenas o próprio perfil
- `users.update.any` - Pode atualizar qualquer usuário
- `files.delete.team` - Pode deletar arquivos de membros da equipe
- `reports.read.department` - Pode ler relatórios do próprio departamento

### 📥 Coleções & Documentação da API

- Arquivo de requisições HTTP: `docs/api.http` (importe no VS Code REST Client ou Insomnia)
- Especificação OpenAPI: `docs/openapi.yaml`
- Redoc (HTML estático): `docs/redoc.html`

## :memo: Licença

O projeto está sobre a licença [MIT](./LICENSE) ❤️

Gostou? Deixe uma estrela para ajudar o projeto ⭐

<br>

<p align="center">
  <img src="https://raw.githubusercontent.com/gabrielmaialva33/gabrielmaialva33/master/assets/gray0_ctp_on_line.svg?sanitize=true" />
</p>

<p align="center">
  &copy; 2017-present <a href="https://github.com/gabrielmaialva33/" target="_blank">Maia</a>
</p>
