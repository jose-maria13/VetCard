import { useState, useEffect, useCallback } from 'react'
import { petService } from '@/services/petService'
import { Pet } from '@/types'

export function usePet(petId: string | undefined) {
    const [pet, setPet] = useState<Pet | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadPet = useCallback(async () => {
        if (!petId) return

        try {
            setIsLoading(true)
            setError(null)
            const petData = await petService.getPetById(petId)

            if (!petData) {
                setError('Mascota no encontrada')
                setPet(null)
            } else {
                setPet(petData)
            }
        } catch (err: any) {
            console.error('Error al cargar mascota:', err)
            setError(err.message || 'Error al cargar la mascota')
        } finally {
            setIsLoading(false)
        }
    }, [petId])

    useEffect(() => {
        if (petId) {
            loadPet()
        } else {
            setIsLoading(false)
        }
    }, [petId, loadPet])

    return { pet, isLoading, error, reload: loadPet }
}
