# 🔧 Backend - Expense Manager API

API REST construida con NestJS, Prisma ORM y PostgreSQL para gestión de gastos e ingresos personales. Incluye integración con OpenAI para análisis financiero mediante IA.

## 🏗️ Stack Tecnológico

- **Framework**: NestJS 11.x con TypeScript
- **ORM**: Prisma 6.x con PostgreSQL
- **Validación**: class-validator + class-transformer
- **Documentación**: Swagger/OpenAPI automático
- **Testing**: Vitest con coverage
- **IA**: OpenAI API para análisis financiero
- **Infraestructura**: AWS con Pulumi (ECS Fargate, RDS, ALB)

## 🚀 Desarrollo Local

### Inicialización rápida

```bash
# Instalar dependencias
pnpm install

# Levantar base de datos
pnpm run docker:up

# Aplicar migraciones
pnpm run db:migrate

# Iniciar servidor de desarrollo
pnpm run start:dev
```

La API estará disponible en:

- **Backend**: http://localhost:3000
- **Documentación Swagger**: http://localhost:3000/docs

### Variables de entorno requeridas

Ver `env.example` para configuración completa. Variables críticas:

| Variable         | Descripción          | Ejemplo                                    |
| ---------------- | -------------------- | ------------------------------------------ |
| `NODE_ENV`       | Entorno de ejecución | `development`                              |
| `PORT`           | Puerto del servidor  | `3000`                                     |
| `DATABASE_URL`   | URL de PostgreSQL    | `postgresql://user:pass@localhost:5432/db` |
| `OPENAI_API_KEY` | API key de OpenAI    | `sk-...`                                   |

## 📋 Scripts Disponibles

### Aplicación

| Script                | Descripción                 |
| --------------------- | --------------------------- |
| `pnpm run start:dev`  | Desarrollo con hot-reload   |
| `pnpm run start:prod` | Producción (requiere build) |
| `pnpm run build`      | Build para producción       |
| `pnpm run lint`       | ESLint con auto-fix         |

### Base de datos

| Script                       | Descripción               |
| ---------------------------- | ------------------------- |
| `pnpm run db:migrate`        | Aplicar migraciones       |
| `pnpm run db:migrate:deploy` | Deploy migraciones (prod) |
| `pnpm run db:generate`       | Generar cliente Prisma    |
| `pnpm run db:studio`         | Abrir Prisma Studio       |
| `pnpm run db:reset`          | Reset completo de DB      |

### Testing

| Script                | Descripción         |
| --------------------- | ------------------- |
| `pnpm run test`       | Tests unitarios     |
| `pnpm run test:watch` | Tests en modo watch |
| `pnpm run test:cov`   | Tests con coverage  |
| `pnpm run test:e2e`   | Tests end-to-end    |

### Docker & Infraestructura

| Script                   | Descripción            |
| ------------------------ | ---------------------- |
| `pnpm run docker:up`     | PostgreSQL local       |
| `pnpm run infra:preview` | Preview cambios Pulumi |
| `pnpm run infra:deploy`  | Deploy a AWS           |
| `pnpm run infra:destroy` | Destruir recursos AWS  |

## 🛣️ API Endpoints

**Base URL**: `/api`

### Gastos (`/api/expenses`)

| Método   | Ruta   | Descripción             |
| -------- | ------ | ----------------------- |
| `GET`    | `/`    | Listar todos los gastos |
| `POST`   | `/`    | Crear nuevo gasto       |
| `GET`    | `/:id` | Obtener gasto por ID    |
| `PATCH`  | `/:id` | Actualizar gasto        |
| `DELETE` | `/:id` | Eliminar gasto          |

### Ingresos (`/api/incomes`)

| Método   | Ruta   | Descripción               |
| -------- | ------ | ------------------------- |
| `GET`    | `/`    | Listar todos los ingresos |
| `POST`   | `/`    | Crear nuevo ingreso       |
| `GET`    | `/:id` | Obtener ingreso por ID    |
| `PATCH`  | `/:id` | Actualizar ingreso        |
| `DELETE` | `/:id` | Eliminar ingreso          |

### Categorías (`/api/categories`)

| Método   | Ruta   | Descripción                  |
| -------- | ------ | ---------------------------- |
| `GET`    | `/`    | Listar categorías con conteo |
| `POST`   | `/`    | Crear nueva categoría        |
| `GET`    | `/:id` | Obtener categoría por ID     |
| `PATCH`  | `/:id` | Actualizar categoría         |
| `DELETE` | `/:id` | Eliminar categoría           |

### Estadísticas (`/api/statistics`)

| Método | Ruta       | Descripción                |
| ------ | ---------- | -------------------------- |
| `GET`  | `/summary` | Resumen financiero general |

### IA (`/api/ia`)

| Método | Ruta | Descripción                |
| ------ | ---- | -------------------------- |
| `POST` | `/`  | Análisis financiero con IA |

**Documentación completa**: http://localhost:3000/docs

## 💾 Persistencia y Migraciones

### Modelo de datos (Prisma)

```
Income          ExpenseCategory          Expense
├── id          ├── id                   ├── id
├── amount      ├── name (unique)        ├── amount
├── date        ├── createdAt            ├── date
├── description ├── updatedAt            ├── description
├── createdAt   └── expenses[]           ├── categoryId (FK)
└── updatedAt                            ├── createdAt
                                         ├── updatedAt
                                         └── category
```

### Migraciones

```bash
# Desarrollo - crear y aplicar migración
pnpm run db:migrate

# Producción - solo aplicar migraciones existentes
pnpm run db:migrate:deploy

# Reset completo (CUIDADO en prod)
pnpm run db:reset
```

## 🧪 Testing

### Tests unitarios

```bash
pnpm run test              # Una vez
pnpm run test:watch        # Modo watch
pnpm run test:cov          # Con coverage
```

### Tests E2E

```bash
pnpm run test:e2e          # End-to-end completos
```

Configuración en `vitest.config.mjs` y `vitest.e2e.config.ts`.

## 🔄 Flujo de Petición API

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Service
    participant Repository
    participant Database

    Client->>Controller: HTTP Request
    Controller->>Controller: Validar DTO
    Controller->>Service: Llamar método de negocio
    Service->>Repository: Operación de datos
    Repository->>Database: Query Prisma
    Database-->>Repository: Resultado
    Repository-->>Service: Datos procesados
    Service-->>Controller: Respuesta de negocio
    Controller-->>Client: HTTP Response
```

## 🔒 Seguridad

### Secretos

- Usar AWS Secrets Manager en producción
- Variables sensibles nunca en código
- JWT para autenticación (TODO: implementar auth module)

### Validación

- DTOs con class-validator en todos los endpoints
- Sanitización automática con whitelist: true
- Transformación de tipos habilitada

## 📁 Arquitectura de Módulos

```
src/
├── main.ts                 # Bootstrap de la aplicación
├── app.module.ts           # Módulo raíz
├── common/                 # Utilidades compartidas
│   ├── config/             # Configuración global
│   ├── repositories/       # Base repository pattern
│   └── types/              # Tipos compartidos
├── expenses/               # Módulo de gastos
│   ├── dto/                # DTOs request/response
│   ├── repositories/       # Repository de gastos
│   ├── expenses.service.ts # Lógica de negocio
│   └── expenses.controller.ts # Endpoints REST
├── incomes/                # Módulo de ingresos
├── categories/             # Módulo de categorías
├── statistics/             # Módulo de estadísticas
├── ai/                     # Módulo de IA
└── prisma/                 # Configuración Prisma
```

## 🚀 Deploy y Producción

### Deploy a AWS

```bash
cd infra
pulumi login                # Conectar a backend S3
pulumi stack select dev     # Seleccionar stack
pulumi preview              # Preview cambios
pulumi up                   # Deploy recursos
```

### Infraestructura creada

- **ECS Fargate**: Servicio containerizado
- **RDS PostgreSQL**: Base de datos gestionada
- **ALB**: Load balancer con SSL
- **API Gateway**: Routing y throttling
- **Secrets Manager**: Gestión de secretos
- **CloudWatch**: Logging y monitoreo

Ver [Infraestructura README](./infra/README.md) para detalles completos.

## ⚠️ TODOs

- [ ] Implementar módulo de autenticación JWT (`src/auth/`)
- [ ] Agregar middleware de rate limiting
- [ ] Tests E2E para todos los módulos
- [ ] Documentación de DTOs con decoradores Swagger
- [ ] Implementar soft deletes en entidades
- [ ] Validaciones de reglas de negocio complejas
