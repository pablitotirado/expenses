# Expense Manager E2E Tests

Tests end-to-end para la aplicación Expense Manager que prueban los flujos principales de la aplicación.

## Requisitos

- Node.js >= 18
- Docker y Docker Compose
- La aplicación backend ejecutándose en el puerto 3000

## Configuración

1. Instalar dependencias:

```bash
cd packages/e2e
pnpm install
```

2. Asegurarse de que la aplicación esté ejecutándose:

```bash
# Desde el directorio raíz del proyecto
docker compose up -d
```

## Ejecutar Tests

```bash
# Ejecutar todos los tests (recomendado - limpia la DB primero)
pnpm test:clean

# Ejecutar tests sin limpiar la base de datos
pnpm test

# Ejecutar tests en modo watch
pnpm test:watch

# Solo limpiar la base de datos
pnpm clean
```

## Qué prueban los tests

### 1. Health Check

- Verifica que la aplicación esté funcionando correctamente
- Valida la respuesta del endpoint `/api/health`

### 2. Flujo de Categorías

- Lista inicial vacía de categorías
- Creación de una nueva categoría
- Recuperación de categoría por ID
- Lista de categorías con la creada
- Actualización de categoría
- Limpieza automática al finalizar

### 3. Flujo de Gastos

- Lista inicial vacía de gastos
- Creación de un nuevo gasto (vinculado a una categoría)
- Recuperación de gasto por ID
- Lista de gastos con el creado
- Actualización de gasto
- Limpieza automática al finalizar

### 4. Flujo de Ingresos

- Lista inicial vacía de ingresos
- Creación de un nuevo ingreso
- Recuperación de ingreso por ID
- Lista de ingresos con el creado
- Actualización de ingreso
- Limpieza automática al finalizar

### 5. Estadísticas

- Verificación del endpoint de estadísticas
- Validación de la estructura de respuesta

### 6. Manejo de Errores

- Respuestas para recursos no existentes
- Validación de datos inválidos
- Manejo de errores de validación

### 7. Integridad de Datos

- Consistencia entre operaciones
- Relaciones correctas entre entidades
- Mantenimiento de datos durante las operaciones

## Características

- **Tests independientes**: Cada test puede ejecutarse de forma independiente
- **Limpieza automática**: Los datos de prueba se limpian automáticamente
- **Espera inteligente**: Los tests esperan a que la aplicación esté lista
- **Validación completa**: Verifica tanto el estado HTTP como los datos de respuesta
- **Sin dependencias externas**: Solo usa Node.js nativo y fetch

## Estructura

```
packages/e2e/
├── package.json          # Configuración del proyecto
├── test-utils.js         # Utilidades para los tests
├── test/
│   └── expense-manager.test.js  # Tests principales
└── README.md             # Este archivo
```

## Notas

- Los tests asumen que la base de datos está vacía al inicio
- Se crean datos de prueba únicos para evitar conflictos
- Los tests verifican tanto la funcionalidad como la integridad de los datos
- El tiempo de espera para que la aplicación esté lista es de 30 segundos
