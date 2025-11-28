import { useState, useEffect, useCallback } from 'react'
import { vaccineService } from '@/services/vaccineService'
import { dewormingService } from '@/services/dewormingService'
import { consultationService } from '@/services/consultationService'
import { Vaccine, Deworming, MedicalConsultation } from '@/types'

export function useMedicalRecords(petId: string | undefined) {
    const [vaccines, setVaccines] = useState<Vaccine[]>([])
    const [dewormings, setDewormings] = useState<Deworming[]>([])
    const [consultations, setConsultations] = useState<MedicalConsultation[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadRecords = useCallback(async () => {
        if (!petId) return

        try {
            setIsLoading(true)
            setError(null)
            const [vaccinesData, dewormingsData, consultationsData] = await Promise.all([
                vaccineService.getVaccinesByPetId(petId),
                dewormingService.getDewormingsByPetId(petId),
                consultationService.getConsultationsByPetId(petId)
            ])

            setVaccines(vaccinesData)
            setDewormings(dewormingsData)
            setConsultations(consultationsData)
        } catch (err: any) {
            console.error('Error al cargar historial médico:', err)
            setError(err.message || 'Error al cargar el historial médico')
        } finally {
            setIsLoading(false)
        }
    }, [petId])

    useEffect(() => {
        if (petId) {
            loadRecords()
        } else {
            setIsLoading(false)
        }
    }, [petId, loadRecords])

    return {
        vaccines,
        dewormings,
        consultations,
        isLoading,
        error,
        reload: loadRecords
    }
}
