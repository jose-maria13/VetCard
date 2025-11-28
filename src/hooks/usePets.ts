import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { petService } from '@/services/petService'
import { Pet } from '@/types'

export function usePets() {
    const { user } = useAuth()
    const [pets, setPets] = useState<Pet[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadPets = useCallback(async () => {
        if (!user) return

        try {
            setIsLoading(true)
            setError(null)
            const petsData = await petService.getPets(user.id)
            setPets(petsData)
        } catch (err: any) {
            console.error('Error al cargar mascotas:', err)
            setError(err.message || 'Error al cargar las mascotas')
        } finally {
            setIsLoading(false)
        }
    }, [user])

    useEffect(() => {
        if (user) {
            loadPets()
        } else {
            setPets([])
            setIsLoading(false)
        }
    }, [user, loadPets])

    return { pets, isLoading, error, reload: loadPets }
}
