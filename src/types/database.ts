export interface Database {
  public: {
    Tables: {
      pets: {
        Row: {
          id: string
          user_id: string
          name: string
          species: string
          breed: string | null
          birth_date: string | null
          weight: number | null
          color: string | null
          photo_url: string | null
          microchip_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          species?: string
          breed?: string | null
          birth_date?: string | null
          weight?: number | null
          color?: string | null
          photo_url?: string | null
          microchip_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          species?: string
          breed?: string | null
          birth_date?: string | null
          weight?: number | null
          color?: string | null
          photo_url?: string | null
          microchip_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vaccines: {
        Row: {
          id: string
          pet_id: string
          vaccine_name: string
          vaccine_type: string
          date_applied: string
          next_dose_date: string | null
          veterinarian: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          pet_id: string
          vaccine_name: string
          vaccine_type?: string
          date_applied: string
          next_dose_date?: string | null
          veterinarian?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          pet_id?: string
          vaccine_name?: string
          vaccine_type?: string
          date_applied?: string
          next_dose_date?: string | null
          veterinarian?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      dewormings: {
        Row: {
          id: string
          pet_id: string
          product_name: string
          product_type: string
          date_applied: string
          next_date: string | null
          veterinarian: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          pet_id: string
          product_name: string
          product_type?: string
          date_applied: string
          next_date?: string | null
          veterinarian?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          pet_id?: string
          product_name?: string
          product_type?: string
          date_applied?: string
          next_date?: string | null
          veterinarian?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      medical_consultations: {
        Row: {
          id: string
          pet_id: string
          consultation_type: string
          date: string
          reason: string
          diagnosis: string | null
          treatment: string | null
          veterinarian: string | null
          cost: number | null
          notes: string | null
          next_appointment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          pet_id: string
          consultation_type?: string
          date: string
          reason: string
          diagnosis?: string | null
          treatment?: string | null
          veterinarian?: string | null
          cost?: number | null
          notes?: string | null
          next_appointment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          pet_id?: string
          consultation_type?: string
          date?: string
          reason?: string
          diagnosis?: string | null
          treatment?: string | null
          veterinarian?: string | null
          cost?: number | null
          notes?: string | null
          next_appointment?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
