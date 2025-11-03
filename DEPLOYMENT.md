# 🚀 Plan de Deployment - VetCard

## 📋 PREPARACIÓN ANTES DE SUBIR A PRODUCCIÓN

### ✅ Paso 1: Seguridad (CRÍTICO - YA COMPLETADO)
- [x] Mover credenciales de Supabase a variables de entorno
- [x] Crear archivo `.env.local` (no se sube a Git)
- [x] Crear archivo `.env.example` como plantilla

### ⚙️ Paso 2: Verificar Build de Producción
```bash
npm run build
```
Si hay errores, corrígelos antes de continuar.

### 📝 Paso 3: Actualizar URLs de Producción
Cuando tengas el dominio final, actualiza:
- `NEXT_PUBLIC_APP_URL` en las variables de entorno de producción

---

## 🌐 DEPLOYMENT EN VERCEL (RECOMENDADO)

Vercel es la plataforma ideal para Next.js (creada por el equipo de Next.js).

### 🎯 Ventajas:
- ✅ **Gratis** para proyectos personales
- ✅ **SSL automático** (HTTPS)
- ✅ **CDN global** (rápido en todo el mundo)
- ✅ **Deploy automático** desde Git
- ✅ **Dominio gratuito** (.vercel.app)
- ✅ **Variables de entorno** fáciles de configurar
- ✅ **Preview deployments** para cada PR

### 📝 Pasos para Deploy:

#### 1. **Crear cuenta en Vercel**
   - Ve a https://vercel.com
   - Registrate con GitHub (recomendado)

#### 2. **Preparar repositorio Git**
```bash
# Si no tienes Git inicializado:
git init
git add .
git commit -m "Initial commit"

# Crear repositorio en GitHub:
# 1. Ve a github.com
# 2. Click en "New repository"
# 3. No inicialices con README (ya tienes archivos)
# 4. Copia la URL del repositorio

# Conectar tu repositorio local:
git remote add origin https://github.com/tu-usuario/vetcard.git
git branch -M main
git push -u origin main
```

#### 3. **Importar proyecto en Vercel**
   - En Vercel, click en "Add New Project"
   - Conecta tu repositorio de GitHub
   - Vercel detectará Next.js automáticamente

#### 4. **Configurar Variables de Entorno en Vercel**
   - En la configuración del proyecto, ve a "Environment Variables"
   - Agrega estas variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://irukhaxtflhvhewuzzfq.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     NEXT_PUBLIC_APP_URL=https://tu-proyecto.vercel.app
     ```

#### 5. **Deploy**
   - Click en "Deploy"
   - Espera 2-3 minutos
   - ¡Tu app estará en línea! 🎉

#### 6. **Configurar dominio personalizado (opcional)**
   - En "Settings" > "Domains"
   - Agrega tu dominio personalizado
   - Sigue las instrucciones de DNS

---

## 📊 LÍMITES Y ESCALABILIDAD DE SUPABASE

### 🆓 **Plan Gratuito (Free Tier)**

#### Límites por mes:
- ✅ **500 MB** de base de datos
- ✅ **1 GB** de almacenamiento de archivos
- ✅ **50,000 usuarios activos** (MAU - Monthly Active Users)
- ✅ **2 GB de transferencia** de datos
- ✅ **500 MB** de ancho de banda de storage

#### ¿Cuántos usuarios aguanta?

**Estimación conservadora:**
- **50-100 usuarios activos simultáneos** sin problemas
- **Hasta 5,000 usuarios únicos/mes** funcionando bien
- **100-200 mascotas registradas** (cada mascota ~1-2 KB de datos)

**¿Qué pasa si se satura?**
- ⚠️ La base de datos puede volverse más lenta
- ⚠️ Puedes alcanzar el límite de almacenamiento
- ⚠️ Supabase enviará emails de advertencia cuando llegues al 80% del límite

### 💰 **Cuándo necesitas actualizar:**

#### Plan Pro ($25/mes):
- **8 GB** de base de datos
- **100 GB** de almacenamiento
- **100,000 usuarios activos**
- **50 GB** de transferencia

#### Plan Team ($599/mes):
- **50 GB** de base de datos
- **400 GB** de almacenamiento
- **500,000 usuarios activos**
- **500 GB** de transferencia

### 📈 **Recomendaciones:**

1. **Para empezar (LinkedIn, primeros usuarios):**
   - ✅ El plan **gratuito es suficiente**
   - ✅ Monitorea el dashboard de Supabase
   - ✅ Configura alertas en Supabase (Settings > Usage)

2. **Señales de que necesitas actualizar:**
   - 📊 Uso de base de datos > 400 MB (80% del límite)
   - 👥 Más de 500 usuarios únicos/mes
   - 📁 Más de 800 MB de fotos almacenadas
   - ⏱️ Respuestas lentas de la base de datos

3. **Optimizaciones para maximizar el plan gratuito:**
   - ✅ **Comprimir imágenes** antes de subirlas (ya lo tienes)
   - ✅ **Límite de tamaño** de fotos en el formulario (ej: 2 MB máximo)
   - ✅ **Limpieza periódica** de registros antiguos (opcional)
   - ✅ **Índices en la base de datos** para consultas rápidas

---

## 🔒 SEGURIDAD EN PRODUCCIÓN

### ✅ Checklist de Seguridad:

- [x] Credenciales en variables de entorno (no en código)
- [ ] **Verificar políticas RLS en Supabase** (ya las tienes configuradas)
- [ ] **Habilitar rate limiting** (opcional, Vercel lo tiene por defecto)
- [ ] **Revisar permisos de Storage** en Supabase

### 🛡️ Verificar RLS Policies en Supabase:

1. Ve a tu proyecto en Supabase Dashboard
2. Settings > API > Row Level Security
3. Verifica que las tablas tengan políticas correctas:
   - `pets`: Los usuarios solo pueden ver/editar sus propias mascotas
   - `vaccines`, `dewormings`, `consultations`: Solo acceso del dueño
   - **EXCEPCIÓN:** La política pública para el carrusel (`"Public can view pets for carousel"`)

---

## 📱 MONITOREO POST-DEPLOYMENT

### 🎯 Qué monitorear:

1. **Supabase Dashboard:**
   - Database usage (base de datos)
   - Storage usage (fotos)
   - API requests (peticiones)

2. **Vercel Analytics:**
   - Número de visitantes
   - Tiempo de carga
   - Errores

3. **Logs:**
   - Vercel > Deployments > Logs
   - Supabase > Logs > API

---

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### ❌ Error: "Missing Supabase environment variables"
**Solución:** Verifica que todas las variables estén configuradas en Vercel

### ❌ Error: "Image hostname not configured"
**Solución:** Ya está configurado en `next.config.ts`, no debería pasar

### ❌ Error: "Rate limit exceeded"
**Solución:** Puede pasar con tráfico alto, considera actualizar el plan de Supabase

### ❌ La app carga lento
**Solución:** 
- Verifica que estás usando el CDN de Vercel
- Comprueba el tamaño de las imágenes
- Activa Vercel Analytics para identificar cuellos de botella

---

## ✅ CHECKLIST FINAL ANTES DE PUBLICAR EN LINKEDIN

- [ ] Build de producción funciona (`npm run build`)
- [ ] Variables de entorno configuradas en Vercel
- [ ] App desplegada y accesible en el dominio
- [ ] Probar registro y login
- [ ] Probar crear mascota
- [ ] Probar subir foto de mascota
- [ ] Probar generar PDF
- [ ] Verificar que el carrusel muestra mascotas
- [ ] Probar en móvil (responsive)
- [ ] Verificar modo oscuro funciona
- [ ] Configurar dominio personalizado (opcional pero recomendado)

---

## 🎉 ¡LISTO PARA PUBLICAR!

Una vez completado todo:
1. Comparte el link en LinkedIn
2. Monitorea las métricas las primeras semanas
3. ¡Disfruta viendo crecer tu aplicación! 🚀

---

## 📞 SOPORTE

Si encuentras algún problema durante el deployment:
- Documentación Vercel: https://vercel.com/docs
- Documentación Supabase: https://supabase.com/docs
- Comunidad: https://github.com/supabase/supabase/discussions

---

**¡Buena suerte con tu lanzamiento! 🐾💙**

