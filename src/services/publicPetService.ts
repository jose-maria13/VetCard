import { createClient } from '@/lib/supabase-client'

export interface PublicPet {
  id: string
  name: string
  species: string
  photo_url: string | null
  created_at: string
}

export const publicPetService = {
  // Obtener mascotas públicas para el carrusel
  async getPublicPets(limit: number = 10): Promise<PublicPet[]> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('pets')
        .select('id, name, species, photo_url, created_at')
        .not('photo_url', 'is', null) // Solo mascotas con foto
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching public pets:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getPublicPets:', error)
      return []
    }
  },

  // Obtener mascotas aleatorias para el carrusel
  async getRandomPets(limit: number = 8): Promise<PublicPet[]> {
    try {
      console.log('🔍 publicPetService: Iniciando consulta a Supabase...')
      const supabase = createClient()
      
      // Verificar autenticación
      const { data: { user } } = await supabase.auth.getUser()
      console.log('👤 publicPetService: Usuario autenticado:', user ? 'SÍ' : 'NO')
      
      let query = supabase
        .from('pets')
        .select('id, name, species, photo_url, created_at')
        .limit(100)
      
      // Si el usuario está autenticado, obtener sus mascotas
      if (user) {
        console.log('🔐 publicPetService: Usuario autenticado, obteniendo sus mascotas')
        query = query.eq('user_id', user.id)
      } else {
        console.log('🌐 publicPetService: Usuario no autenticado, intentando acceso público')
      }
      
      const { data, error } = await query

      console.log('📊 publicPetService: Respuesta de Supabase:', { data, error })
      console.log('📊 publicPetService: Data completo:', data)
      console.log('📊 publicPetService: Error completo:', error)

      if (error) {
        console.error('❌ publicPetService: Error fetching random pets:', error)
        console.error('❌ publicPetService: Error details:', JSON.stringify(error, null, 2))
        return []
      }

      if (!data || data.length === 0) {
        console.log('⚠️ publicPetService: No pets found')
        return []
      }

      console.log(`✅ publicPetService: Encontradas ${data.length} mascotas`)
      
      // Hacer shuffle manualmente y tomar solo el límite solicitado
      const shuffled = data.sort(() => Math.random() - 0.5)
      const result = shuffled.slice(0, limit)
      
      console.log(`🎯 publicPetService: Retornando ${result.length} mascotas:`, result.map(p => `${p.name} (${p.species})`))
      
      return result
    } catch (error) {
      console.error('❌ publicPetService: Error in getRandomPets:', error)
      console.error('❌ publicPetService: Error details:', JSON.stringify(error, null, 2))
      return []
    }
  }
}
