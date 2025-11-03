import { createClient } from '@/lib/supabase-client'
import { Vaccine, VaccineInsert, VaccineUpdate } from '@/types'

const supabase = createClient()

export const vaccineService = {
  // Obtener todas las vacunas de una mascota
  async getVaccinesByPetId(petId: string): Promise<Vaccine[]> {
    const { data, error } = await supabase
      .from('vaccines')
      .select('*')
      .eq('pet_id', petId)
      .order('date_applied', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Alias para compatibilidad
  async getVaccinesByPet(petId: string): Promise<Vaccine[]> {
    return this.getVaccinesByPetId(petId)
  },

  // Obtener una vacuna por ID
  async getVaccineById(id: string): Promise<Vaccine | null> {
    const { data, error } = await supabase
      .from('vaccines')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Crear una nueva vacuna
  async createVaccine(vaccine: VaccineInsert): Promise<Vaccine> {
    console.log('Attempting to create vaccine with data:', vaccine)
    
    const { data, error } = await supabase
      .from('vaccines')
      .insert(vaccine)
      .select()
      .single()

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw new Error(`Error creating vaccine: ${error.message} (Code: ${error.code})`)
    }
    
    console.log('Vaccine created successfully:', data)
    return data
  },

  // Actualizar una vacuna
  async updateVaccine(id: string, vaccine: VaccineUpdate): Promise<Vaccine> {
    const { data, error } = await supabase
      .from('vaccines')
      .update(vaccine)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Eliminar una vacuna
  async deleteVaccine(id: string): Promise<void> {
    const { error } = await supabase
      .from('vaccines')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Obtener vacunas próximas a vencer
  async getUpcomingVaccines(userId: string, days: number = 30): Promise<Vaccine[]> {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)

    const { data, error } = await supabase
      .from('vaccines')
      .select(`
        *,
        pets!inner(user_id)
      `)
      .eq('pets.user_id', userId)
      .not('next_dose_date', 'is', null)
      .lte('next_dose_date', futureDate.toISOString().split('T')[0])
      .order('next_dose_date', { ascending: true })

    if (error) throw error
    return data || []
  },
}
