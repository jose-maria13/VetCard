'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import PetForm from '@/components/forms/PetForm'
import { petService } from '@/services/petService'
import { PetFormData } from '@/types'
import { AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Sidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { usePet } from '@/hooks/usePet'

export default function EditPetPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const petId = params.id as string

  const { pet, isLoading: isLoadingPet, error } = usePet(petId)

  const handleSubmit = async (data: PetFormData & { photo?: File }) => {
    if (!user || !pet) return

    try {
      setIsSubmitting(true)

      const updateData = {
        name: data.name,
        species: data.species,
        breed: data.breed || null,
        birth_date: data.birth_date || null,
        weight: data.weight ? Number(data.weight) : null,
        color: data.color || null,
      }

      await petService.updatePet(pet.id, updateData)

      if (data.photo) {
        try {
          const photoUrl = await petService.uploadPetPhoto(pet.id, data.photo)
          await petService.updatePet(pet.id, { photo_url: photoUrl })
        } catch (error) {
          console.error('Error al subir la foto:', error)
        }
      }

      router.push(`/pet/${pet.id}`)
    } catch (error: any) {
      throw new Error(error.message || 'Error al actualizar la mascota')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/pet/${petId}`)
  }

  if (isLoadingPet) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-[#050a1f] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400">Cargando información de la mascota...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !pet) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-[#050a1f] flex items-center justify-center">
          <Card className="w-full max-w-md bg-white dark:bg-[#081028]">
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {error || 'Mascota no encontrada'}
              </h2>
              <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                <Link href="/dashboard">Volver al Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-[#050a1f] flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col lg:ml-[270px] transition-all duration-300">
          <DashboardHeader setSidebarOpen={setSidebarOpen} />

          <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Editar {pet.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Actualiza la información de tu mascota
              </p>
            </div>

            <PetForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isSubmitting}
              initialData={{
                name: pet.name,
                species: pet.species,
                breed: pet.breed || '',
                birth_date: pet.birth_date || '',
                weight: pet.weight || '',
                color: pet.color || '',
                photo_url: pet.photo_url || '',
              }}
              isEdit={true}
            />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
