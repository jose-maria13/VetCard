// Especies de mascotas
export const PET_SPECIES = [
  { value: 'dog', label: 'Perro' },
  { value: 'cat', label: 'Gato' },
  { value: 'bird', label: 'Ave' },
  { value: 'rabbit', label: 'Conejo' },
  { value: 'hamster', label: 'Hámster' },
  { value: 'other', label: 'Otro' },
] as const

// Razas de perros más comunes
export const DOG_BREEDS = [
  'Labrador Retriever',
  'Golden Retriever',
  'Pastor Alemán',
  'Bulldog Francés',
  'Beagle',
  'Poodle',
  'Rottweiler',
  'Yorkshire Terrier',
  'Siberian Husky',
  'Dachshund',
  'Boxer',
  'Chihuahua',
  'Shih Tzu',
  'Border Collie',
  'Maltés',
  'Otra',
] as const

// Razas de gatos más comunes
export const CAT_BREEDS = [
  'Persa',
  'Maine Coon',
  'Siamés',
  'Ragdoll',
  'British Shorthair',
  'Scottish Fold',
  'Abisinio',
  'Bengalí',
  'Sphynx',
  'Munchkin',
  'Otra',
] as const

// Tipos de vacunas comunes
export const COMMON_VACCINES = [
  'Rabia',
  'Moquillo',
  'Parvovirus',
  'Adenovirus',
  'Parainfluenza',
  'Bordetella',
  'Leptospirosis',
  'Lyme',
  'Giardia',
  'Otra',
] as const

// Tipos de desparasitación
export const DEWORMING_TYPES = [
  'Interna',
  'Externa',
  'Combinada',
] as const

// Tipos de tratamientos
export const TREATMENT_TYPES = [
  'Cirugía',
  'Medicamento',
  'Terapia',
  'Revisión',
  'Vacunación',
  'Desparasitación',
  'Otro',
] as const

// Colores comunes para mascotas
export const PET_COLORS = [
  'Negro',
  'Blanco',
  'Marrón',
  'Gris',
  'Dorado',
  'Atigrado',
  'Bicolor',
  'Tricolor',
  'Otro',
] as const

// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'VetCard',
  description: 'Carnet de Vacunación Digital para Mascotas',
  version: '1.0.0',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  reminderDays: 30, // Días antes de vencer para mostrar recordatorios
} as const

// Rutas de la aplicación
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  PET: '/pet',
  PET_DETAIL: (id: string) => `/pet/${id}`,
  PET_EDIT: (id: string) => `/pet/${id}/edit`,
} as const

// Mensajes de validación
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Este campo es obligatorio',
  EMAIL_INVALID: 'El email no es válido',
  PASSWORD_MIN: 'La contraseña debe tener al menos 6 caracteres',
  PASSWORD_MATCH: 'Las contraseñas no coinciden',
  DATE_INVALID: 'La fecha no es válida',
  FILE_TOO_LARGE: 'El archivo es demasiado grande',
  FILE_TYPE_INVALID: 'Tipo de archivo no válido',
} as const

