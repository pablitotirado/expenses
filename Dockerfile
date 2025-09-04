# Multi-stage build para optimizar el tamaño de la imagen final
FROM node:18-alpine AS base

# Instalar dependencias del sistema necesarias para Prisma y health checks
RUN apk add --no-cache libc6-compat openssl wget

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY apps/backend/package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/shared/src ./packages/shared/src
COPY packages/shared/tsconfig.json ./packages/shared/
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Instalar dependencias
RUN pnpm install --no-frozen-lockfile

# Copiar archivos de Prisma
COPY apps/backend/prisma ./prisma/

# Generar cliente de Prisma
RUN pnpm run db:generate

# Construir el paquete shared
RUN cd packages/shared && pnpm run build

# Etapa de construcción
FROM base AS builder

# Copiar código fuente
COPY apps/backend/ .

# Copiar el paquete shared construido desde la etapa base
COPY --from=base /app/packages ./packages
COPY --from=base /app/node_modules ./node_modules

# Verificar que start.sh se copió correctamente
RUN ls -la scripts/start.sh || echo "start.sh not found in builder stage"

# Construir la aplicación
RUN pnpm run build

# Etapa de producción
FROM node:18-alpine AS production

# Instalar dependencias del sistema necesarias para Prisma y health checks
RUN apk add --no-cache libc6-compat openssl wget

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY apps/backend/package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/shared/src ./packages/shared/src
COPY packages/shared/tsconfig.json ./packages/shared/
COPY pnpm-workspace.yaml ./

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Instalar solo dependencias de producción
RUN pnpm install --prod

# Copiar archivos de Prisma desde la etapa base
COPY --from=base /app/prisma ./prisma/

# Copiar archivos construidos desde la etapa de builder
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Copiar script de inicio desde la etapa de builder
COPY --from=builder --chown=nestjs:nodejs /app/scripts/start.sh ./start.sh
RUN chmod +x ./start.sh

# Verificar que start.sh se copió correctamente
RUN ls -la start.sh || echo "start.sh not found in production stage"

# Cambiar ownership de node_modules al usuario nestjs
RUN chown -R nestjs:nodejs /app/node_modules

# Cambiar al usuario no-root ANTES de generar Prisma
USER nestjs

# Generar cliente de Prisma como usuario nestjs
RUN npx prisma generate

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Comando de inicio
CMD ["./start.sh"]
