# 🔐 Configuración de Variables de Entorno

## ⚠️ Problema: "Missing Supabase environment variables"

Este error ocurre porque faltan las variables de entorno de Supabase. Sigue estos pasos para solucionarlo:

---

## 📝 PASO 1: Obtener credenciales de Supabase

1. **Ve a tu Dashboard de Supabase:**
   - https://supabase.com/dashboard
   - Selecciona tu proyecto

2. **Ve a Settings → API:**
   - Encontrarás dos valores importantes:

### **NEXT_PUBLIC_SUPABASE_URL**
- Se encuentra en: **Project URL**
- Formato: `https://xxxxxxxxxxxxx.supabase.co`
- ⚠️ Copia exactamente, incluyendo el `https://`

### **NEXT_PUBLIC_SUPABASE_ANON_KEY**
- Se encuentra en: **Project API keys → anon public**
- Es una cadena larga que comienza con `eyJ...`
- ⚠️ Copia la clave completa

---

## 📝 PASO 2: Crear archivo `.env.local`

1. **En la raíz de tu proyecto** (`vetcard/`), crea un archivo llamado `.env.local`

2. **Agrega el siguiente contenido** (reemplaza con tus valores reales):

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-completo-aqui
```

### **Ejemplo:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://irukhaxtflhvhewuzzfq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydWtoYXh0Zmxodmhld3V6emZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0MjY4NzAsImV4cCI6MjA0NDAwMjg3MH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📝 PASO 3: Reiniciar el servidor

⚠️ **IMPORTANTE:** Después de crear o modificar `.env.local`, debes:

1. **Detener el servidor** (Ctrl+C)
2. **Eliminar la carpeta `.next`** (caché de Next.js):
   ```bash
   rm -rf .next
   # O en Windows PowerShell:
   Remove-Item -Recurse -Force .next
   ```
3. **Reiniciar el servidor:**
   ```bash
   npm run dev
   ```

---

## ✅ VERIFICACIÓN

Si configuraste todo correctamente:

1. ✅ El error "Missing Supabase environment variables" desaparecerá
2. ✅ La aplicación debería cargar normalmente
3. ✅ Podrás hacer login/registro

---

## 🔒 Seguridad

- ✅ El archivo `.env.local` está en `.gitignore` (no se subirá a Git)
- ✅ Las variables `NEXT_PUBLIC_*` son públicas (se exponen al cliente)
- ⚠️ **NO** compartas tu archivo `.env.local` públicamente
- ⚠️ Para producción (Vercel), configura las variables en el dashboard de Vercel

---

## 🆘 Problemas Comunes

### **Error persiste después de crear `.env.local`**
- ✅ Asegúrate de reiniciar el servidor
- ✅ Elimina la carpeta `.next`
- ✅ Verifica que el archivo esté en `vetcard/.env.local` (no en otra carpeta)
- ✅ Verifica que no haya espacios extra en las variables

### **"URL: MISSING" pero Key: OK**
- ✅ Verifica que la URL comience con `https://`
- ✅ No debe tener espacios ni saltos de línea

### **"Key: MISSING" pero URL: OK**
- ✅ Copia la clave completa (puede ser muy larga)
- ✅ Verifica que no haya espacios ni saltos de línea

---

## 📚 Más Información

- [Documentación de Next.js sobre variables de entorno](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Documentación de Supabase](https://supabase.com/docs)

