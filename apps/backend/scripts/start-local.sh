#!/bin/bash

# ===========================================
# SCRIPT DE DESARROLLO LOCAL - EXPENSE MANAGER
# ===========================================
# Este script levanta el entorno completo de desarrollo:
# 1. PostgreSQL en Docker
# 2. Ejecuta migraciones de Prisma
# 3. Inicia la aplicación en modo desarrollo

set -e  # Terminar si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con color
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] || [ ! -f "docker-compose.yml" ]; then
    print_error "Este script debe ejecutarse desde el directorio apps/backend"
    exit 1
fi

# Verificar que existe el archivo .env
if [ ! -f ".env" ]; then
    print_warning "No se encontró archivo .env"
    if [ -f "env.example" ]; then
        print_status "Copiando env.example a .env..."
        cp env.example .env
        print_success "Archivo .env creado desde env.example"
        print_warning "Revisa y ajusta las variables en .env si es necesario"
    else
        print_error "No se encontró env.example. Crea un archivo .env manualmente."
        exit 1
    fi
fi

print_status "🚀 Iniciando entorno de desarrollo local..."

# Detectar comando de Docker Compose disponible
DOCKER_COMPOSE_CMD=""
if command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker-compose"
elif command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
else
    print_error "No se encontró docker-compose ni docker compose. Instala Docker Desktop o Docker Compose."
    exit 1
fi

print_status "Usando comando: $DOCKER_COMPOSE_CMD"

# 1. Levantar PostgreSQL
print_status "📦 Levantando PostgreSQL con Docker Compose..."
$DOCKER_COMPOSE_CMD up -d

# Esperar a que PostgreSQL esté listo
print_status "⏳ Esperando a que PostgreSQL esté listo..."
sleep 10

# Verificar que PostgreSQL esté funcionando
for i in {1..30}; do
    if $DOCKER_COMPOSE_CMD exec -T postgres pg_isready -U postgres -d expense_manager >/dev/null 2>&1; then
        print_success "PostgreSQL está listo!"
        break
    fi
    
    if [ $i -eq 30 ]; then
        print_error "PostgreSQL no se pudo conectar después de 30 intentos"
        print_status "Mostrando logs de PostgreSQL:"
        $DOCKER_COMPOSE_CMD logs postgres
        exit 1
    fi
    
    echo -n "."
    sleep 2
done

# 2. Generar cliente de Prisma
print_status "🔧 Generando cliente de Prisma..."
pnpm run db:generate

# 3. Ejecutar migraciones
print_status "📋 Ejecutando migraciones de base de datos..."
pnpm run db:migrate:deploy

print_success "✅ Base de datos configurada correctamente"

# 4. Mostrar información útil
echo ""
print_success "🎉 Entorno de desarrollo listo!"
echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}  INFORMACIÓN DEL ENTORNO${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}📊 PostgreSQL:${NC} http://localhost:5432"
echo -e "${GREEN}📊 Prisma Studio:${NC} pnpm run db:studio"
echo -e "${GREEN}🔧 Ver logs DB:${NC} $DOCKER_COMPOSE_CMD logs postgres"
echo -e "${GREEN}🛑 Detener DB:${NC} $DOCKER_COMPOSE_CMD down"
echo ""

# 5. Iniciar la aplicación directamente
print_status "🚀 Iniciando aplicación en modo desarrollo..."
echo ""
print_status "La aplicación estará disponible en:"
echo -e "${GREEN}🌐 API:${NC} http://localhost:3000"
echo -e "${GREEN}📖 Docs:${NC} http://localhost:3000/docs"
echo ""
print_warning "Presiona Ctrl+C para detener la aplicación"
echo ""

# Iniciar la aplicación
pnpm run start:dev
