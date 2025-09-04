# Infraestructura del Frontend - Expenses Web

Este directorio contiene la infraestructura como código (IaC) usando Pulumi para desplegar el frontend de React en AWS.

## Arquitectura

La infraestructura usa **@pulumi/aws-static-website** que automáticamente crea:

- **S3 Bucket**: Para almacenar los archivos estáticos del frontend
- **CloudFront Distribution**: CDN para servir la aplicación con baja latencia
- **Origin Access Control (OAC)**: Seguridad para acceso exclusivo desde CloudFront
- **Sincronización automática**: Carga todos los archivos del directorio `dist`

## Características

- ✅ **Implementación simplificada** con una sola línea de código
- ✅ Hosting estático optimizado para SPAs (Single Page Applications)
- ✅ Compresión automática de archivos
- ✅ Cache inteligente configurado automáticamente
- ✅ Redirección HTTPS automática
- ✅ Soporte para rutas del lado del cliente
- ✅ Sincronización automática de archivos

## Prerrequisitos

1. **Pulumi CLI** instalado
2. **AWS CLI** configurado con credenciales apropiadas
3. **pnpm** instalado
4. **Build del frontend** disponible en el directorio `../dist`

## Uso Rápido

### Despliegue automático

```bash
# Desde el directorio apps/web
./deploy.sh
```

### Despliegue manual

1. **Construir el frontend**:

   ```bash
   cd ../
   pnpm run build
   ```

2. **Configurar Pulumi**:

   ```bash
   cd infra
   pulumi login  # Usar S3 backend
   pulumi stack select dev  # o pulumi stack init dev
   ```

3. **Desplegar**:

   ```bash
   pulumi up
   ```

4. **Ver la URL del sitio**:
   ```bash
   pulumi stack output websiteUrl
   ```

## Configuración

La configuración se encuentra en `Pulumi.dev.yaml`:

```yaml
config:
  aws:region: us-east-1
  expenses-web-infra:environment: dev
```

## Outputs

Después del despliegue, se exponen estos outputs:

- `websiteUrl`: URL HTTPS del sitio web (CloudFront)
- `bucketName`: Nombre del bucket S3
- `bucketWebsiteUrl`: Endpoint directo del bucket S3 (solo para referencia)

## Implementación

El código es extremadamente simple:

```typescript
const website = new staticwebsite.Website('expenses-web', {
  sitePath: path.join(__dirname, '../dist'),
  withCDN: true,
  targetDomain: undefined, // Use CloudFront domain
  withLogs: false,
});
```

**@pulumi/aws-static-website** maneja automáticamente:

1. **Creación** del bucket S3 con configuración correcta
2. **Configuración** de CloudFront con optimizaciones para SPAs
3. **Sincronización** automática de todos los archivos del directorio `dist`
4. **Seguridad** con Origin Access Control
5. **Cache** optimizado para diferentes tipos de archivos

## Troubleshooting

### El directorio dist no existe

```bash
cd ../
pnpm run build
```

### Error de credenciales AWS

```bash
aws configure
# o
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
```

### Error de login Pulumi

```bash
pulumi login s3://your-pulumi-state-bucket
```

## Limpieza

Para destruir la infraestructura:

```bash
pulumi destroy
```

⚠️ **Nota**: Esto eliminará permanentemente el bucket S3 y la distribución CloudFront.
