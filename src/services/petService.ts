import { createClient } from '@/lib/supabase-client'
import { Pet, PetInsert, PetUpdate } from '@/types'

const supabase = createClient()

export const petService = {
  // Obtener todas las mascotas del usuario
  async getPets(userId: string): Promise<Pet[]> {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Obtener una mascota por ID
  async getPetById(id: string): Promise<Pet | null> {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Crear una nueva mascota
  async createPet(pet: PetInsert): Promise<Pet> {
    const { data, error } = await supabase
      .from('pets')
      .insert(pet)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Actualizar una mascota
  async updatePet(id: string, pet: PetUpdate): Promise<Pet> {
    const { data, error } = await supabase
      .from('pets')
      .update({ ...pet, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Eliminar una mascota
  async deletePet(id: string): Promise<void> {
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Subir foto de mascota
  async uploadPetPhoto(petId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${petId}.${fileExt}`
    const filePath = `pet-photos/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('pet-photos')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('pet-photos')
      .getPublicUrl(filePath)

    return data.publicUrl
  },

  // Eliminar foto de mascota
  async deletePetPhoto(petId: string): Promise<void> {
    const fileName = `pet-photos/${petId}.jpg`
    
    const { error } = await supabase.storage
      .from('pet-photos')
      .remove([fileName])

    if (error) throw error
  },
}

