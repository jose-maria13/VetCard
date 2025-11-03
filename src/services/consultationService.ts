import { createClient } from '@/lib/supabase-client'
import { MedicalConsultation, MedicalConsultationInsert, MedicalConsultationUpdate } from '@/types'

const supabase = createClient()

export const consultationService = {
  // Obtener todas las consultas de una mascota
  async getConsultationsByPetId(petId: string): Promise<MedicalConsultation[]> {
    const { data, error } = await supabase
      .from('medical_consultations')
      .select('*')
      .eq('pet_id', petId)
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Alias para compatibilidad
  async getConsultationsByPet(petId: string): Promise<MedicalConsultation[]> {
    return this.getConsultationsByPetId(petId)
  },

  // Obtener una consulta por ID
  async getConsultationById(id: string): Promise<MedicalConsultation | null> {
    const { data, error } = await supabase
      .from('medical_consultations')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Crear una nueva consulta
  async createConsultation(consultation: MedicalConsultationInsert): Promise<MedicalConsultation> {
    console.log('Attempting to create consultation with data:', consultation)
    
    const { data, error } = await supabase
      .from('medical_consultations')
      .insert(consultation)
      .select()
      .single()

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw new Error(`Error creating consultation: ${error.message} (Code: ${error.code})`)
    }
    
    console.log('Consultation created successfully:', data)
    return data
  },

  // Actualizar una consulta
  async updateConsultation(id: string, consultation: MedicalConsultationUpdate): Promise<MedicalConsultation> {
    const { data, error } = await supabase
      .from('medical_consultations')
      .update(consultation)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Eliminar una consulta
  async deleteConsultation(id: string): Promise<void> {
    const { error } = await supabase
      .from('medical_consultations')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}