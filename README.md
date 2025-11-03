# 🐾 VetCard - Carnet de Vacunación Digital para Mascotas

![VetCard Logo](public/logo%20vet%20card.png)

**VetCard** es una aplicación web moderna y completa para gestionar el carnet de vacunación digital de tus mascotas. Nunca más pierdas el control de la salud de tu mejor amigo.

## ✨ Características Principales

- 🐕 **Gestión Completa de Mascotas**: Registra todas tus mascotas con información detallada
- 💉 **Control de Vacunas**: Registra vacunas, próximas dosis y recordatorios automáticos
- 🛡️ **Desparasitaciones**: Lleva el control de tratamientos antiparasitarios
- 🏥 **Consultas Médicas**: Registra diagnósticos, tratamientos y costos
- 📄 **Exportación a PDF**: Genera y descarga el carnet completo en PDF
- 📱 **Responsive Design**: Funciona perfectamente en móvil, tablet y desktop
- 🌙 **Modo Oscuro**: Interfaz con tema claro y oscuro
- 🔒 **Seguro y Privado**: Datos encriptados con Supabase
- 🚀 **Rápido y Moderno**: Construido con Next.js 15 y React 19

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Estilos**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Animaciones**: Framer Motion
- **Validación**: Zod + React Hook Form
- **PDF**: jsPDF + jsPDF-autotable
- **Deploy**: Vercel

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ instalado
- Cuenta en Supabase (gratuita)
- Git instalado

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/vetcard.git
   cd vetcard/vetcard
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env.local
   ```
   
   Edita `.env.local` y agrega tus credenciales de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```

4. **Configurar la base de datos**
   - Ve a tu proyecto en Supabase Dashboard
   - Ejecuta las migraciones SQL desde `supabase/migrations/`
   - Orden: `001_initial_schema.sql`, luego `009_add_public_carousel_policy.sql`

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

6. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📁 Estructura del Proyecto

```
vetcard/
├── src/
│   ├── app/              # Rutas Next.js (App Router)
│   │   ├── auth/         # Autenticación
│   │   ├── dashboard/    # Panel principal
│   │   ├── pet/          # Gestión de mascotas
│   │   ├── vaccine/      # Vacunas
│   │   ├── deworming/    # Desparasitaciones
│   │   └── consultation/ # Consultas médicas
│   ├── components/       # Componentes React
│   ├── contexts/         # Context API (Auth, Theme)
│   ├── services/         # Servicios de datos (Supabase)
│   ├── types/            # TypeScript types
│   ├── lib/              # Utilidades
│   └── constants/        # Constantes
├── supabase/
│   └── migrations/       # Migraciones SQL
└── public/               # Assets estáticos
```

## 🗄️ Base de Datos

El proyecto utiliza **Supabase** (PostgreSQL) con las siguientes tablas:

- `pets` - Información de mascotas
- `vaccines` - Registro de vacunas
- `dewormings` - Desparasitaciones
- `medical_consultations` - Consultas médicas

Todas las tablas tienen **Row Level Security (RLS)** habilitado para proteger los datos de los usuarios.

## 🚀 Despliegue

### Desplegar en Vercel (Recomendado)

1. **Preparar el repositorio**
   ```bash
   git add .
   git commit -m "Preparación para despliegue"
   git push origin main
   ```

2. **Conectar con Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio de GitHub
   - Configura las variables de entorno:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Deploy automático**
   - Vercel detectará Next.js automáticamente
   - El deploy se completará en 2-5 minutos
   - Obtendrás una URL como: `vetcard.vercel.app`

**📋 Para instrucciones detalladas, consulta [DEPLOY_PLAN.md](./DEPLOY_PLAN.md)**

### Configurar Supabase para Producción

1. **Actualizar URLs de redirección**
   - Supabase Dashboard → Authentication → URL Configuration
   - Agregar: `https://tu-app.vercel.app/**`

2. **Verificar Storage Bucket**
   - Asegúrate de que `pet-photos` sea público

## 🧪 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo con Turbopack

# Producción
npm run build        # Build de producción
npm run start        # Servidor de producción

# Utilidades
npm run lint         # Ejecutar ESLint
npm run check-deploy # Verificar preparación para deploy
```

## 📸 Capturas de Pantalla

_(Agrega capturas de pantalla de tu aplicación aquí)_

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Siéntete libre de:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**Jose Maria Atonur**

- LinkedIn: [linkedin.com/in/jose-maria-atonur-94949324b](https://www.linkedin.com/in/jose-maria-atonur-94949324b/)
- GitHub: [@tu-usuario](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework React
- [Supabase](https://supabase.com/) - Backend y Base de Datos
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Vercel](https://vercel.com/) - Hosting

## 📚 Documentación Adicional

### 🚀 Para Desplegar:
- [📦 Guía: Subir a GitHub](./GITHUB_SETUP.md) - Paso a paso para subir el proyecto a GitHub
- [🚀 Guía: Desplegar en Vercel](./VERCEL_DEPLOY.md) - Paso a paso para desplegar en producción
- [📋 Plan de Despliegue Completo](./DEPLOY_PLAN.md) - Guía técnica detallada

### 🔧 Configuración:
- [🗄️ Configuración de Base de Datos](./DATABASE_SETUP.md) - Setup de Supabase
- [🔐 Configuración de Variables de Entorno](./ENV_SETUP.md) - Setup de variables

### 📱 Para Compartir:
- [💼 Template: Publicación en LinkedIn](./LINKEDIN_POST.md) - Mensajes listos para publicar

---

**Hecho con ❤️ para cuidar mejor a nuestras mascotas 🐾**
