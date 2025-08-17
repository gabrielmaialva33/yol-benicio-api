<h1 align="center">
    <img src=".github/assets/images/logo.svg" height="200" alt="Yol Benício Logo">
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/version-2025.1.0-blue?style=for-the-badge&logo=semantic-release" alt="Version" />
  <img src="https://img.shields.io/github/license/gabrielmaialva33/yol-benicio-api?color=00b8d3&style=for-the-badge&logo=mit" alt="License" />
  <img src="https://img.shields.io/badge/Node.js-22.18.0-339933?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/AdonisJS-6.0-5A45FF?style=for-the-badge&logo=adonisjs" alt="AdonisJS" />
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PostgreSQL-16.0-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-7.0-DC382D?style=for-the-badge&logo=redis" alt="Redis" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker" alt="Docker" />
  <img src="https://img.shields.io/github/last-commit/gabrielmaialva33/yol-benicio-api?style=for-the-badge&logo=git" alt="Last Commit" />
  <img src="https://img.shields.io/badge/made%20with-❤️%20by%20Maia-15c3d6?style=for-the-badge" alt="Made by Maia" />
</p>

<br>

<p align="center">
    <a href="README.md">English</a>
    ·
    <a href="README-pt.md">Portuguese</a>
</p>

<p align="center">
  <a href="#bookmark-about">About</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#computer-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#wrench-tools">Tools</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#package-installation">Installation</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-license">License</a>
</p>

<br>

## :bookmark: About

**Yol Benício API** is a next-generation legal management system built for 2025 with cutting-edge technologies. Featuring a powerful AdonisJS v6 backend and modern React 19 + Inertia.js frontend, it delivers comprehensive functionality for managing legal processes, clients, schedules, billing, and document workflows. The system implements clean architecture principles with microservice-ready modular design and features an intelligent role-based navigation system optimized for different user personas in legal offices.

### 🚀 **What's New in 2025**

- **⚡ React 19**: Latest React features with concurrent rendering and automatic batching
- **🎨 TailwindCSS v4**: Next-generation CSS framework with improved performance
- **🔒 Enhanced Security**: Advanced JWT implementation with refresh token rotation
- **📱 Mobile-First**: Responsive design optimized for all devices
- **🧪 Comprehensive Testing**: Full test coverage with Japa and MSW
- **🐳 Docker Ready**: Production-ready containerization
- **⚡ Performance Optimized**: Redis caching and query optimization
- **🔍 Real-time Monitoring**: Advanced health checks and audit logging

### 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        REACT[React 19 + TypeScript]
        INERTIA[Inertia.js]
        TAILWIND[TailwindCSS v4]
    end

    subgraph "Client Layer"
        WEB[Web Apps]
        MOB[Mobile Apps]
        API[External APIs]
    end

    subgraph "API Gateway - v1"
        ROUTES["/api/v1/*"]
        MW[Middleware Stack]
    end

    subgraph "Modules"
        AUTH[Auth Module<br/>JWT, Sessions]
        USER[User Module<br/>CRUD, Profile]
        ROLE[Role Module<br/>RBAC, Hierarchy]
        PERM[Permission Module<br/>Context-aware, Inheritance]
        FILE[File Module<br/>Upload, Storage]
        AUDIT[Audit Module<br/>Logging, Analytics]
        HEALTH[Health Module<br/>Status, Monitoring]
    end

    subgraph "Core Services"
        JWT[JWT Service]
        HASH[Hash Service]
        VALIDATOR[Validator Service]
        STORAGE[Storage Service]
    end

    subgraph "Data Layer"
        TS[(PostgreSQL<br/>Main Database)]
        REDIS[(Redis<br/>Cache & Sessions)]
        PGREST[PostgREST<br/>Auto-generated REST API]
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

### 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant API as API Gateway
    participant AUTH as Auth Module
    participant JWT as JWT Service
    participant DB as PostgreSQL
    participant REDIS as Redis Cache

    C->>API: POST /api/v1/sessions/sign-in
    API->>AUTH: Validate credentials
    AUTH->>DB: Find user by email
    DB-->>AUTH: User data
    AUTH->>AUTH: Verify password hash
    AUTH->>JWT: Generate tokens
    JWT-->>AUTH: Access & Refresh tokens
    AUTH->>REDIS: Store session
    AUTH-->>C: Return tokens + user data

    Note over C,API: Subsequent requests

    C->>API: GET /api/v1/users (Bearer token)
    API->>AUTH: Validate JWT
    AUTH->>REDIS: Check session
    REDIS-->>AUTH: Session valid
    AUTH-->>API: User authenticated
    API-->>C: Return protected resource
```

### 📁 Module Structure

```mermaid
graph TD
    subgraph "Application Structure"
        APP[app/]
        MODULES[modules/]

        subgraph "User Module"
            USER_M[user/]
        end
        subgraph "Role Module"
            ROLE_M[role/]
        end
        subgraph "Permission Module"
            PERM_M[permission/]
        end
        subgraph "File Module"
            FILE_M[file/]
        end
        subgraph "Audit Module"
            AUDIT_M[audit/]
        end
        subgraph "Health Module"
            HEALTH_M[health/]
        end
        subgraph "Ownership Module"
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

### 🔄 Role-Based Navigation Flow

The system implements an intelligent navigation flow optimized for different user personas:

```mermaid
graph TD
    A[🔐 Login] --> B{👤 User Role?}
    B -->|👨‍💼 Manager| C[📊 Manager Dashboard]
    B -->|👤 Client| D[📋 Client Dashboard]
    B -->|👥 Collaborator| E[⚡ Collaborator Dashboard]

    C --> F[📁 Process Consultation]
    D --> F
    E --> F

    F --> G[📄 Main Process View]
    G --> H[⏱️ Timeline & Movements]
    G --> I[📎 Documents]
    G --> J[💰 Financial]
    G --> K[📅 Schedule]

    style A fill:#4A90E2,color:#fff
    style B fill:#FF6B6B,color:#fff
    style C fill:#4ECDC4,color:#fff
    style D fill:#45B7D1,color:#fff
    style E fill:#96CEB4,color:#fff
end
```    B -->|Collaborator| E[Collaborator Dashboard]

    E --> F[Process Consultation]
    F --> G[Process Details - Main Tab]
    G --> H[Timeline]
    H --> G
    G --> F
    E --> F

    C --> I[Complete Management View]
    D --> J[Limited Client View]
```

#### Main Navigation Flow (Collaborator Focus):

1. **Login** → Credential validation with role-based redirect
2. **Collaborator Dashboard** → Personalized overview with:
   - Active folders
   - Upcoming hearings
   - Pending tasks
   - Quick access to process consultation
3. **Process Consultation** → Search and filtering interface
4. **Process Details** → Main information tab
5. **Timeline** → Movement history and updates

#### User Role Definitions:

| Role             | Access Level | Primary Functions                                           |
| ---------------- | ------------ | ----------------------------------------------------------- |
| **Manager**      | Full access  | Team management, reporting, complete system access          |
| **Client**       | Limited      | View personal processes, limited consultations              |
| **Collaborator** | Operational  | Daily operations, process consultation, timeline management |

## 🌟 Key Features

### Core Features

- **🔐 JWT Authentication**: Secure token-based authentication with refresh tokens
- **👥 Role-Based Access Control**: Fine-grained permissions with ROOT, ADMIN, USER, EDITOR, and GUEST roles
- **📁 Modular Architecture**: Clean separation of concerns with feature modules
- **🗄️ PostgreSQL**: Robust and reliable database
- **🚀 RESTful API**: Well-structured endpoints following REST principles
- **📤 File Uploads**: Secure file handling with multiple storage drivers
- **🏥 Health Monitoring**: Built-in health check endpoints
- **🔒 Security First**: Password hashing, CORS, rate limiting ready
- **📝 Request Validation**: DTOs with runtime validation

### Frontend Features

- **⚛️ React 19**: Modern React with latest features and performance improvements
- **🔄 Inertia.js**: SPA experience without API complexity
- **📘 TypeScript**: Full type safety across frontend and backend
- **🎨 TailwindCSS v4**: Modern utility-first CSS framework
- **🧪 MSW Testing**: Mock Service Worker for comprehensive frontend testing
- **📱 Responsive Design**: Mobile-first approach with desktop optimization

### Role-Based Navigation System

- **👨‍💼 Manager Dashboard**: Complete access with team management and reporting
- **👤 Client Dashboard**: Limited view focused on personal processes
- **👨‍💻 Collaborator Dashboard**: Daily operations with process consultation and timeline
- **🔄 Smart Redirects**: Automatic role-based routing after authentication
- **🛡️ Permission Guards**: Route-level access control based on user roles
- **🌐 i18n Ready**: Internationalization support built-in
- **🔗 PostgREST Integration**: Auto-generated REST API for direct database access

### Advanced ACL Features

- **🎯 Context-Aware Permissions**: Support for `own`, `any`, `team`, and `department` contexts
- **🔄 Permission Inheritance**: Automatic permission inheritance through role hierarchy
- **📋 Comprehensive Audit Trail**: Track all permission checks and access attempts
- **⚡ Redis-Cached Permissions**: High-performance permission checking with intelligent caching
- **🏢 Resource Ownership**: Built-in ownership system supporting team and department contexts
- **🔍 Granular Permission Control**: Resource + Action + Context based permission system

### Database Schema

```mermaid
erDiagram
    USERS ||--o{ USER_ROLES : has
    ROLES ||--o{ USER_ROLES : has
    USERS ||--o{ USER_PERMISSIONS : has
    USERS ||--o{ FILES : uploads
    ROLES ||--o{ ROLE_PERMISSIONS : has
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : has
    PERMISSIONS ||--o{ USER_PERMISSIONS : has
    USERS ||--o{ AUDIT_LOGS : generates

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

## 🎯 **Frontend Architecture**

### **React 19 + Inertia.js Stack**

```mermaid
graph TB
    subgraph "🎨 Presentation Layer"
        PAGES[📄 Pages]
        COMPONENTS[🧩 Components]
        LAYOUTS[🏗️ Layouts]
    end

    subgraph "⚡ State Management"
        INERTIA[🔄 Inertia.js]
        FORMS[📝 Form Handling]
        CACHE[💾 Client Cache]
    end

    subgraph "🎨 Styling & UI"
        TAILWIND[🎨 TailwindCSS v4]
        RESPONSIVE[📱 Responsive Design]
        THEMES[🌙 Dark/Light Themes]
    end

    subgraph "🧪 Testing Layer"
        MSW[🔧 Mock Service Worker]
        JAPA[🧪 Japa Tests]
        E2E[🎭 End-to-End Tests]
    end

    PAGES --> INERTIA
    COMPONENTS --> TAILWIND
    LAYOUTS --> RESPONSIVE
    INERTIA --> FORMS
    FORMS --> CACHE

    MSW --> JAPA
    JAPA --> E2E

    style INERTIA fill:#61DAFB,color:#000
    style TAILWIND fill:#38BDF8,color:#fff
    style MSW fill:#FF6B35,color:#fff
end
```

### **Key Frontend Features**

- **🚀 Server-Side Rendering**: Inertia.js provides SPA experience with SSR benefits
- **⚡ Real-time Updates**: Live data synchronization without page refreshes
- **📱 Mobile-First Design**: Optimized for all screen sizes and devices
- **🎨 Modern UI Components**: Reusable, accessible components with TailwindCSS v4
- **🔍 Smart Search**: Advanced filtering and search capabilities
- **📊 Interactive Dashboards**: Role-specific dashboards with real-time data
- **📋 Dynamic Forms**: Intelligent form validation and submission
- **🌙 Theme Support**: Dark/light mode with system preference detection

## :computer: Technologies

- **[Typescript](https://www.typescriptlang.org/)**
- **[Node.js](https://nodejs.org/)**
- **[AdonisJS](https://adonisjs.com/)**
- **[PostgreSQL](https://www.postgresql.org/)**
- **[Redis](https://redis.io/)** - In-memory data store
- **[PostgREST](https://postgrest.org/)** - Auto-generated REST API
- **[Docker](https://www.docker.com/)**

<br>

## 🧪 **Testing Strategy**

### **Comprehensive Test Coverage**

```mermaid
graph TB
    subgraph "🧪 Backend Testing"
        UNIT[🔬 Unit Tests]
        FUNC[⚙️ Functional Tests]
        INT[🔗 Integration Tests]
    end

    subgraph "🎭 Frontend Testing"
        COMP[🧩 Component Tests]
        MSW[🔧 MSW Mocking]
        E2E[🎭 E2E Tests]
    end

    subgraph "📊 Quality Metrics"
        COV[📈 Coverage Reports]
        PERF[⚡ Performance Tests]
        SEC[🔒 Security Tests]
    end

    UNIT --> FUNC
    FUNC --> INT
    COMP --> MSW
    MSW --> E2E

    INT --> COV
    E2E --> PERF
    PERF --> SEC

    style UNIT fill:#4ECDC4,color:#000
    style MSW fill:#FF6B35,color:#fff
    style COV fill:#45B7D1,color:#fff
end
```

### **Testing Tools & Frameworks**

- **🧪 Japa**: Modern testing framework for Node.js with TypeScript support
- **🔧 Mock Service Worker (MSW)**: API mocking for reliable frontend tests
- **🎭 Playwright**: End-to-end testing with cross-browser support
- **📊 Istanbul**: Code coverage reporting and analysis
- **🔍 ESLint + Prettier**: Code quality and formatting
- **🚀 GitHub Actions**: Automated CI/CD pipeline

## 🐳 **Deployment & DevOps**

### **Production-Ready Infrastructure**

```mermaid
graph TB
    subgraph "🏗️ Development"
        DEV[💻 Local Development]
        DOCKER[🐳 Docker Compose]
        HOT[🔥 Hot Reload]
    end

    subgraph "🚀 CI/CD Pipeline"
        GIT[📝 Git Push]
        ACTIONS[⚙️ GitHub Actions]
        TESTS[🧪 Automated Tests]
        BUILD[🏗️ Build Process]
    end

    subgraph "☁️ Production"
        CONTAINER[📦 Docker Container]
        DB[🗄️ PostgreSQL]
        REDIS[💾 Redis Cache]
        NGINX[🌐 Nginx Proxy]
    end

    DEV --> DOCKER
    DOCKER --> HOT

    GIT --> ACTIONS
    ACTIONS --> TESTS
    TESTS --> BUILD
    BUILD --> CONTAINER

    CONTAINER --> DB
    CONTAINER --> REDIS
    CONTAINER --> NGINX

    style DOCKER fill:#2496ED,color:#fff
    style ACTIONS fill:#2088FF,color:#fff
    style CONTAINER fill:#FF6B6B,color:#fff
end
```

### **Deployment Features**

- **🐳 Docker**: Multi-stage builds for optimized production images
- **🔄 Health Checks**: Automated monitoring and recovery
- **📊 Logging**: Structured logging with log aggregation
- **🔒 Security**: SSL/TLS encryption and security headers
- **⚡ Performance**: CDN integration and asset optimization
- **📈 Monitoring**: Real-time performance and error tracking

## ⚡ **Performance & Optimization**

### **High-Performance Architecture**

```mermaid
graph TB
    subgraph "🚀 Frontend Optimization"
        LAZY[📦 Code Splitting]
        CACHE[💾 Browser Caching]
        COMPRESS[🗜️ Asset Compression]
    end

    subgraph "⚡ Backend Optimization"
        REDIS_CACHE[💾 Redis Caching]
        DB_INDEX[📊 Database Indexing]
        QUERY_OPT[🔍 Query Optimization]
    end

    subgraph "📊 Monitoring"
        METRICS[📈 Performance Metrics]
        ALERTS[🚨 Real-time Alerts]
        ANALYTICS[📊 Usage Analytics]
    end

    LAZY --> CACHE
    CACHE --> COMPRESS

    REDIS_CACHE --> DB_INDEX
    DB_INDEX --> QUERY_OPT

    COMPRESS --> METRICS
    QUERY_OPT --> ALERTS
    ALERTS --> ANALYTICS

    style LAZY fill:#4ECDC4,color:#000
    style REDIS_CACHE fill:#DC382D,color:#fff
    style METRICS fill:#45B7D1,color:#fff
end
```

### **Performance Features**

- **⚡ Lightning Fast**: Sub-100ms API response times
- **💾 Smart Caching**: Multi-layer caching strategy with Redis
- **📦 Code Splitting**: Automatic bundle optimization
- **🗜️ Compression**: Gzip/Brotli compression for all assets
- **📊 Database Optimization**: Indexed queries and connection pooling
- **🔄 Real-time Updates**: WebSocket connections for live data

## :wrench: Tools

- **[WebStorm](https://www.jetbrains.com/webstorm/)**
- **[Insomnia](https://insomnia.rest/)**
- **[DataGrip](https://www.jetbrains.com/datagrip/)**

<br>

## :package: Installation

### :heavy_check_mark: **Prerequisites**

The following software must be installed:

- **[Node.js](https://nodejs.org/en/) 22+**
- **[Git](https://git-scm.com/)**
- **[PNPM](https://pnpm.io/) (recommended)**, or **[NPM](https://www.npmjs.com/)** / **[Yarn](https://yarnpkg.com/)**
- **[PostgreSQL](https://www.postgresql.org/download/)** or **[Docker](https://www.docker.com/get-started/)**

<br>

### :arrow_down: **Cloning the repository**

```sh
    $ git clone https://github.com/gabrielmaialva33/yol-benicio-api.git
```

<br>

### :arrow_forward: **Running the application**

- :package: API

```sh
    $ cd yol-benicio-api
    # Dependencies install
    $ pnpm install  # or npm install / yarn
    # Config environment system
    $ cp .env.example .env
    # Database setup (ensure Postgres/Redis are running)
    $ node ace migration:run  # or docker compose -f docker-compose.dev.yml up --build
    # API start
    $ pnpm dev  # or node ace serve --hmr
```

> Optional: Using Docker for everything
>
> ```sh
> docker compose -f docker-compose.dev.yml up --build
> ```

<br>

## :twisted_rightwards_arrows: API Routes

The API is versioned and all endpoints are prefixed with `/api/v1/`. Below is the complete route structure:

### 🛣️ Route Organization

```mermaid
graph LR
    subgraph "Public Routes"
        HOME[GET /]
        HEALTH[GET /api/v1/health]
        SIGNIN[POST /api/v1/sessions/sign-in]
        SIGNUP[POST /api/v1/sessions/sign-up]
    end

    subgraph "Protected Routes"
        subgraph "User Routes"
            USER_LIST[GET /api/v1/users]
            USER_GET[GET /api/v1/users/:id]
            USER_CREATE[POST /api/v1/users]
            USER_UPDATE[PUT /api/v1/users/:id]
            USER_DELETE[DELETE /api/v1/users/:id]
        end

        subgraph "Admin Routes"
            ROLE_LIST[GET /api/v1/admin/roles]
            ROLE_ATTACH[PUT /api/v1/admin/roles/attach]
        end

        subgraph "File Routes"
            FILE_UPLOAD[POST /api/v1/files/upload]
        end
    end

    style HOME fill:#90EE90
    style HEALTH fill:#90EE90
    style SIGNIN fill:#90EE90
    style SIGNUP fill:#90EE90
    style ROLE_LIST fill:#FFB6C1
    style ROLE_ATTACH fill:#FFB6C1
```

### 📋 Route Details

| Method     | Endpoint                                    | Description                   | Auth Required | Permission/Role    |
| ---------- | ------------------------------------------- | ----------------------------- | ------------- | ------------------ |
| **GET**    | `/`                                         | API information               | ❌            | -                  |
| **GET**    | `/api/v1/health`                            | Health check                  | ❌            | -                  |
| **POST**   | `/api/v1/sessions/sign-in`                  | User login                    | ❌            | -                  |
| **POST**   | `/api/v1/sessions/sign-up`                  | User registration             | ❌            | -                  |
| **GET**    | `/api/v1/verify-email`                      | Verify user email             | ❌            | -                  |
| **POST**   | `/api/v1/resend-verification-email`         | Resend verification email     | ✅            | -                  |
| **GET**    | `/api/v1/me`                                | Get current user profile      | ✅            | -                  |
| **GET**    | `/api/v1/me/permissions`                    | Get current user permissions  | ✅            | -                  |
| **GET**    | `/api/v1/me/roles`                          | Get current user roles        | ✅            | -                  |
| **GET**    | `/api/v1/users`                             | List users (paginated)        | ✅            | users.list         |
| **GET**    | `/api/v1/users/:id`                         | Get user by ID                | ✅            | users.read         |
| **POST**   | `/api/v1/users`                             | Create user                   | ✅            | users.create       |
| **PUT**    | `/api/v1/users/:id`                         | Update user                   | ✅            | users.update       |
| **DELETE** | `/api/v1/users/:id`                         | Delete user                   | ✅            | users.delete       |
| **GET**    | `/api/v1/admin/roles`                       | List roles                    | ✅            | ROOT, ADMIN        |
| **PUT**    | `/api/v1/admin/roles/attach`                | Attach role to user           | ✅            | ROOT, ADMIN        |
| **GET**    | `/api/v1/admin/permissions`                 | List permissions              | ✅            | permissions.list   |
| **POST**   | `/api/v1/admin/permissions`                 | Create permission             | ✅            | permissions.create |
| **PUT**    | `/api/v1/admin/roles/permissions/sync`      | Sync role permissions         | ✅            | permissions.update |
| **PUT**    | `/api/v1/admin/roles/permissions/attach`    | Attach permissions to role    | ✅            | permissions.update |
| **PUT**    | `/api/v1/admin/roles/permissions/detach`    | Detach permissions from role  | ✅            | permissions.update |
| **PUT**    | `/api/v1/admin/users/permissions/sync`      | Sync user permissions         | ✅            | permissions.update |
| **GET**    | `/api/v1/admin/users/:id/permissions`       | Get user's direct permissions | ✅            | permissions.list   |
| **POST**   | `/api/v1/admin/users/:id/permissions/check` | Check user permissions        | ✅            | permissions.list   |
| **POST**   | `/api/v1/files/upload`                      | Upload file                   | ✅            | files.create       |

### 🔄 Request/Response Flow

```mermaid
sequenceDiagram
    participant Client
    participant Router
    participant Middleware
    participant Controller
    participant Service
    participant Repository
    participant Database

    Client->>Router: HTTP Request
    Router->>Middleware: Route Match

    alt Protected Route
        Middleware->>Middleware: Auth Check
        Middleware->>Middleware: ACL Check
    end

    Middleware->>Controller: Request Validated
    Controller->>Service: Business Logic
    Service->>Repository: Data Access
    Repository->>Database: Query
    Database-->>Repository: Result
    Repository-->>Service: Entity/DTO
    Service-->>Controller: Response Data
    Controller-->>Client: HTTP Response
```

### 🔐 Permission System

The advanced permission system supports context-aware access control:

```mermaid
graph TD
    subgraph "Permission Structure"
        P[Permission]
        P --> R[Resource]
        P --> A[Action]
        P --> C[Context]

        R --> |examples| R1[users]
        R --> |examples| R2[files]
        R --> |examples| R3[permissions]

        A --> |examples| A1[create]
        A --> |examples| A2[read]
        A --> |examples| A3[update]
        A --> |examples| A4[delete]
        A --> |examples| A5[list]

        C --> |examples| C1[own - Own resources only]
        C --> |examples| C2[any - Any resource]
        C --> |examples| C3[team - Team resources]
        C --> |examples| C4[department - Department resources]
    end
```

#### Role Hierarchy & Inheritance

```
ROOT
├── ADMIN (inherits all ROOT permissions)
│   ├── USER (inherits basic ADMIN permissions)
│   │   └── GUEST (inherits limited USER permissions)
│   └── EDITOR (inherits content ADMIN permissions)
       └── USER (inherits from EDITOR)
```

#### Context Examples

- `users.update.own` - Can only update own profile
- `users.update.any` - Can update any user
- `files.delete.team` - Can delete files from team members
- `reports.read.department` - Can read reports from own department

### 📥 API Collections & Docs

- HTTP requests file: `docs/api.http` (import into VS Code REST Client or Insomnia)
- OpenAPI spec: `docs/openapi.yaml`
- Redoc (static HTML): `docs/redoc.html`

## :memo: License

This project is under the **MIT** license. [MIT](./LICENSE) ❤️

Liked? Leave a little star to help the project ⭐

<br>

<p align="center">
  <img src="https://raw.githubusercontent.com/gabrielmaialva33/gabrielmaialva33/master/assets/gray0_ctp_on_line.svg?sanitize=true" />
</p>

<p align="center">
  &copy; 2017-present <a href="https://github.com/gabrielmaialva33/" target="_blank">Maia</a>
</p>
