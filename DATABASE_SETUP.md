# Configuración de la Base de Datos - VetCard

## Pasos para configurar la base de datos en Supabase

### 1. Acceder a Supabase Dashboard
1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto VetCard

### 2. Ejecutar el Script SQL

**⚠️ IMPORTANTE: Tienes 3 opciones dependiendo de tu situación:**

#### **Opción A: Base de datos completamente nueva** (Recomendado para empezar desde cero)
1. En el panel izquierdo, haz clic en **SQL Editor**
2. Haz clic en **New Query**
3. Copia y pega todo el contenido del archivo `supabase/migrations/001_initial_schema.sql`
4. Haz clic en **Run** para ejecutar el script

#### **Opción B: Base de datos existente - Limpiar y recrear** (Elimina TODOS los datos existentes)
1. En el panel izquierdo, haz clic en **SQL Editor**
2. Haz clic en **New Query**
3. Copia y pega todo el contenido del archivo `supabase/migrations/002_clean_and_recreate.sql`
4. Haz clic en **Run** para ejecutar el script
5. **⚠️ ADVERTENCIA: Esto eliminará todos los datos existentes**

#### **Opción C: Base de datos existente - Agregar campos faltantes** (Conserva los datos existentes)
1. En el panel izquierdo, haz clic en **SQL Editor**
2. Haz clic en **New Query**
3. Copia y pega todo el contenido del archivo `supabase/migrations/003_add_missing_fields.sql`
4. Haz clic en **Run** para ejecutar el script
5. **✅ SEGURO: Conserva todos los datos existentes y solo agrega lo que falta**

### 3. Solución Rápida para Error PGRST204 (RECOMENDADO)
Si estás viendo el error "Could not find the 'consultation_type' column", ejecuta este script:

1. En **SQL Editor** → **New Query**
2. Copia y pega todo el contenido de `supabase/migrations/007_fix_all_missing_columns.sql`
3. Haz clic en **Run**
4. **Este script**:
   - ✅ Agrega todas las columnas faltantes
   - ✅ Crea las tablas si no existen
   - ✅ Configura las políticas RLS correctamente
   - ✅ Es completamente seguro (no elimina datos)

### 4. Verificar la Configuración (OPCIONAL)
Después de ejecutar el script anterior, puedes verificar que todo esté correcto:

1. En **SQL Editor** → **New Query**
2. Copia y pega todo el contenido de `supabase/migrations/004_verify_tables.sql`
3. Haz clic en **Run**
4. **Revisa los resultados** para asegurarte de que:
   - ✅ Todas las tablas existen
   - ✅ Todas las columnas están presentes
   - ✅ Las políticas RLS están configuradas
   - ✅ RLS está habilitado en todas las tablas

### 4. Probar la Funcionalidad (OPCIONAL)
Si quieres probar que todo funciona correctamente:

1. En **SQL Editor** → **New Query**
2. Copia y pega todo el contenido de `supabase/migrations/005_test_insert.sql`
3. Haz clic en **Run**
4. **Verifica** que se creen los datos de prueba sin errores

### 5. Verificar las Tablas Creadas
Después de ejecutar el script, deberías ver estas tablas en la sección **Table Editor**:

- ✅ **pets** - Información de las mascotas
- ✅ **vaccines** - Registro de vacunas
- ✅ **dewormings** - Registro de desparasitaciones  
- ✅ **medical_consultations** - Consultas médicas

### 4. Verificar las Políticas RLS
En la sección **Authentication > Policies**, deberías ver políticas para cada tabla que permiten a los usuarios:
- Ver solo sus propias mascotas y registros médicos
- Crear, editar y eliminar solo sus propios datos

### 5. Verificar el Bucket de Almacenamiento
En la sección **Storage**, deberías ver:
- ✅ **pet-photos** - Bucket para fotos de mascotas

## Estructura de las Tablas

### Tabla `pets`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `name` (TEXT)
- `species` (TEXT)
- `breed` (TEXT, nullable)
- `birth_date` (DATE, nullable)
- `weight` (DECIMAL, nullable)
- `color` (TEXT, nullable)
- `photo_url` (TEXT, nullable)
- `microchip_number` (TEXT, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabla `vaccines`
- `id` (UUID, Primary Key)
- `pet_id` (UUID, Foreign Key)
- `vaccine_name` (TEXT)
- `vaccine_type` (TEXT) - obligatoria, opcional, refuerzo, anual
- `date_applied` (DATE)
- `next_dose_date` (DATE, nullable)
- `veterinarian` (TEXT, nullable)
- `notes` (TEXT, nullable)
- `created_at` (TIMESTAMP)

### Tabla `dewormings`
- `id` (UUID, Primary Key)
- `pet_id` (UUID, Foreign Key)
- `product_name` (TEXT)
- `product_type` (TEXT) - interno, externo, combinado, pulguicida, garrapaticida
- `date_applied` (DATE)
- `next_date` (DATE, nullable)
- `veterinarian` (TEXT, nullable)
- `notes` (TEXT, nullable)
- `created_at` (TIMESTAMP)

### Tabla `medical_consultations`
- `id` (UUID, Primary Key)
- `pet_id` (UUID, Foreign Key)
- `consultation_type` (TEXT) - rutina, urgencia, seguimiento, cirugia, etc.
- `date` (DATE)
- `reason` (TEXT)
- `diagnosis` (TEXT, nullable)
- `treatment` (TEXT, nullable)
- `veterinarian` (TEXT, nullable)
- `cost` (DECIMAL, nullable)
- `notes` (TEXT, nullable)
- `next_appointment` (DATE, nullable)
- `created_at` (TIMESTAMP)


## Solución de Problemas

### Error: "relation does not exist"
- Asegúrate de que ejecutaste el script SQL completo
- Verifica que estés en el proyecto correcto de Supabase

### Error: "permission denied"
- Verifica que las políticas RLS estén configuradas correctamente
- Asegúrate de que el usuario esté autenticado

### Error: "column does not exist"
- Verifica que la estructura de la tabla coincida con el script
- Ejecuta el script nuevamente si es necesario

## Notas Importantes

- Las políticas RLS están configuradas para que cada usuario solo pueda ver y modificar sus propios datos
- El bucket de almacenamiento está configurado para fotos de mascotas
- Todos los campos de fecha usan el tipo DATE para mejor compatibilidad
- Los campos nullable permiten datos opcionales en los formularios
