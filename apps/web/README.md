# 🎨 Frontend - Expense Manager Web

Aplicación web construida con React 19, Vite, TailwindCSS y Zustand para la gestión de finanzas personales. Incluye dashboard interactivo, gráficos y asistente de IA.

## 🏗️ Stack Tecnológico

- **Framework**: React 19 con TypeScript
- **Build Tool**: Vite 7.x con SWC
- **Estilos**: TailwindCSS 4.x
- **Estado**: Zustand para state management
- **HTTP Client**: Axios con interceptors
- **Gráficos**: Chart.js con react-chartjs-2
- **Queries**: TanStack React Query
- **Formularios**: Formik + Yup validation
- **Deploy**: AWS S3 + CloudFront con Pulumi

## 🚀 Desarrollo Local

### Inicialización

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm run dev
```

La aplicación estará disponible en http://localhost:5173

### Configurar integración con backend

Crear `.env.local`:

```bash
VITE_API_URL=http://localhost:3000/api
```

## 📋 Scripts Disponibles

| Script             | Descripción                      |
| ------------------ | -------------------------------- |
| `pnpm run dev`     | Servidor de desarrollo con HMR   |
| `pnpm run build`   | Build optimizado para producción |
| `pnpm run preview` | Preview del build local          |
| `pnpm run lint`    | ESLint con reglas React          |

## 🌐 Variables de Entorno

Ver `.env.example` para configuración completa:

| Variable       | Descripción              | Default                     |
| -------------- | ------------------------ | --------------------------- |
| `VITE_API_URL` | URL base del API backend | `http://localhost:3000/api` |

**Nota**: Variables deben usar prefijo `VITE_` para ser expuestas al cliente.

## 🏗️ Estructura de Componentes

```
src/
├── main.tsx                # Entry point con providers
├── App.tsx                 # Componente raíz
├── components/             # Componentes React
│   ├── Dashboard.tsx       # Dashboard principal
│   ├── ExpenseForm.tsx     # Formulario de gastos
│   ├── IncomeForm.tsx      # Formulario de ingresos
│   ├── TransactionHistory.tsx # Historial de transacciones
│   ├── AIAssistant.tsx     # Asistente de IA
│   ├── ChartsSection.tsx   # Sección de gráficos
│   └── ...                 # Otros componentes
├── hooks/                  # Custom hooks
│   ├── useExpenses.ts      # Hook de gastos
│   ├── useIncomes.ts       # Hook de ingresos
│   ├── useCategories.ts    # Hook de categorías
│   └── useStatistics.ts    # Hook de estadísticas
├── services/               # Clients HTTP
│   ├── expenseService.ts   # API de gastos
│   ├── incomeService.ts    # API de ingresos
│   ├── categoryService.ts  # API de categorías
│   ├── statisticsService.ts # API de estadísticas
│   └── aiService.ts        # API de IA
├── store/                  # Estado global
│   └── financeStore.ts     # Store Zustand
├── types/                  # Definiciones TypeScript
│   ├── expense.ts          # Tipos de gastos
│   ├── income.ts           # Tipos de ingresos
│   ├── category.ts         # Tipos de categorías
│   └── ...                 # Otros tipos
├── validation/             # Esquemas de validación
│   └── schemas.ts          # Esquemas Yup
└── lib/                    # Utilidades
    └── axios.ts            # Configuración Axios
```

## 🎯 Funcionalidades

### Dashboard Principal

- **Resumen financiero**: Ingresos, gastos y balance actual
- **Gráficos interactivos**: Chart.js para visualización de datos
- **Formularios reactivos**: Creación y edición de transacciones
- **Filtros**: Por fecha, categoría y tipo

### Gestión de Transacciones

- **Gastos**: CRUD completo con categorización
- **Ingresos**: Registro y seguimiento
- **Categorías**: Gestión dinámica de categorías
- **Historial**: Vista consolidada de todas las transacciones

### Asistente de IA

- **Análisis financiero**: Insights automáticos basados en datos
- **Recomendaciones**: Sugerencias de ahorro y optimización
- **Markdown rendering**: Respuestas formateadas

## 🔄 Integración con Backend

### Configuración de Axios

```typescript
// lib/axios.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
});
```

### React Query Setup

```typescript
// main.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 },
  },
});
```

### Estado Global con Zustand

```typescript
// store/financeStore.ts - Gestión centralizada de estado
interface FinanceStore {
  expenses: Expense[];
  incomes: Income[];
  categories: Category[];
  // ... otros estados y acciones
}
```

## 🎨 Sistema de Diseño

### TailwindCSS 4.x

- **Responsive design**: Mobile-first approach
- **Color palette**: Grises y acentos azules
- **Componentes**: Diseño consistente y reutilizable
- **Dark mode**: TODO - implementar tema oscuro

### Componentes Base

- **Forms**: Estilizados con Formik y validación Yup
- **Buttons**: Variantes primary, secondary, danger
- **Cards**: Layout base para secciones
- **Charts**: Integración con Chart.js

## 🏗️ Build y Deploy

### Build local

```bash
pnpm run build      # Output en ./dist/
pnpm run preview    # Preview local del build
```

### Deploy a AWS

```bash
cd infra
pulumi stack select dev
pulumi up           # Deploy a S3 + CloudFront
```

### Optimizaciones de Build

- **Code splitting**: Automático por Vite
- **Tree shaking**: Eliminación de código no usado
- **Asset optimization**: Compresión de imágenes y assets
- **Bundle analysis**: Vite-bundle-analyzer para análisis

## 🧪 Testing

**TODO**: Configurar testing suite

- [ ] Vitest para tests unitarios
- [ ] React Testing Library para tests de componentes
- [ ] Cypress/Playwright para E2E
- [ ] MSW para mocking de API

## 🚀 Performance

### Optimizaciones aplicadas

- **React 19**: Nuevas features de performance
- **Lazy loading**: Componentes y rutas
- **Memoization**: React.memo en componentes pesados
- **Virtual scrolling**: Para listas largas (TODO)

### Métricas objetivo

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s

## 🔧 Desarrollo

### Hot Module Replacement

Vite proporciona HMR automático para:

- Componentes React
- Estilos TailwindCSS
- Assets estáticos

### Debugging

- **React DevTools**: Inspección de componentes
- **TanStack Query DevTools**: Debug de queries
- **Zustand DevTools**: Estado global

### Code Quality

```bash
pnpm run lint       # ESLint con reglas React
```

**TODO**: Configurar herramientas adicionales

- [ ] Prettier para formateo automático
- [ ] Husky para pre-commit hooks
- [ ] TypeScript strict mode

## ⚠️ TODOs

- [ ] Implementar modo oscuro con TailwindCSS
- [ ] Configurar PWA con service workers
- [ ] Añadir testing suite completo
- [ ] Implementar lazy loading para componentes pesados
- [ ] Configurar bundle analysis automático
- [ ] Agregar i18n para múltiples idiomas
- [ ] Optimizar performance de gráficos Chart.js
