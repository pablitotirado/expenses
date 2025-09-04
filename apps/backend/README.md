# Backend - Gestor Financiero Personal

API REST desarrollada con NestJS para la gestión de finanzas personales, incluyendo ingresos, gastos, categorías y análisis estadísticos con asistencia de IA.

## 🏗️ Arquitectura

### Stack Tecnológico

- **Framework**: NestJS 11.x
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Validación**: class-validator + class-transformer
- **Documentación**: Swagger/OpenAPI
- **IA**: OpenAI GPT para recomendaciones financieras
- **Infraestructura**: Pulumi con AWS
- **Testing**: Vitest
- **Linting**: ESLint + Prettier

### Estructura Modular

```
src/
├── ai/                    # Módulo de IA para recomendaciones
├── categories/            # Gestión de categorías de gastos
├── common/               # Utilidades compartidas y repositorios base
├── expenses/             # Gestión de gastos
├── incomes/              # Gestión de ingresos
├── prisma/               # Configuración de Prisma
└── statistics/           # Análisis y estadísticas financieras
```

### Patrón Repository

Cada módulo implementa el patrón Repository para abstraer el acceso a datos:

- `BaseRepository`: Clase base con operaciones CRUD comunes
- Repositorios específicos por entidad (Income, Expense, Category, etc.)

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- PostgreSQL
- pnpm

### Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp env.example .env
# Editar .env con tus configuraciones

# Configurar base de datos
pnpm db:migrate
pnpm db:generate
```

### Desarrollo

```bash
# Iniciar en modo desarrollo
pnpm start:dev

# Con Docker
pnpm docker:up
```

### Scripts Disponibles

```bash
# Desarrollo
pnpm start:dev          # Servidor con hot reload
pnpm start:debug        # Servidor en modo debug

# Base de datos
pnpm db:migrate         # Ejecutar migraciones
pnpm db:studio          # Abrir Prisma Studio
pnpm db:reset           # Resetear base de datos

# Testing
pnpm test               # Ejecutar tests
pnpm test:watch         # Tests en modo watch
pnpm test:cov           # Tests con coverage

# Infraestructura
pnpm infra:preview      # Preview de infraestructura
pnpm infra:deploy       # Desplegar infraestructura
```

## 📊 Modelos de Datos

### Entidades Principales

- **Income**: Ingresos con monto, fecha y descripción
- **Expense**: Gastos con categoría, monto, fecha y descripción
- **ExpenseCategory**: Categorías para organizar gastos

### Relaciones

- Un gasto pertenece a una categoría
- Las categorías pueden tener múltiples gastos

## 🔧 Configuración

### Variables de Entorno

```env
# Servidor
NODE_ENV=development
PORT=3000

# Base de datos
DATABASE_URL="postgresql://user:pass@localhost:5432/db"

# OpenAI
OPENAI_API_KEY=your_api_key

# JWT (futuro)
JWT_SECRET=your_secret
```

## 🤖 Funcionalidades

### Módulos Disponibles

- **Incomes**: CRUD de ingresos
- **Expenses**: CRUD de gastos con categorización
- **Categories**: Gestión de categorías de gastos
- **Statistics**: Análisis financiero y métricas
- **AI**: Recomendaciones inteligentes usando OpenAI

### Endpoints Principales

- `GET /api/incomes` - Listar ingresos
- `POST /api/incomes` - Crear ingreso
- `GET /api/expenses` - Listar gastos
- `POST /api/expenses` - Crear gasto
- `GET /api/categories` - Listar categorías
- `GET /api/statistics` - Obtener estadísticas
- `POST /api/ai/recommend` - Obtener recomendaciones de IA

## 🏗️ Infraestructura

### Pulumi + AWS

- **Compute**: ECS Fargate para contenedores
- **Database**: RDS PostgreSQL
- **Networking**: VPC, subnets, security groups
- **Secrets**: AWS Secrets Manager
- **Monitoring**: CloudWatch logs y métricas

### Despliegue

```bash
# Configurar Pulumi
cd infra
pulumi login s3://your-bucket

# Desplegar
pulumi up
```

## 🧪 Testing

```bash
# Tests unitarios
pnpm test

# Tests e2e
pnpm test:e2e

# Coverage
pnpm test:cov
```

## 📚 Documentación API

Una vez iniciado el servidor, la documentación Swagger está disponible en:

- **Desarrollo**: http://localhost:3000/api
- **Producción**: https://your-domain.com/api
