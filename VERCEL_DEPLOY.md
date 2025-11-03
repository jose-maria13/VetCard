# 🚀 Guía: Desplegar VetCard en Vercel

Guía paso a paso para desplegar tu aplicación VetCard en Vercel y hacerla accesible para todos.

## 📋 Prerrequisitos

- ✅ Proyecto subido a GitHub (ver [GITHUB_SETUP.md](./GITHUB_SETUP.md))
- ✅ Cuenta en Vercel (gratuita)
- ✅ Credenciales de Supabase listas

## 🎯 Paso 1: Crear Cuenta en Vercel

1. **Ve a [vercel.com](https://vercel.com)**
2. **Click en "Sign Up"**
3. **Selecciona "Continue with GitHub"** (recomendado)
   - Esto conecta automáticamente tu cuenta de GitHub
   - Facilita los deploys automáticos
4. **Autoriza Vercel** para acceder a tus repositorios

## 🎯 Paso 2: Importar Proyecto

1. **En el dashboard de Vercel, click en "Add New..." → "Project"**
2. **Importa tu repositorio:**
   - Busca `vetcard` (o el nombre de tu repo)
   - Click en "Import"

## 🎯 Paso 3: Configurar el Proyecto

### Configuración General:

- **Framework Preset:** Next.js (se detecta automáticamente) ✅
- **Root Directory:** 
  - Si tu proyecto está en `/vetcard/vetcard` → Coloca: `vetcard`
  - Si está en la raíz → Deja vacío (`.`)
- **Build Command:** `npm run build` (default) ✅
- **Output Directory:** `.next` (default) ✅
- **Install Command:** `npm install` (default) ✅

### Variables de Entorno:

**IMPORTANTE:** Aquí es donde agregas tus credenciales de Supabase:

1. **Click en "Environment Variables"**
2. **Agrega estas dos variables:**

   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://tu-proyecto-id.supabase.co
   ```
   
   ```
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: tu-anon-key-aqui
   ```

3. **Selecciona todos los ambientes:**
   - ☑️ Production
   - ☑️ Preview
   - ☑️ Development

4. **Click en "Add" para cada variable**

**⚠️ IMPORTANTE:**
- **NO** pongas espacios extras
- **NO** pongas comillas alrededor de los valores
- Copia **exactamente** desde tu `.env.local`

### ¿Dónde encontrar tus credenciales de Supabase?

1. Ve a [supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings → API**
4. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🎯 Paso 4: Deploy

1. **Click en "Deploy"**
2. **Espera 2-5 minutos** mientras Vercel:
   - Instala dependencias
   - Compila el proyecto
   - Despliega en producción
3. **¡Listo!** Obtendrás una URL como: `vetcard-xxxxx.vercel.app`

## 🎯 Paso 5: Configurar Supabase para Producción

**MUY IMPORTANTE:** Necesitas actualizar las URLs en Supabase para que la autenticación funcione.

### Actualizar URLs de Redirección:

1. **Ve a Supabase Dashboard → Authentication → URL Configuration**
2. **En "Redirect URLs", agrega:**
   ```
   https://tu-app.vercel.app/**
   https://tu-app.vercel.app/auth/callback
   ```
3. **En "Site URL", cambia a:**
   ```
   https://tu-app.vercel.app
   ```
4. **Click en "Save"**

### Verificar Storage Bucket:

1. **Supabase Dashboard → Storage → Buckets**
2. **Verifica que `pet-photos` existe y está:**
   - ✅ **Public:** Activado
   - ✅ **File size limit:** 5MB (o el que prefieras)

## ✅ Paso 6: Verificar que Todo Funciona

### Checklist de Pruebas:

1. **Abrir la URL de Vercel** en el navegador
2. **Probar registro de usuario:**
   - Crear cuenta nueva
   - Verificar que funcione el registro
3. **Probar funcionalidades:**
   - ✅ Crear mascota
   - ✅ Subir foto
   - ✅ Agregar vacuna
   - ✅ Agregar desparasitación
   - ✅ Agregar consulta
   - ✅ Generar PDF
   - ✅ Ver carrusel en homepage
4. **Probar en móvil:**
   - Abrir en tu celular
   - Verificar que sea responsive

## 🎯 Paso 7: Dominio Personalizado (Opcional)

Si quieres usar tu propio dominio (ej: `vetcard.com`):

1. **Vercel Dashboard → Settings → Domains**
2. **Agrega tu dominio**
3. **Sigue las instrucciones** para configurar DNS
4. **Espera 24-48 horas** para que se propague

## 🔄 Deploy Automático

**¡La mejor parte!** Cada vez que hagas `git push` a GitHub:

1. **Vercel detecta el cambio automáticamente**
2. **Hace un nuevo build**
3. **Despliega la nueva versión**
4. **Te notifica por email** cuando esté listo

**Para cambios menores:**
```bash
git add .
git commit -m "Descripción del cambio"
git push
```

¡Y automáticamente se desplegará en Vercel!

## 📊 Monitorear Deploys

En el dashboard de Vercel puedes:

- **Ver todos los deploys** (historial completo)
- **Ver logs** de cada build
- **Rollback** a una versión anterior si algo falla
- **Ver analytics** (en plan Pro)

## 🐛 Solucionar Problemas

### Error: "Build Failed"

1. **Revisa los logs** en Vercel Dashboard
2. **Verifica variables de entorno:**
   - ¿Están bien escritas?
   - ¿Tienen los valores correctos?
3. **Prueba localmente:**
   ```bash
   npm run build
   ```
   Si falla localmente, también fallará en Vercel

### Error: "Environment variables missing"

1. **Ve a Settings → Environment Variables**
2. **Verifica que estén agregadas** para Production
3. **Re-haz el deploy**

### Error: "Authentication failed"

1. **Verifica URLs en Supabase:**
   - ¿Agregaste la URL de Vercel en Redirect URLs?
   - ¿Actualizaste el Site URL?
2. **Espera unos minutos** después de cambiar configuraciones

### La aplicación no carga

1. **Verifica que el build fue exitoso**
2. **Revisa la consola del navegador** (F12)
3. **Verifica variables de entorno** en Vercel

## 📱 Compartir tu App

Una vez desplegada, puedes compartir:

- **URL de producción:** `https://tu-app.vercel.app`
- **QR Code:** Vercel genera uno automáticamente
- **Link directo:** Cópialo y compártelo donde quieras

## 🎉 ¡Felicitaciones!

Tu aplicación VetCard ya está en producción y accesible para todos.

**Próximos pasos:**
- ✅ Compartir en LinkedIn
- ✅ Agregar a tu portfolio
- ✅ Invitar a amigos a probarla
- ✅ Recibir feedback y mejorar

---

**¿Necesitas ayuda?** Revisa la [documentación de Vercel](https://vercel.com/docs) o los logs en el dashboard.

