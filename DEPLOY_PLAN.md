# 🚀 PLAN DE DESPLIEGUE - VETCARD

## 📋 ÍNDICE
1. [Preparación Pre-Despliegue](#preparación-pre-despliegue)
2. [Despliegue en Vercel (Recomendado)](#despliegue-en-vercel-recomendado)
3. [Configuración de Supabase](#configuración-de-supabase)
4. [Post-Despliegue](#post-despliegue)
5. [Escalabilidad y Límites](#escalabilidad-y-límites)

---

## 🔧 PREPARACIÓN PRE-DESPLIEGUE

### ✅ Checklist Antes de Desplegar

- [ ] **1. Verificar que el código funcione correctamente**
  ```bash
  npm run build
  npm run start
  ```
  - Debe compilar sin errores
  - Debe iniciar en modo producción

- [ ] **2. Obtener credenciales de Supabase**
  - Ve a tu proyecto en https://supabase.com/dashboard
  - Settings → API
  - Copia:
    - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
    - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

- [ ] **3. Verificar políticas RLS en Supabase**
  - Asegúrate de que la política pública para el carrusel esté activa
  - Revisa que los usuarios puedan registrarse y crear mascotas

- [ ] **4. Optimizar imágenes y assets**
  - Ya configurado en `next.config.ts` ✅
  - Verificar que todas las rutas de imágenes sean correctas

- [ ] **5. Preparar repositorio Git**
  ```bash
  git add .
  git commit -m "Preparación para despliegue"
  git push origin main
  ```

---

## 🌐 DESPLIEGUE EN VERCEL (RECOMENDADO)

### ¿Por qué Vercel?
- ✅ **Gratis** para proyectos personales
- ✅ **Integración perfecta** con Next.js
- ✅ **Deploy automático** desde Git
- ✅ **CDN global** (muy rápido en todo el mundo)
- ✅ **SSL automático** (HTTPS)
- ✅ **Dominio personalizado** gratis

### Pasos Detallados:

#### **Paso 1: Crear cuenta en Vercel**
1. Ve a https://vercel.com
2. Inicia sesión con tu cuenta de **GitHub** (recomendado)

#### **Paso 2: Conectar repositorio**
1. Click en **"Add New Project"**
2. Importa tu repositorio de GitHub
3. Selecciona el proyecto `VetCard`

#### **Paso 3: Configurar variables de entorno**
En la sección **"Environment Variables"**, agrega:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

**⚠️ IMPORTANTE:** 
- Reemplaza con tus valores reales de Supabase
- Estos valores son públicos (comienzan con `NEXT_PUBLIC_`), es seguro exponerlos

#### **Paso 4: Configurar proyecto**
- **Framework Preset:** Next.js (detectado automáticamente)
- **Root Directory:** `vetcard` (si tu repo tiene la carpeta, o `.` si está en la raíz)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

#### **Paso 5: Deploy**
1. Click en **"Deploy"**
2. Espera 2-5 minutos
3. ¡Listo! Obtendrás una URL como: `vetcard.vercel.app`

#### **Paso 6: Dominio personalizado (Opcional)**
1. Ve a **Settings → Domains**
2. Agrega tu dominio personalizado (ej: `vetcard.com`)
3. Sigue las instrucciones para configurar DNS

---

## 🔐 CONFIGURACIÓN DE SUPABASE

### **1. Actualizar URLs de redirección**

1. Ve a **Supabase Dashboard → Authentication → URL Configuration**
2. Agrega a **"Redirect URLs"**:
   ```
   https://tu-app.vercel.app/**
   https://tu-dominio.com/**
   ```
3. En **"Site URL"**, coloca:
   ```
   https://tu-app.vercel.app
   ```

### **2. Verificar Storage Bucket**
1. **Storage → Buckets**
2. Asegúrate de que el bucket `pet-photos` tenga:
   - **Public:** ✅ Activado
   - **File size limit:** 5MB (o el que prefieras)

### **3. Verificar Políticas RLS**
Asegúrate de tener estas políticas activas:

```sql
-- Para que usuarios puedan crear sus propias mascotas
CREATE POLICY "Users can insert own pets" ON pets
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Para que usuarios puedan ver sus propias mascotas
CREATE POLICY "Users can view own pets" ON pets
FOR SELECT USING (auth.uid() = user_id);

-- Para carrusel público (ya la tienes)
CREATE POLICY "Public can view pets for carousel" ON pets
FOR SELECT USING (true);
```

---

## ✅ POST-DESPLIEGUE

### **Checklist de Verificación:**

- [ ] **Probar registro de usuarios**
  - Crear cuenta nueva
  - Verificar email (si está activado)

- [ ] **Probar funcionalidades principales:**
  - ✅ Crear mascota
  - ✅ Subir foto
  - ✅ Agregar vacuna
  - ✅ Agregar desparasitación
  - ✅ Agregar consulta
  - ✅ Generar PDF
  - ✅ Ver carrusel público

- [ ] **Probar en diferentes dispositivos:**
  - 📱 Móvil
  - 📱 Tablet
  - 💻 Desktop

- [ ] **Verificar modo oscuro**
  - Funciona correctamente
  - Colores visibles

- [ ] **Probar performance:**
  - Páginas cargan rápido
  - Imágenes se optimizan
  - Sin errores en consola

---

## 📊 ESCALABILIDAD Y LÍMITES

### **🆓 SUPABASE FREE TIER (Actual)**

#### **Base de Datos:**
- **500 MB de almacenamiento** de base de datos
- **2 GB de bandwidth** (transferencia)
- **Sin límite de requests** (pero con rate limiting)

#### **Autenticación:**
- **50,000 usuarios activos por mes** 🎉
- Rate limiting: 500 requests/segundo

#### **Storage (Fotos):**
- **1 GB de almacenamiento** de archivos
- **2 GB de bandwidth** (transferencia)

#### **¿Cuánto aguanta?**

**Escenario Conservador (usuarios promedio):**
- **1 usuario** = ~10 mascotas × 2 fotos (200KB c/u) = ~4 MB
- **500 MB de BD** ÷ 4 MB = **~125 usuarios completos**

**Escenario Realista:**
- La mayoría de usuarios tendrá 1-3 mascotas
- **Puedes soportar fácilmente 200-500 usuarios activos**
- Con uso moderado, puedes llegar a **1,000+ usuarios**

**Límite de usuarios simultáneos:**
- **Rate limiting:** 500 requests/segundo
- Si cada usuario hace 10 requests/minuto = **3,000 usuarios concurrentes** teóricos
- En práctica: **500-1,000 usuarios concurrentes** sin problemas

### **⚠️ ¿CUÁNDO NECESITAS ACTUALIZAR?**

**Señales de que necesitas el plan Pro ($25/mes):**

1. **Almacenamiento de BD:**
   - Llegas a ~400 MB de datos
   - **Solución:** Optimizar datos antiguos o actualizar

2. **Bandwidth:**
   - Superas 2 GB/mes de transferencia
   - **Solución:** Optimizar imágenes o actualizar

3. **Storage de fotos:**
   - Superas 1 GB de fotos
   - **Solución:** Comprimir imágenes o actualizar

4. **Usuarios:**
   - Superas 50,000 usuarios activos/mes
   - **Solución:** Actualizar a Pro (incluye 400,000)

### **💰 PLAN PRO DE SUPABASE ($25/mes)**

Si llegas al límite del free tier, obtienes:
- ✅ **8 GB** de base de datos (16x más)
- ✅ **250 GB** de bandwidth (125x más)
- ✅ **100 GB** de storage (100x más)
- ✅ **400,000 usuarios activos/mes** (8x más)
- ✅ Soporte prioritario

### **🚀 VERCEL FREE TIER**

- ✅ **100 GB bandwidth/mes**
- ✅ **Sin límite de requests**
- ✅ **Builds ilimitados**
- ✅ **Deploy automático**
- ✅ **SSL gratis**

**Conclusión:** Puedes tener **miles de usuarios** en el plan gratuito combinado.

---

## 🎯 RECOMENDACIONES PARA MANTENER PERFORMANCE

### **1. Optimizar Imágenes:**
```typescript
// Ya implementado en next.config.ts ✅
// Next.js optimiza automáticamente a WebP/AVIF
```

### **2. Limitar tamaño de fotos:**
- Máximo 2-3 MB por foto
- Comprimir antes de subir

### **3. Implementar paginación** (si creces mucho):
```typescript
// Para el dashboard y listados
// Mostrar 10-20 mascotas por página
```

### **4. Cache de consultas:**
- Next.js ya usa cache automático
- Supabase tiene cache en su API

### **5. Monitorear uso:**
- Dashboard de Supabase → Settings → Usage
- Vercel → Analytics (en plan Pro)

---

## 📝 RESUMEN RÁPIDO

### **Para Publicar en LinkedIn:**

1. ✅ **Despliega en Vercel** (15 minutos)
2. ✅ **Configura variables de entorno**
3. ✅ **Actualiza URLs en Supabase**
4. ✅ **Prueba todo**
5. ✅ **Comparte el link:** `https://tu-app.vercel.app`

### **Capacidad Estimada:**
- **Free Tier:** 200-1,000 usuarios activos sin problemas
- **Si creces:** Plan Pro $25/mes soporta 10,000+ usuarios

---

## 🆘 SOPORTE

Si encuentras problemas durante el despliegue:
1. Revisa los logs en Vercel Dashboard
2. Verifica variables de entorno
3. Comprueba políticas RLS en Supabase
4. Revisa la consola del navegador

---

**¡Éxito con tu lanzamiento! 🚀🐾**

