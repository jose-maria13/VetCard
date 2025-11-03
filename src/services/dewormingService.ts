import { createClient } from '@/lib/supabase-client'
import { Deworming, DewormingInsert, DewormingUpdate } from '@/types'

const supabase = createClient()

export const dewormingService = {
  // Obtener todas las desparasitaciones de una mascota
  async getDewormingsByPetId(petId: string): Promise<Deworming[]> {
    const { data, error } = await supabase
      .from('dewormings')
      .select('*')
      .eq('pet_id', petId)
      .order('date_applied', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Alias para compatibilidad
  async getDewormingsByPet(petId: string): Promise<Deworming[]> {
    return this.getDewormingsByPetId(petId)
  },

  // Obtener una desparasitación por ID
  async getDewormingById(id: string): Promise<Deworming | null> {
    const { data, error } = await supabase
      .from('dewormings')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Crear una nueva desparasitación
  async createDeworming(deworming: DewormingInsert): Promise<Deworming> {
    console.log('Attempting to create deworming with data:', deworming)
    
    const { data, error } = await supabase
      .from('dewormings')
      .insert(deworming)
      .select()
      .single()

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw new Error(`Error creating deworming: ${error.message} (Code: ${error.code})`)
    }
    
    console.log('Deworming created successfully:', data)
    return data
  },

  // Actualizar una desparasitación
  async updateDeworming(id: string, deworming: DewormingUpdate): Promise<Deworming> {
    const { data, error } = await supabase
      .from('dewormings')
      .update(deworming)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Eliminar una desparasitación
  async deleteDeworming(id: string): Promise<void> {
    const { error } = await supabase
      .from('dewormings')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Obtener desparasitaciones próximas a vencer
  async getUpcomingDewormings(userId: string, days: number = 30): Promise<Deworming[]> {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)

    const { data, error } = await supabase
      .from('dewormings')
      .select(`
        *,
        pets!inner(user_id)
      `)
      .eq('pets.user_id', userId)
      .not('next_date', 'is', null)
      .lte('next_date', futureDate.toISOString().split('T')[0])
      .order('next_date', { ascending: true })

    if (error) throw error
    return data || []
  },
}
