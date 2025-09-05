# 💰 Expense Manager

Sistema completo de gestión financiera personal construido con NestJS, React y desplegado en AWS mediante infraestructura como código con Pulumi.

## 🏗️ Estructura del Monorepo

```
expenses/
├── apps/
│   ├── backend/           # API NestJS con Prisma y PostgreSQL
│   │   ├── src/           # Código fuente del backend
│   │   ├── infra/         # Infraestructura Pulumi para AWS
│   │   └── prisma/        # Esquemas y migraciones de DB
│   └── web/               # Frontend React con Vite y TailwindCSS
│       ├── src/           # Código fuente del frontend
│       └── infra/         # Infraestructura Pulumi para S3+CloudFront
├── packages/
│   └── shared/            # DTOs y tipos compartidos
└── package.json           # Scripts del workspace
```

## 🔧 Requisitos

- **Node.js** >= 18
- **pnpm** 9.0.0 (como package manager)
- **Docker** y Docker Compose (para desarrollo local)
- **Pulumi CLI** (para despliegues de infraestructura)
- **AWS CLI** configurado (para despliegues)

## 🚀 Quickstart

```bash
# Levantar backend y frontend en paralelo, incluyendo base de datos.
pnpm run dev:all
```

Esto configura automáticamente las variables de entorno y levanta todos los servicios necesarios.

## 📋 Comandos Esenciales

| Comando                    | Descripción                      |
| -------------------------- | -------------------------------- |
| `pnpm run build`           | Build de todas las aplicaciones  |
| `pnpm run dev`             | Desarrollo de todas las apps     |
| `pnpm run dev:web`         | Solo desarrollo del frontend     |
| `pnpm run dev:backend`     | Solo desarrollo del backend      |
| `pnpm run lint`            | Linting de todo el workspace     |
| `pnpm run format`          | Formateo con Prettier            |
| `pnpm run check-types`     | Verificación de tipos TypeScript |
| `pnpm run test:e2e:docker` | Ejecutar tests e2e con Docker    |

## 🧪 Testing

### Tests End-to-End (E2E)

Los tests e2e se ejecutan en un entorno Docker aislado que incluye:

- Backend con base de datos PostgreSQL
- Tests automatizados con Node.js test runner nativo
- Validación completa de la API REST

```bash
# Ejecutar tests e2e completos
pnpm run test:e2e:docker
```

Este comando:

1. Construye las imágenes Docker necesarias
2. Levanta los servicios (backend + DB)
3. Ejecuta los tests e2e contra la API
4. Limpia automáticamente los contenedores y volúmenes

### Tests Unitarios

Los tests unitarios se ejecutan individualmente en cada aplicación:

```bash
# Backend
cd apps/backend && pnpm test

# Frontend
cd apps/web && pnpm test
```

## 🔄 Flujo de Desarrollo

1. **Branches**: Usar feature branches desde `main`
2. **Commits**: Convencionales (feat, fix, docs, etc.)
3. **Testing**: Ejecutar tests antes de commits
4. **Code Review**: PRs obligatorios para `main`

## 🚚 Despliegue

El despliegue se realiza mediante:

- **Infraestructura**: Pulumi para configurar recursos en AWS
- **Deploy a producción**: Mediante comandos de Pulumi

## 📚 Documentación Específica

- [Backend README](./apps/backend/README.md) - API NestJS, base de datos, infraestructura
- [Frontend README](./apps/web/README.md) - Aplicación React, build, despliegue
- [Infraestructura README](./apps/backend/infra/README.md) - Configuración AWS con Pulumi

## 🔐 Variables de Entorno

Revisar los archivos `.env.example` en:

- `apps/backend/.env.example`
- `apps/web/.env.example`

## 🏢 Arquitectura

![Arquitectura del Sistema](./diagrams/expenses.png)

- **Frontend**: React 19 + Vite + TailwindCSS + TanStack Query + Formik + Yup + Chart.js
- **Backend**: NestJS + Prisma + PostgreSQL + OpenAI API
- **Infraestructura**: AWS (ECS Fargate, RDS, ALB, CloudFront, S3)
- **IaC**: Pulumi con TypeScript
- **Monorepo**: pnpm workspaces + Turbo

---

**Tecnologías**: TypeScript, NestJS, React 19, Vite, TailwindCSS, Zustand, Prisma, PostgreSQL, OpenAI API, AWS, Pulumi, Docker, pnpm, Turbo

## System Design Overview

### Arquitectura

La solución se basa en una arquitectura full-stack que combina:

- **Frontend**: React SPA servido desde S3 con CloudFront
- **Backend**: API NestJS en contenedores ECS Fargate
- **Base de datos**: PostgreSQL en RDS con despliegue multi-AZ
- **Red**: Application Load Balancer + API Gateway
- **Infraestructura**: Definida como código con Pulumi

El enfoque prioriza simplicidad de despliegue, separación de responsabilidades y escalabilidad horizontal, facilitando reproducibilidad, gestión de redes privadas, seguridad con IAM y grupos de seguridad, y observabilidad mediante logs y métricas.

### Decisiones de Diseño

**Servicios Administrados de AWS**:

- ✅ Reducen la carga operativa
- ❌ Mayor costo base y dependencia de la plataforma

### Fortalezas

- 🔧 **Mantenibilidad**: Código modular y bien estructurado
- 📦 **Modularidad**: Separación clara de responsabilidades
- 📈 **Escalabilidad**: Capacidad de escalar componentes independientemente
- 🔄 **Reproducibilidad**: Infraestructura como código
- 🔒 **Seguridad**: IAM y grupos de seguridad configurados
- 📊 **Observabilidad**: Logs y métricas integradas

### Áreas de Mejora

- 🌐 **Complejidad de red**: Configuración inicial de VPC y permisos
- 🎨 **Diseño UI**: Consistencia visual y experiencia de usuario
- ⚡ **Performance**: Cacheo en rutas críticas
- 🛡️ **Seguridad**: Implementación de WAF

### Funcionalidades Futuras

- 📄 **Reportes**: Descarga de reportes en PDF/Excel
- 💰 **Presupuestos**: Alertas personalizadas de gastos
- 🤖 **AI**: Categorización inteligente de gastos
- 📊 **Análisis**: Importación de resúmenes bancarios y facturas
- 💡 **Insights**: Análisis de costos con IA en base a facturas con multiples costos
