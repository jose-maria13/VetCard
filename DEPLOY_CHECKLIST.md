# ✅ Checklist: Desplegar VetCard

Checklist completo para llevar tu proyecto desde local hasta producción y compartirlo en LinkedIn.

## 📋 Pre-Despliegue

### Verificar Código
- [ ] El proyecto funciona localmente (`npm run dev`)
- [ ] El build de producción funciona (`npm run build`)
- [ ] No hay errores en la consola
- [ ] Todas las funcionalidades principales funcionan:
  - [ ] Registro de usuario
  - [ ] Inicio de sesión
  - [ ] Crear mascota
  - [ ] Subir foto
  - [ ] Agregar vacuna
  - [ ] Agregar desparasitación
  - [ ] Agregar consulta
  - [ ] Generar PDF
  - [ ] Ver carrusel en homepage

### Verificar Archivos Sensibles
- [ ] `.env.local` está en `.gitignore`
- [ ] No hay credenciales hardcodeadas en el código
- [ ] `env.example` existe y está actualizado

### Preparar Documentación
- [ ] README.md actualizado
- [ ] Comentarios en código (si es necesario)

---

## 🐙 GitHub

### Crear Repositorio
- [ ] Cuenta de GitHub creada
- [ ] Repositorio creado en GitHub
- [ ] Repositorio configurado (nombre, descripción, temas)

### Subir Código
- [ ] Git inicializado (`git init`)
- [ ] Archivos agregados (`git add .`)
- [ ] Primer commit hecho (`git commit`)
- [ ] Repositorio remoto configurado (`git remote add origin`)
- [ ] Código subido a GitHub (`git push`)

### Verificar GitHub
- [ ] Todos los archivos visibles en GitHub
- [ ] README.md se muestra correctamente
- [ ] NO hay archivos sensibles (`.env.local`)
- [ ] Temas/tags agregados al repositorio

**📖 Guía completa:** [GITHUB_SETUP.md](./GITHUB_SETUP.md)

---

## 🚀 Vercel

### Configurar Vercel
- [ ] Cuenta de Vercel creada
- [ ] Conectado con GitHub
- [ ] Proyecto importado desde GitHub
- [ ] Root Directory configurado correctamente

### Variables de Entorno
- [ ] `NEXT_PUBLIC_SUPABASE_URL` agregada
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` agregada
- [ ] Variables configuradas para Production, Preview y Development
- [ ] Valores verificados (copiados correctamente)

### Deploy
- [ ] Deploy iniciado
- [ ] Build completado exitosamente
- [ ] URL de producción obtenida

**📖 Guía completa:** [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)

---

## 🔐 Supabase

### Actualizar URLs
- [ ] Redirect URLs actualizadas en Supabase
  - URL de Vercel agregada: `https://tu-app.vercel.app/**`
- [ ] Site URL actualizada: `https://tu-app.vercel.app`
- [ ] Configuración guardada

### Verificar Storage
- [ ] Bucket `pet-photos` existe
- [ ] Bucket está marcado como público
- [ ] Límite de tamaño configurado

### Verificar Políticas RLS
- [ ] Políticas RLS activas y funcionando
- [ ] Política pública para carrusel activa

---

## ✅ Post-Despliegue

### Pruebas en Producción
- [ ] Aplicación carga correctamente
- [ ] Registro de usuario funciona
- [ ] Inicio de sesión funciona
- [ ] Crear mascota funciona
- [ ] Subir foto funciona
- [ ] Agregar vacuna funciona
- [ ] Agregar desparasitación funciona
- [ ] Agregar consulta funciona
- [ ] Generar PDF funciona
- [ ] Carrusel en homepage funciona
- [ ] Modo oscuro funciona
- [ ] Responsive en móvil funciona

### Pruebas en Diferentes Dispositivos
- [ ] Desktop (Chrome, Firefox, Edge)
- [ ] Tablet (iPad, Android)
- [ ] Móvil (iOS, Android)

### Performance
- [ ] Páginas cargan rápido
- [ ] Imágenes se optimizan correctamente
- [ ] No hay errores en consola
- [ ] No hay warnings importantes

---

## 📱 LinkedIn

### Preparar Publicación
- [ ] Template elegido de [LINKEDIN_POST.md](./LINKEDIN_POST.md)
- [ ] URL de Vercel agregada
- [ ] URL de GitHub agregada (si es público)
- [ ] Hashtags seleccionados
- [ ] Imagen preparada (screenshot o mockup)

### Publicar
- [ ] Post escrito y revisado
- [ ] Imagen agregada
- [ ] Publicado en LinkedIn
- [ ] Compartido en grupos relevantes (opcional)

### Seguimiento
- [ ] Respondiendo a comentarios
- [ ] Interactuando con reacciones
- [ ] Compartiendo en otros canales (opcional)

**📖 Templates completos:** [LINKEDIN_POST.md](./LINKEDIN_POST.md)

---

## 🎉 ¡Listo!

Una vez completado este checklist:

- ✅ Tu aplicación está en producción
- ✅ Accesible para todos los usuarios
- ✅ Compartida en LinkedIn
- ✅ Lista para recibir feedback

---

## 📊 Resumen de URLs

Después del despliegue, deberías tener:

- **GitHub:** `https://github.com/TU-USUARIO/vetcard`
- **Vercel:** `https://tu-app.vercel.app`
- **Supabase Dashboard:** `https://supabase.com/dashboard/project/TU-PROYECTO`
- **Post LinkedIn:** [Tu publicación]

---

## 🆘 Si Algo Falla

1. **Revisa los logs** en Vercel Dashboard
2. **Verifica variables de entorno** en Vercel
3. **Comprueba URLs** en Supabase
4. **Revisa la consola del navegador** (F12)
5. **Consulta las guías detalladas:**
   - [GITHUB_SETUP.md](./GITHUB_SETUP.md)
   - [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)
   - [DEPLOY_PLAN.md](./DEPLOY_PLAN.md)

---

**¡Éxito con tu lanzamiento! 🚀🐾**

