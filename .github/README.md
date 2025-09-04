# GitHub Actions Workflows

Este directorio contiene todos los workflows de GitHub Actions para el proyecto Expense Manager.

## 📋 Workflows Disponibles

### 1. **CI** (`ci.yml`)

- **Trigger**: Push a `main`/`develop` y Pull Requests
- **Propósito**: Testing, linting y building
- **Jobs**:
  - `test`: Ejecuta linting, type checking y tests
  - `build`: Construye todas las aplicaciones y sube artifacts

### 2. **Deploy Backend** (`deploy-backend.yml`)

- **Trigger**: Push a `main` (solo cambios en `apps/backend/`) o manual
- **Propósito**: Despliega el backend a AWS usando Pulumi
- **Environments**: dev, staging, prod
- **Jobs**:
  - `deploy`: Despliega infraestructura, construye y sube imagen Docker

### 3. **Deploy Frontend** (`deploy-frontend.yml`)

- **Trigger**: Push a `main` (solo cambios en `apps/web/`) o manual
- **Propósito**: Despliega el frontend a Vercel
- **Jobs**:
  - `deploy`: Construye y despliega el frontend

### 4. **Database Migration** (`database-migration.yml`)

- **Trigger**: Push a `main` (solo cambios en `apps/backend/prisma/`) o manual
- **Propósito**: Ejecuta migraciones de base de datos
- **Environments**: dev, staging, prod
- **Jobs**:
  - `migrate`: Ejecuta migraciones de Prisma

### 5. **Security Scan** (`security-scan.yml`)

- **Trigger**: Push a `main`/`develop`, PRs y semanalmente
- **Propósito**: Escaneo de seguridad
- **Jobs**:
  - `security`: Ejecuta npm audit, Snyk y CodeQL

### 6. **Cleanup** (`cleanup.yml`)

- **Trigger**: Semanalmente (domingos a las 3 AM) o manual
- **Propósito**: Limpieza de recursos antiguos
- **Jobs**:
  - `cleanup`: Limpia imágenes Docker, artifacts y logs antiguos

## 🔧 Configuración de Environments

### Dev

- **Aprobaciones**: 1 reviewer
- **Wait time**: 0 minutos
- **Branch policy**: Custom branches permitidos

### Staging

- **Aprobaciones**: 2 reviewers
- **Wait time**: 5 minutos
- **Branch policy**: Solo branches protegidos

### Prod

- **Aprobaciones**: 3 reviewers
- **Wait time**: 10 minutos
- **Branch policy**: Solo branches protegidos

## 🔐 Secrets Requeridos

### AWS

- `AWS_ACCESS_KEY_ID`: Access key de AWS
- `AWS_SECRET_ACCESS_KEY`: Secret key de AWS
- `AWS_REGION`: Región de AWS (default: us-east-1)
- `PULUMI_S3_BUCKET`: Bucket S3 para almacenar el estado de Pulumi

### Base de Datos y Seguridad

- `DB_PASSWORD`: Contraseña de la base de datos PostgreSQL
- `JWT_SECRET`: Clave secreta para firmar tokens JWT

### Vercel

- `VERCEL_TOKEN`: Token de Vercel
- `VERCEL_ORG_ID`: ID de la organización de Vercel
- `VERCEL_PROJECT_ID`: ID del proyecto de Vercel

### Seguridad

- `SNYK_TOKEN`: Token de Snyk para escaneo de seguridad

### Aplicación

- `VITE_API_URL`: URL de la API para el frontend

## 🚀 Uso

### Despliegue Automático

Los workflows se ejecutan automáticamente cuando:

- Se hace push a `main` (deploy a producción)
- Se hace push a `develop` (deploy a staging)
- Se crea un Pull Request (CI)

### Despliegue Manual

Puedes ejecutar workflows manualmente desde la pestaña "Actions" de GitHub:

1. Ve a **Actions** en tu repositorio
2. Selecciona el workflow que quieres ejecutar
3. Haz clic en **Run workflow**
4. Selecciona el branch y configuración
5. Ejecuta el workflow

### Despliegue por Environment

Para desplegar a un environment específico:

1. Ejecuta el workflow manualmente
2. Selecciona el environment deseado
3. El workflow aplicará las reglas de protección del environment

## 📊 Monitoreo

### Logs

- Los logs de los workflows están disponibles en la pestaña **Actions**
- Los logs de la aplicación están en CloudWatch Logs

### Notificaciones

- Los workflows envían notificaciones por email por defecto
- Puedes configurar notificaciones adicionales en la configuración del repositorio

### Métricas

- Tiempo de ejecución de workflows
- Tasa de éxito/fallo
- Tiempo de despliegue

## 🔧 Troubleshooting

### Problemas Comunes

1. **Build falla**
   - Verifica que todas las dependencias estén instaladas
   - Revisa los logs de build para errores específicos

2. **Deploy falla**
   - Verifica las credenciales de AWS/Vercel
   - Asegúrate de que el environment esté configurado correctamente

3. **Migraciones fallan**
   - Verifica la conexión a la base de datos
   - Revisa que las migraciones sean compatibles

4. **Security scan falla**
   - Revisa las vulnerabilidades reportadas
   - Actualiza las dependencias si es necesario

### Debugging

- Usa `actions/upload-artifact` para subir logs adicionales
- Habilita debug logging en los workflows
- Revisa los outputs de Pulumi para información de infraestructura
