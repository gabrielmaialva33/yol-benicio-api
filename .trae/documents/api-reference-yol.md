# API Reference - Sistema YOL Benício

## 1. Introdução

Esta documentação fornece informações completas sobre a API REST do Sistema YOL Benício. A API segue os padrões RESTful e utiliza autenticação JWT com sistema de permissões baseado em papéis (RBAC).

### 1.1 Informações Gerais

- **Base URL**: `https://api.yolbenicio.com` (produção) / `http://localhost:3333` (desenvolvimento)
- **Versão**: v1
- **Formato**: JSON
- **Autenticação**: JWT Bearer Token
- **Rate Limiting**: 100 requests/minuto por IP

### 1.2 Códigos de Status HTTP

| Código | Significado | Descrição |
|--------|-------------|----------|
| **200** | OK | Requisição bem-sucedida |
| **201** | Created | Recurso criado com sucesso |
| **204** | No Content | Operação bem-sucedida sem conteúdo |
| **400** | Bad Request | Dados inválidos na requisição |
| **401** | Unauthorized | Token de autenticação inválido |
| **403** | Forbidden | Sem permissão para acessar o recurso |
| **404** | Not Found | Recurso não encontrado |
| **422** | Unprocessable Entity | Erro de validação |
| **429** | Too Many Requests | Rate limit excedido |
| **500** | Internal Server Error | Erro interno do servidor |

### 1.3 Estrutura de Resposta

**Resposta de Sucesso:**
```json
{
  "data": {
    // Dados do recurso
  },
  "meta": {
    "total": 100,
    "perPage": 20,
    "currentPage": 1,
    "lastPage": 5
  }
}
```

**Resposta de Erro:**
```json
{
  "errors": [
    {
      "field": "email",
      "rule": "email",
      "message": "O campo email deve ser um endereço de email válido"
    }
  ],
  "message": "Dados de validação inválidos"
}
```

## 2. Autenticação

### 2.1 Login

**Endpoint:** `POST /login`

**Descrição:** Autentica um usuário e retorna um token JWT.

**Request Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "type": "bearer",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "expires_at": "2024-12-31T23:59:59.000Z",
  "user": {
    "id": 1,
    "fullName": "João Silva",
    "email": "joao@exemplo.com",
    "roles": [
      {
        "id": 2,
        "name": "Usuário",
        "slug": "user"
      }
    ]
  }
}
```

**Possíveis Erros:**
- `400`: Credenciais inválidas
- `422`: Dados de validação inválidos
- `429`: Muitas tentativas de login

### 2.2 Logout

**Endpoint:** `POST /logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (204):** Sem conteúdo

### 2.3 Refresh Token

**Endpoint:** `POST /auth/refresh`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "type": "bearer",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "expires_at": "2024-12-31T23:59:59.000Z"
}
```

## 3. Usuários

### 3.1 Listar Usuários

**Endpoint:** `GET /users`

**Permissões:** `users.read`

**Query Parameters:**
| Parâmetro | Tipo | Descrição | Padrão |
|-----------|------|-----------|--------|
| `page` | integer | Página atual | 1 |
| `limit` | integer | Itens por página (max: 100) | 20 |
| `search` | string | Busca por nome ou email | - |
| `role` | string | Filtrar por papel | - |
| `status` | string | Filtrar por status (active/inactive) | - |

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "fullName": "João Silva",
      "email": "joao@exemplo.com",
      "username": "joao.silva",
      "isDeleted": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "roles": [
        {
          "id": 2,
          "name": "Usuário",
          "slug": "user"
        }
      ]
    }
  ],
  "meta": {
    "total": 50,
    "perPage": 20,
    "currentPage": 1,
    "lastPage": 3
  }
}
```

### 3.2 Criar Usuário

**Endpoint:** `POST /users`

**Permissões:** `users.create`

**Request Body:**
```json
{
  "fullName": "Maria Santos",
  "email": "maria@exemplo.com",
  "password": "senha123",
  "username": "maria.santos",
  "roleIds": [2]
}
```

**Response (201):**
```json
{
  "id": 2,
  "fullName": "Maria Santos",
  "email": "maria@exemplo.com",
  "username": "maria.santos",
  "isDeleted": false,
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

### 3.3 Obter Usuário

**Endpoint:** `GET /users/{id}`

**Permissões:** `users.read` ou ser o próprio usuário

**Response (200):**
```json
{
  "id": 1,
  "fullName": "João Silva",
  "email": "joao@exemplo.com",
  "username": "joao.silva",
  "isDeleted": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "roles": [
    {
      "id": 2,
      "name": "Usuário",
      "slug": "user",
      "permissions": [
        {
          "id": 1,
          "name": "folders.read",
          "resource": "folders",
          "action": "read"
        }
      ]
    }
  ],
  "folders": [
    {
      "id": 1,
      "code": "PROC-2024-001",
      "title": "Processo Exemplo",
      "status": "active"
    }
  ]
}
```

### 3.4 Atualizar Usuário

**Endpoint:** `PUT /users/{id}`

**Permissões:** `users.update` ou ser o próprio usuário

**Request Body:**
```json
{
  "fullName": "João Silva Santos",
  "username": "joao.santos"
}
```

**Response (200):** Dados atualizados do usuário

### 3.5 Excluir Usuário

**Endpoint:** `DELETE /users/{id}`

**Permissões:** `users.delete`

**Response (204):** Sem conteúdo

## 4. Papéis e Permissões

### 4.1 Listar Papéis

**Endpoint:** `GET /roles`

**Permissões:** `roles.read`

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Administrador",
      "slug": "admin",
      "description": "Acesso administrativo completo",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "permissions": [
        {
          "id": 1,
          "name": "users.create",
          "resource": "users",
          "action": "create"
        }
      ]
    }
  ]
}
```

### 4.2 Listar Permissões

**Endpoint:** `GET /permissions`

**Permissões:** `permissions.read`

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "users.create",
      "resource": "users",
      "action": "create",
      "description": "Criar novos usuários"
    },
    {
      "id": 2,
      "name": "folders.read",
      "resource": "folders",
      "action": "read",
      "description": "Visualizar pastas"
    }
  ]
}
```

### 4.3 Atribuir Papel ao Usuário

**Endpoint:** `POST /users/{userId}/roles`

**Permissões:** `users.manage_roles`

**Request Body:**
```json
{
  "roleIds": [1, 2]
}
```

**Response (200):**
```json
{
  "message": "Papéis atribuídos com sucesso",
  "roles": [
    {
      "id": 1,
      "name": "Administrador",
      "slug": "admin"
    }
  ]
}
```

## 5. Pastas/Processos

### 5.1 Listar Pastas

**Endpoint:** `GET /folders`

**Permissões:** `folders.read`

**Query Parameters:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `page` | integer | Página atual |
| `limit` | integer | Itens por página |
| `search` | string | Busca por código ou título |
| `status` | string | Filtrar por status |
| `area` | string | Filtrar por área jurídica |
| `userId` | integer | Filtrar por responsável |

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "code": "PROC-2024-001",
      "title": "Ação Trabalhista - João vs Empresa X",
      "description": "Processo de rescisão indireta",
      "status": "active",
      "area": "trabalhista",
      "priority": "high",
      "value": 50000.00,
      "clientName": "João Silva",
      "clientEmail": "joao@cliente.com",
      "lawyerName": "Dr. Maria Santos",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-20T15:30:00.000Z",
      "user": {
        "id": 1,
        "fullName": "João Silva",
        "email": "joao@exemplo.com"
      },
      "_count": {
        "files": 5,
        "movements": 12
      }
    }
  ],
  "meta": {
    "total": 25,
    "perPage": 20,
    "currentPage": 1,
    "lastPage": 2
  }
}
```

### 5.2 Criar Pasta

**Endpoint:** `POST /folders`

**Permissões:** `folders.create`

**Request Body:**
```json
{
  "code": "PROC-2024-002",
  "title": "Ação Civil - Danos Morais",
  "description": "Processo por danos morais em acidente",
  "area": "civil",
  "priority": "medium",
  "value": 25000.00,
  "clientName": "Maria Oliveira",
  "clientEmail": "maria@cliente.com",
  "clientPhone": "(11) 99999-9999",
  "lawyerName": "Dr. Pedro Santos"
}
```

**Response (201):**
```json
{
  "id": 2,
  "code": "PROC-2024-002",
  "title": "Ação Civil - Danos Morais",
  "description": "Processo por danos morais em acidente",
  "status": "draft",
  "area": "civil",
  "priority": "medium",
  "value": 25000.00,
  "clientName": "Maria Oliveira",
  "clientEmail": "maria@cliente.com",
  "clientPhone": "(11) 99999-9999",
  "lawyerName": "Dr. Pedro Santos",
  "userId": 1,
  "createdAt": "2024-01-21T09:00:00.000Z",
  "updatedAt": "2024-01-21T09:00:00.000Z"
}
```

### 5.3 Obter Pasta

**Endpoint:** `GET /folders/{id}`

**Permissões:** `folders.read` ou ser o proprietário

**Response (200):**
```json
{
  "id": 1,
  "code": "PROC-2024-001",
  "title": "Ação Trabalhista - João vs Empresa X",
  "description": "Processo de rescisão indireta",
  "status": "active",
  "area": "trabalhista",
  "priority": "high",
  "value": 50000.00,
  "clientName": "João Silva",
  "clientEmail": "joao@cliente.com",
  "clientPhone": "(11) 88888-8888",
  "lawyerName": "Dr. Maria Santos",
  "userId": 1,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-20T15:30:00.000Z",
  "user": {
    "id": 1,
    "fullName": "João Silva",
    "email": "joao@exemplo.com"
  },
  "files": [
    {
      "id": 1,
      "name": "contrato_trabalho.pdf",
      "originalName": "Contrato de Trabalho.pdf",
      "mimeType": "application/pdf",
      "size": 1024000,
      "url": "/files/1/download",
      "createdAt": "2024-01-16T14:00:00.000Z"
    }
  ],
  "movements": [
    {
      "id": 1,
      "description": "Processo criado",
      "type": "creation",
      "responsible": "João Silva",
      "movementDate": "2024-01-15T10:00:00.000Z",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

### 5.4 Atualizar Pasta

**Endpoint:** `PUT /folders/{id}`

**Permissões:** `folders.update` ou ser o proprietário

**Request Body:**
```json
{
  "title": "Ação Trabalhista - João vs Empresa X (Atualizado)",
  "status": "active",
  "priority": "urgent",
  "value": 55000.00
}
```

**Response (200):** Dados atualizados da pasta

### 5.5 Excluir Pasta

**Endpoint:** `DELETE /folders/{id}`

**Permissões:** `folders.delete` ou ser o proprietário

**Response (204):** Sem conteúdo

## 6. Arquivos

### 6.1 Upload de Arquivo

**Endpoint:** `POST /folders/{folderId}/files`

**Permissões:** `files.create` ou ser o proprietário da pasta

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: Arquivo a ser enviado
- `description`: Descrição do arquivo (opcional)
- `category`: Categoria do arquivo (opcional)

**Response (201):**
```json
{
  "id": 2,
  "name": "documento_importante_1642678800.pdf",
  "originalName": "Documento Importante.pdf",
  "mimeType": "application/pdf",
  "size": 2048000,
  "description": "Documento principal do processo",
  "category": "legal",
  "folderId": 1,
  "userId": 1,
  "url": "/files/2/download",
  "createdAt": "2024-01-21T10:00:00.000Z"
}
```

### 6.2 Listar Arquivos da Pasta

**Endpoint:** `GET /folders/{folderId}/files`

**Permissões:** `files.read` ou ser o proprietário da pasta

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "contrato_trabalho.pdf",
      "originalName": "Contrato de Trabalho.pdf",
      "mimeType": "application/pdf",
      "size": 1024000,
      "description": "Contrato original",
      "category": "contract",
      "url": "/files/1/download",
      "createdAt": "2024-01-16T14:00:00.000Z",
      "user": {
        "id": 1,
        "fullName": "João Silva"
      }
    }
  ]
}
```

### 6.3 Download de Arquivo

**Endpoint:** `GET /files/{id}/download`

**Permissões:** `files.read` ou ser o proprietário

**Response (200):** Stream do arquivo

**Headers:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="documento.pdf"
Content-Length: 1024000
```

### 6.4 Excluir Arquivo

**Endpoint:** `DELETE /files/{id}`

**Permissões:** `files.delete` ou ser o proprietário

**Response (204):** Sem conteúdo

## 7. Movimentações

### 7.1 Adicionar Movimentação

**Endpoint:** `POST /folders/{folderId}/movements`

**Permissões:** `movements.create` ou ser o proprietário da pasta

**Request Body:**
```json
{
  "description": "Audiência realizada com sucesso",
  "type": "hearing",
  "responsible": "Dr. Maria Santos",
  "movementDate": "2024-01-22T14:30:00.000Z",
  "notes": "Cliente compareceu, empresa não enviou representante"
}
```

**Response (201):**
```json
{
  "id": 2,
  "description": "Audiência realizada com sucesso",
  "type": "hearing",
  "responsible": "Dr. Maria Santos",
  "movementDate": "2024-01-22T14:30:00.000Z",
  "notes": "Cliente compareceu, empresa não enviou representante",
  "folderId": 1,
  "userId": 1,
  "createdAt": "2024-01-22T15:00:00.000Z"
}
```

### 7.2 Listar Movimentações

**Endpoint:** `GET /folders/{folderId}/movements`

**Permissões:** `movements.read` ou ser o proprietário da pasta

**Query Parameters:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `type` | string | Filtrar por tipo de movimentação |
| `startDate` | date | Data inicial |
| `endDate` | date | Data final |
| `responsible` | string | Filtrar por responsável |

**Response (200):**
```json
{
  "data": [
    {
      "id": 2,
      "description": "Audiência realizada com sucesso",
      "type": "hearing",
      "responsible": "Dr. Maria Santos",
      "movementDate": "2024-01-22T14:30:00.000Z",
      "notes": "Cliente compareceu, empresa não enviou representante",
      "createdAt": "2024-01-22T15:00:00.000Z",
      "user": {
        "id": 1,
        "fullName": "João Silva"
      }
    },
    {
      "id": 1,
      "description": "Processo criado",
      "type": "creation",
      "responsible": "João Silva",
      "movementDate": "2024-01-15T10:00:00.000Z",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "user": {
        "id": 1,
        "fullName": "João Silva"
      }
    }
  ]
}
```

## 8. Dashboard e Estatísticas

### 8.1 Dashboard do Usuário

**Endpoint:** `GET /dashboard`

**Permissões:** Usuário aut