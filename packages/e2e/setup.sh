#!/bin/bash

# Script para configurar y ejecutar los tests e2e

set -e

echo "🚀 Configurando tests e2e para Expense Manager..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Este script debe ejecutarse desde el directorio e2e/"
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
pnpm install

# Verificar que Docker esté ejecutándose
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está ejecutándose"
    exit 1
fi

# Verificar que la aplicación esté ejecutándose
echo "🔍 Verificando que la aplicación esté ejecutándose..."
if ! curl -s http://localhost:3000/api/health > /dev/null; then
    echo "⚠️  La aplicación no está ejecutándose. Iniciando..."
    cd ..
    docker compose up -d
    cd packages/e2e
    
    # Esperar a que la aplicación esté lista
    echo "⏳ Esperando a que la aplicación esté lista..."
    for i in {1..30}; do
        if curl -s http://localhost:3000/api/health > /dev/null; then
            echo "✅ Aplicación lista!"
            break
        fi
        sleep 1
    done
else
    echo "✅ Aplicación ya está ejecutándose"
fi

# Ejecutar tests
echo "🧪 Ejecutando tests e2e..."
pnpm test

echo "✅ Tests completados!"
