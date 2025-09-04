#!/bin/sh

echo "Starting Expense Manager Backend..."

# Verificar que el directorio prisma existe
if [ ! -d "/app/prisma" ]; then
  echo "Error: /app/prisma directory not found"
  ls -la /app/
  exit 1
fi

echo "Prisma directory found at /app/prisma"

# Verificar que el cliente de Prisma esté generado
if [ ! -d "/app/node_modules/.prisma" ]; then
  echo "Generating Prisma client..."
  npx prisma generate
else
  echo "Prisma client already generated"
fi

# Verificar que la aplicación esté construida
if [ ! -d "/app/dist" ]; then
  echo "Error: /app/dist directory not found"
  exit 1
fi

# Ejecutar migraciones de Prisma
echo "Running Prisma migrations..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
  echo "Error: Failed to run Prisma migrations"
  exit 1
fi

echo "Migrations completed successfully"

echo "Starting application..."
exec node dist/main
