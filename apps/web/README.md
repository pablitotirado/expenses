# Web App - Gestor Financiero Personal

Aplicación web moderna desarrollada con React para la gestión de finanzas personales, con interfaz intuitiva, visualizaciones interactivas y asistente de IA integrado.

## 🏗️ Arquitectura

### Stack Tecnológico

- **Framework**: React 19.x con TypeScript
- **Build Tool**: Vite 7.x
- **Styling**: Tailwind CSS 4.x
- **State Management**: TanStack Query (React Query)
- **Forms**: Formik + Yup validation
- **Charts**: Chart.js + React-ChartJS-2
- **HTTP Client**: Axios
- **Markdown**: React-Markdown
- **Infraestructura**: Pulumi con AWS S3 + CloudFront

### Estructura de Componentes

```
src/
├── components/           # Componentes de UI
│   ├── Dashboard.tsx    # Panel principal
│   ├── AIAssistant.tsx  # Asistente de IA
│   ├── ChartsSection.tsx # Visualizaciones
│   ├── ExpenseForm.tsx  # Formulario de gastos
│   ├── IncomeForm.tsx   # Formulario de ingresos
│   └── ...
├── hooks/               # Custom hooks
├── services/            # Servicios de API
├── types/               # Definiciones TypeScript
└── lib/                 # Utilidades
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- pnpm
- Backend ejecutándose en puerto 3000

### Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp env.example .env
# Editar .env con la URL del backend
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm dev

# Build para producción
pnpm build

# Preview del build
pnpm preview
```

## 🎨 Funcionalidades

### Dashboard Principal

- **Resumen Financiero**: Progress bars visuales para ingresos, gastos y saldo
- **Métricas en Tiempo Real**: Actualización automática de datos
- **Responsive Design**: Adaptable a móviles y desktop

### Gestión de Transacciones

- **Formularios Intuitivos**: Para registrar ingresos y gastos
- **Validación en Tiempo Real**: Con Formik + Yup
- **Categorización**: Gestión de categorías de gastos
- **Historial**: Lista completa de transacciones

### Visualizaciones

- **Gráficos Interactivos**:
  - Gastos por categoría (Doughnut)
  - Ingresos vs Gastos (Bar)
  - Progreso de gastos por categoría
- **Charts Responsivos**: Se adaptan al tamaño de pantalla

### Asistente de IA

- **Recomendaciones Personalizadas**: Basadas en patrones de gasto
- **Análisis Inteligente**: Insights sobre finanzas personales
- **Interfaz Conversacional**: Chat integrado con OpenAI

## 🔧 Configuración

### Variables de Entorno

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Para producción
# VITE_API_URL=https://your-api-domain.com/api
```

### Servicios de API

- **incomeService**: Gestión de ingresos
- **expenseService**: Gestión de gastos
- **categoryService**: Gestión de categorías
- **statisticsService**: Estadísticas financieras
- **aiService**: Integración con IA
- **transactionService**: Historial de transacciones

## 🎯 Componentes Principales

### Dashboard

- Progress bars para métricas clave
- Integración con todos los módulos
- Estado de carga y manejo de errores

### AIAssistant

- Chat interface para recomendaciones
- Integración con OpenAI
- Renderizado de markdown

### ChartsSection

- Múltiples visualizaciones
- Datos en tiempo real
- Responsive design

### Formularios

- **IncomeForm**: Registro de ingresos
- **ExpenseForm**: Registro de gastos con categorías
- Validación completa y UX optimizada

## 🏗️ Infraestructura

### Pulumi + AWS

- **Hosting**: S3 Static Website
- **CDN**: CloudFront para distribución global
- **SSL**: Certificados automáticos
- **Deploy**: Automático desde CI/CD

### Despliegue

```bash
# Configurar Pulumi
cd infra
pulumi login s3://your-bucket

# Desplegar
pulumi up
```

## 🎨 UI/UX

### Design System

- **Tailwind CSS**: Utility-first styling
- **Responsive**: Mobile-first approach
- **Accesibilidad**: Componentes accesibles
- **Consistencia**: Design tokens unificados

### Experiencia de Usuario

- **Loading States**: Indicadores de carga
- **Error Handling**: Manejo elegante de errores
- **Real-time Updates**: Datos actualizados automáticamente
- **Intuitive Navigation**: Flujo de usuario optimizado

## 📱 Responsive Design

- **Mobile**: Optimizado para dispositivos móviles
- **Tablet**: Layout adaptativo para tablets
- **Desktop**: Experiencia completa en desktop
- **Progressive Enhancement**: Funciona en todos los dispositivos

## 🧪 Testing

```bash
# Linting
pnpm lint

# Type checking
tsc --noEmit
```

## 🚀 Performance

- **Vite**: Build ultra-rápido
- **Code Splitting**: Carga optimizada
- **Tree Shaking**: Bundle size mínimo
- **CDN**: Distribución global con CloudFront
