import { Database } from './database'

// Tipos de las tablas
export type Pet = Database['public']['Tables']['pets']['Row']
export type PetInsert = Database['public']['Tables']['pets']['Insert']
export type PetUpdate = Database['public']['Tables']['pets']['Update']

export type Vaccine = Database['public']['Tables']['vaccines']['Row']
export type VaccineInsert = Database['public']['Tables']['vaccines']['Insert']
export type VaccineUpdate = Database['public']['Tables']['vaccines']['Update']

export type Deworming = Database['public']['Tables']['dewormings']['Row']
export type DewormingInsert = Database['public']['Tables']['dewormings']['Insert']
export type DewormingUpdate = Database['public']['Tables']['dewormings']['Update']

export type MedicalConsultation = Database['public']['Tables']['medical_consultations']['Row']
export type MedicalConsultationInsert = Database['public']['Tables']['medical_consultations']['Insert']
export type MedicalConsultationUpdate = Database['public']['Tables']['medical_consultations']['Update']


// Tipos para formularios
export interface PetFormData {
  name: string
  species: string
  breed?: string
  birth_date?: string
  weight?: string
  color?: string
  microchip_number?: string
  photo?: File
  photo_url?: string
}

export interface VaccineFormData {
  vaccine_name: string
  date_applied: string
  next_dose_date?: string
  veterinarian?: string
  notes?: string
}

export interface DewormingFormData {
  product_name: string
  date_applied: string
  next_date?: string
  notes?: string
}

export interface MedicalConsultationFormData {
  date: string
  reason: string
  diagnosis?: string
  treatment?: string
  veterinarian?: string
  cost?: number
  notes?: string
}


// Tipos para el contexto de autenticación
export interface User {
  id: string
  email: string
  created_at: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}
