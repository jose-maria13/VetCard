# 📦 Guía: Subir VetCard a GitHub

Esta guía te ayudará a subir tu proyecto VetCard a GitHub paso a paso.

## 📋 Prerrequisitos

- ✅ Git instalado en tu computadora
- ✅ Cuenta en GitHub creada
- ✅ Proyecto VetCard funcionando localmente

## 🚀 Pasos para Subir a GitHub

### Paso 1: Verificar que Git está inicializado

Abre la terminal en la carpeta del proyecto (`vetcard/`) y verifica:

```bash
git status
```

**Si ves un error como "not a git repository":**
```bash
git init
```

**Si ya está inicializado, verás los archivos sin commit.**

### Paso 2: Verificar .gitignore

Asegúrate de que `.gitignore` esté configurado correctamente. No queremos subir:

- ❌ `.env.local` (archivo con tus credenciales)
- ❌ `node_modules/`
- ❌ `.next/`
- ❌ Archivos temporales

El `.gitignore` ya está configurado, pero verifica que no haya archivos sensibles:

```bash
# Ver archivos que se van a subir
git status
```

### Paso 3: Crear repositorio en GitHub

1. **Ve a [github.com](https://github.com)** e inicia sesión
2. **Click en el botón "+"** (arriba a la derecha) → **"New repository"**
3. **Configura el repositorio:**
   - **Repository name:** `vetcard` (o el nombre que prefieras)
   - **Description:** "Carnet de Vacunación Digital para Mascotas - VetCard"
   - **Visibility:** 
     - 🟢 **Public** (recomendado para portfolio)
     - 🔵 **Private** (si quieres mantenerlo privado)
   - ❌ **NO marques** "Add a README file" (ya lo tenemos)
   - ❌ **NO marques** "Add .gitignore" (ya lo tenemos)
   - ❌ **NO marques** "Choose a license" (opcional, puedes agregarlo después)
4. **Click en "Create repository"**

### Paso 4: Agregar todos los archivos

```bash
# Agregar todos los archivos al staging area
git add .
```

### Paso 5: Hacer el primer commit

```bash
# Crear commit inicial
git commit -m "Initial commit: VetCard - Carnet de vacunación digital para mascotas"
```

**Nota:** Si es la primera vez que usas Git, puede que necesites configurar tu nombre y email:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

### Paso 6: Conectar con GitHub

GitHub te mostrará comandos, pero aquí están los correctos:

```bash
# Agregar el repositorio remoto (reemplaza TU-USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU-USUARIO/vetcard.git

# Verificar que se agregó correctamente
git remote -v
```

### Paso 7: Cambiar nombre de rama a "main" (si es necesario)

```bash
# Si tu rama se llama "master", cámbiala a "main"
git branch -M main
```

### Paso 8: Subir el código a GitHub

```bash
# Subir el código (primera vez)
git push -u origin main
```

**Si te pide autenticación:**
- Puede pedirte usuario y contraseña
- O usar un **Personal Access Token** (recomendado)
  - Ve a: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  - Genera un nuevo token con permisos `repo`
  - Usa ese token como contraseña

### Paso 9: Verificar en GitHub

1. Ve a tu repositorio en GitHub
2. Deberías ver todos tus archivos
3. El README.md debería aparecer como descripción del proyecto

## ✅ Verificación Final

### Checklist:

- [ ] ✅ Repositorio creado en GitHub
- [ ] ✅ Todos los archivos subidos (excepto .env.local)
- [ ] ✅ README.md visible en GitHub
- [ ] ✅ No hay archivos sensibles subidos (.env.local)
- [ ] ✅ El repositorio es accesible públicamente (si elegiste Public)

## 🔒 Seguridad - Verificar que NO se subieron archivos sensibles

**IMPORTANTE:** Verifica que NO hayas subido `.env.local`:

```bash
# Ver archivos en GitHub (desde la web)
# O verificar localmente qué se subió:
git ls-files | grep .env
```

Si ves `.env.local` en la lista, **NO LO SUBAS**. Elimínalo:

```bash
# Si ya lo subiste (NO DEBERÍA PASAR), elimínalo:
git rm --cached .env.local
git commit -m "Remove .env.local from repository"
git push
```

## 📝 Próximos Pasos

Una vez que tu código esté en GitHub:

1. ✅ **Actualiza el README.md** con el link correcto a tu repositorio
2. ✅ **Agrega una descripción** en la página del repositorio
3. ✅ **Agrega temas (topics)** al repositorio:
   - `nextjs`
   - `typescript`
   - `supabase`
   - `react`
   - `vetcard`
   - `mascotas`

## 🆘 Problemas Comunes

### Error: "remote origin already exists"

```bash
# Eliminar el origin existente
git remote remove origin

# Agregar el nuevo
git remote add origin https://github.com/TU-USUARIO/vetcard.git
```

### Error: "failed to push"

```bash
# Si hay conflictos, primero hacer pull:
git pull origin main --allow-unrelated-histories

# Luego push:
git push -u origin main
```

### Error: "authentication failed"

1. Usa **Personal Access Token** en lugar de contraseña
2. O configura SSH: [Guía de GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

## 🎉 ¡Listo!

Tu proyecto ya está en GitHub. Ahora puedes:

1. **Compartir el link** con otros
2. **Continuar con el deploy en Vercel** (ver [DEPLOY_PLAN.md](./DEPLOY_PLAN.md))
3. **Agregar colaboradores** si lo necesitas
4. **Hacer commits** para futuros cambios:
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push
   ```

---

**¿Necesitas ayuda?** Revisa la [documentación oficial de Git](https://git-scm.com/doc) o la [guía de GitHub](https://guides.github.com/)

