# GitHub Secrets Configuration

Este documento explica cómo configurar los secretos de GitHub para el proyecto Expense Manager.

## 🔐 Configuración de Secrets

### 1. Acceder a la Configuración de Secrets

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, haz clic en **Secrets and variables** → **Actions**
4. Haz clic en **New repository secret**

### 2. Cómo se Usan los Secrets

Los secrets de GitHub se inyectan en Pulumi usando `pulumi config set --secret`:

```bash
# En el workflow de GitHub Actions
pulumi config set --secret dbPassword ${{ secrets.DB_PASSWORD }}
pulumi config set --secret jwtSecret ${{ secrets.JWT_SECRET }}

# En el código de Pulumi
const config = new pulumi.Config();
const dbPassword = config.require('dbPassword');
const jwtSecret = config.require('jwtSecret');
```

### 2. Secrets Requeridos

#### **AWS Credentials**

```
Name: AWS_ACCESS_KEY_ID
Value: tu-access-key-id-de-aws

Name: AWS_SECRET_ACCESS_KEY
Value: tu-secret-access-key-de-aws

Name: AWS_REGION
Value: us-east-1

Name: PULUMI_S3_BUCKET
Value: tu-bucket-s3-para-pulumi-state
```

#### **Base de Datos y Seguridad**

```
Name: DB_PASSWORD
Value: tu-contraseña-super-segura-para-la-base-de-datos

Name: JWT_SECRET
Value: tu-clave-secreta-jwt-super-segura-y-larga
```

#### **Vercel (Frontend)**

```
Name: VERCEL_TOKEN
Value: tu-token-de-vercel

Name: VERCEL_ORG_ID
Value: tu-org-id-de-vercel

Name: VERCEL_PROJECT_ID
Value: tu-project-id-de-vercel
```

#### **Seguridad (Opcional)**

```
Name: SNYK_TOKEN
Value: tu-token-de-snyk
```

#### **Aplicación**

```
Name: VITE_API_URL
Value: https://tu-api-gateway-url.amazonaws.com
```

## 🔒 Mejores Prácticas de Seguridad

### **Contraseña de Base de Datos**

- Mínimo 16 caracteres
- Incluir mayúsculas, minúsculas, números y símbolos
- Ejemplo: `MyDb2024!@#$%^&*()`

### **JWT Secret**

- Mínimo 32 caracteres
- Usar caracteres aleatorios
- Ejemplo: `jwt-super-secret-key-2024-very-long-and-secure`

### **Pulumi S3 Bucket**

- Bucket S3 para almacenar el estado de Pulumi
- Debe existir antes de ejecutar los workflows
- Ejemplo: `my-pulumi-state-bucket`
- **Importante**: El bucket debe estar en la misma región que los recursos

### **Generación de Secrets**

```bash
# Generar contraseña segura
openssl rand -base64 32

# Generar JWT secret
openssl rand -hex 32
```

## 🌍 Configuración por Environment

### **Development**

- Usar valores de prueba para desarrollo local
- Los secrets se usan solo para LocalStack

### **Staging**

- Usar secrets específicos para staging
- Diferentes de producción

### **Production**

- Secrets más seguros y únicos
- Rotar periódicamente

## 📋 Checklist de Configuración

- [ ] AWS_ACCESS_KEY_ID configurado
- [ ] AWS_SECRET_ACCESS_KEY configurado
- [ ] AWS_REGION configurado
- [ ] PULUMI_S3_BUCKET configurado (bucket para estado de Pulumi)
- [ ] DB_PASSWORD configurado (contraseña segura)
- [ ] JWT_SECRET configurado (clave larga y segura)
- [ ] VERCEL_TOKEN configurado
- [ ] VERCEL_ORG_ID configurado
- [ ] VERCEL_PROJECT_ID configurado
- [ ] VITE_API_URL configurado
- [ ] SNYK_TOKEN configurado (opcional)

## 🚨 Importante

- **Nunca** commits secrets al repositorio
- **Nunca** compartas secrets en logs o mensajes
- **Rota** los secrets periódicamente
- **Usa** diferentes secrets para cada environment
- **Verifica** que los secrets estén configurados antes del despliegue

## 🔧 Troubleshooting

### **Error: Secret not found**

- Verifica que el secret esté configurado en GitHub
- Verifica que el nombre del secret sea exacto
- Verifica que el secret esté disponible en el environment correcto

### **Error: Pulumi config not found**

- Verifica que los secrets se hayan configurado con `pulumi config set --secret`
- Verifica que el stack de Pulumi esté seleccionado correctamente
- Verifica que los nombres de configuración coincidan (`dbPassword`, `jwtSecret`)

### **Error: Invalid credentials**

- Verifica que las credenciales de AWS sean correctas
- Verifica que el usuario tenga los permisos necesarios
- Verifica que la región sea correcta

### **Error: Database connection failed**

- Verifica que la contraseña de la base de datos sea correcta
- Verifica que el JWT secret sea válido
- Verifica que los secrets estén disponibles en el workflow

### **Error: Pulumi login failed**

- Verifica que el bucket S3 existe y es accesible
- Verifica que las credenciales AWS tienen permisos para S3
- Verifica que el bucket está en la región correcta
- Verifica que el nombre del bucket es correcto (sin `s3://` ni `/` al final)

### **Verificar Configuración de Pulumi**

```bash
# Ver configuración actual
pulumi config

# Ver configuración de secrets (sin mostrar valores)
pulumi config --show-secrets
```
