# Yol Benício Legal Management System

## AI Team Configuration (optimized by comprehensive analysis, 2025-08-17)

**Important: YOU MUST USE specialized subagents when available for the task.**

### Detected Technology Stack

- **Backend Framework**: AdonisJS v6.19.0 with TypeScript (ESM, Node.js subpath imports)
- **Database**: PostgreSQL with Lucid ORM v21.8.0 (Active Record pattern, migrations)
- **Cache & Queue**: Redis with Bull Queue (@rlanz/bull-queue) for caching and job processing
- **Frontend Framework**: React v19.1.1 with TypeScript (cutting-edge features)
- **UI Integration**: Inertia.js v2.1.2 (SPA-like experience, SSR-ready but disabled in dev)
- **State Management**: React Query v5.85.3 (@tanstack/react-query) + MSW v2.10.5 for mocking
- **Styling**: Tailwind CSS v4.1.12 with custom design system and Inter font
- **Build Tools**: Vite v7.1.2, SWC compilation, modern bundling
- **Testing**: Japa v4.4.0 test runner with API client testing
- **Architecture**: Modular monolith with sophisticated RBAC system
- **Security**: JWT auth, audit trails, role-based permissions with inheritance
- **File Storage**: Multi-provider support (AWS S3, Google Cloud, Digital Ocean)

### Enhanced AI Team Assignments

| Task Category                    | Primary Agent               | Secondary Agent             | When to Use                                   | Notes                                                 |
|----------------------------------|-----------------------------|-----------------------------|-----------------------------------------------|-------------------------------------------------------|
| **AdonisJS Backend Development** | `backend-developer`         | `performance-optimizer`     | Server-side features, API endpoints, services | Expert in AdonisJS v6 patterns, modular architecture  |
| **React Component Architecture** | `react-component-architect` | `tailwind-frontend-expert`  | UI components, React 19 features              | Specialized in React 19, component composition        |
| **React State Management**       | `react-state-manager`       | `react-component-architect` | React Query, client state, MSW                | **NEW**: Data fetching, caching, optimistic updates   |
| **API Design & Documentation**   | `api-architect`             | `backend-developer`         | REST APIs, OpenAPI specs, auth flows          | REST design, security patterns, documentation         |
| **Tailwind CSS & Design System** | `tailwind-frontend-expert`  | `react-component-architect` | Styling, design tokens, responsive design     | Tailwind v4 features, design system consistency       |
| **Frontend Development**         | `frontend-developer`        | `react-component-architect` | General UI when specialists not needed        | Fallback for non-specialized frontend work            |
| **Technical Documentation**      | `documentation-specialist`  | `api-architect`             | API docs, README, architecture guides         | **NEW**: Comprehensive documentation maintenance      |
| **Code Quality & Security**      | `code-reviewer`             | `backend-developer`         | **MANDATORY** for all features and PRs        | Security audits, code standards, vulnerability checks |
| **Performance Optimization**     | `performance-optimizer`     | `backend-developer`         | **MANDATORY** for slowness, scaling issues    | Database queries, caching, frontend optimization      |
| **Codebase Exploration**         | `code-archaeologist`        | `backend-developer`         | Understanding complex systems (RBAC, modules) | **NEW**: Architecture analysis, legacy exploration    |

### Workflow Patterns & Agent Collaboration

#### 1. New Feature Development Flow
```
User Request → code-archaeologist (if complex) → Primary Agent → code-reviewer → performance-optimizer (if needed)
```

#### 2. Frontend Feature Development
```
UI Requirements → react-component-architect (components) → react-state-manager (data) → tailwind-frontend-expert (styling) → code-reviewer
```

#### 3. Backend Feature Development
```
API Requirements → api-architect (design) → backend-developer (implementation) → performance-optimizer (optimization) → code-reviewer
```

#### 4. Full-Stack Feature Development
```
Requirements → api-architect (API) → backend-developer (backend) → react-component-architect (UI) → react-state-manager (state) → code-reviewer
```

#### 5. Performance Issues
```
Performance Problem → performance-optimizer (analysis) → Specialist Agent (fix) → code-reviewer (validation)
```

### Project-Specific Architectural Guidelines

#### **Modular Architecture Patterns**
- **Module Structure**: Each `/app/modules/` contains controllers, services, models, routes, validators
- **Inter-Module Communication**: Use service layer, avoid direct model coupling
- **Agent Guidance**: Always work within module boundaries, use existing service patterns

#### **RBAC System Complexity**
- **Permission Inheritance**: Roles inherit permissions with Redis caching
- **Optimization Service**: Use `OptimizedPermissionService` for complex checks
- **Performance**: Permission checks are expensive, batch when possible
- **Agent Guidance**: Consult `code-archaeologist` for permission system changes

#### **Inertia.js Integration Patterns**
- **SPA Navigation**: Use Inertia router for page navigation
- **API Calls**: Use React Query for data fetching within pages
- **Form Handling**: Prefer Inertia forms for navigation, React Query for API mutations
- **Agent Guidance**: `react-state-manager` handles React Query, `react-component-architect` handles Inertia components

#### **File Upload Architecture**
- **Multi-Provider**: Supports AWS S3, Google Cloud, Digital Ocean
- **Presigned URLs**: Frontend uploads directly to cloud storage
- **Security**: 5MB limit, type validation, audit logging
- **Agent Guidance**: Use existing `UploadFileService` patterns

### Technology-Specific Best Practices

#### **AdonisJS v6 Specifics**
- **ESM**: Use modern import/export, Node.js subpath imports
- **IoC Container**: Leverage dependency injection for services
- **Middleware Pipeline**: Use existing auth, permission, and rate limiting middleware
- **Validation**: Use VineJS for request validation with async rules

#### **React 19 Modern Features**
- **New Hooks**: Implement `useOptimistic()`, `useActionState()`, `use()` where appropriate
- **Concurrent Features**: Leverage React 19's improved concurrent rendering
- **Performance**: Use React.memo(), useMemo(), useCallback() strategically
- **SSR**: Consider enabling SSR for production (currently disabled)

#### **React Query Patterns**
- **Caching Strategy**: 5min staleTime, 1 retry by default
- **Optimistic Updates**: Use for immediate UI feedback
- **Error Handling**: Structured error handling with `ApiError` types
- **Background Sync**: Leverage React Query's background refetching

#### **Tailwind CSS v4 Features**
- **Modern CSS**: Use CSS custom properties, modern syntax
- **Design Tokens**: Maintain consistency with `@theme` configuration
- **Performance**: Leverage Tailwind v4's improved performance
- **Component Styles**: Balance utility classes with component-specific styles

### Usage Examples & Common Patterns

#### **Dashboard Widget Development**
```
Requirements → react-component-architect (create widget component) → react-state-manager (add data fetching) → tailwind-frontend-expert (style with design tokens) → code-reviewer
```

#### **New API Endpoint**
```
Requirements → api-architect (design endpoint) → backend-developer (implement with validation) → documentation-specialist (update OpenAPI) → code-reviewer
```

#### **Permission System Changes**
```
Requirements → code-archaeologist (analyze current system) → backend-developer (implement with RBAC patterns) → performance-optimizer (test caching) → code-reviewer
```

#### **Performance Issues**
```
Slow Request → performance-optimizer (identify bottleneck) → backend-developer (optimize queries) → code-reviewer (verify improvement)
```

### Critical Development Guidelines

#### **MANDATORY Agent Usage**
- **ALL features** → `code-reviewer` (no exceptions)
- **Performance issues** → `performance-optimizer` (before optimization)
- **Security changes** → `code-reviewer` (with security focus)
- **Complex RBAC** → `code-archaeologist` (for understanding) + `backend-developer` (for implementation)

#### **Technology Boundaries**
- **Backend Logic** → Only `backend-developer`, `api-architect`, `performance-optimizer`
- **React Components** → Only `react-component-architect`, `react-state-manager`
- **Styling** → Only `tailwind-frontend-expert`, `react-component-architect`
- **State Management** → Only `react-state-manager`, `react-component-architect`

#### **Quality Standards**
- **Type Safety**: Maintain strict TypeScript throughout
- **Testing**: Add tests for new features (Japa for backend, React Testing Library for frontend)
- **Documentation**: Update OpenAPI specs for API changes
- **Performance**: Monitor database queries, implement caching where appropriate
- **Security**: Follow OWASP guidelines, validate all inputs, audit permission changes

### Project Health Metrics

- **Architecture Score**: 8.5/10 (excellent modular design)
- **Security Score**: 8/10 (strong RBAC, needs CORS fixes)
- **Performance Score**: 7/10 (good caching, needs query optimization)
- **Code Quality**: 8/10 (good patterns, needs test coverage)
- **Documentation**: 7.5/10 (good OpenAPI, needs more examples)

### High-Priority Improvements Identified

1. **Security**: Fix CORS configuration for production
2. **Performance**: Optimize permission checking queries (N+1 problem)
3. **Testing**: Add comprehensive test coverage reporting
4. **Frontend**: Complete dashboard component implementations
5. **Documentation**: Add more API usage examples and troubleshooting guides

---

*This configuration leverages comprehensive codebase analysis and industry best practices to maximize AI agent effectiveness while maintaining code quality and project architectural integrity.*
