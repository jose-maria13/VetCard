'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import PetForm from '@/components/forms/PetForm'
import { petService } from '@/services/petService'
import { PetFormData } from '@/types'
import Sidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export default function NewPetPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const handleSubmit = async (data: PetFormData & { photo?: File }) => {
    if (!user) return

    try {
      setIsLoading(true)

      const petData = {
        user_id: user.id,
        name: data.name,
        species: data.species,
        breed: data.breed || null,
        birth_date: data.birth_date || null,
        weight: data.weight ? Number(data.weight) : null,
        color: data.color || null,
        microchip_number: null,
      }

      const newPet = await petService.createPet(petData)

      if (data.photo) {
        try {
          const photoUrl = await petService.uploadPetPhoto(newPet.id, data.photo)
          await petService.updatePet(newPet.id, { photo_url: photoUrl })
        } catch (error) {
          console.error('Error al subir la foto:', error)
        }
      }

      router.push('/dashboard')
    } catch (error: any) {
      throw new Error(error.message || 'Error al crear la mascota')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard')
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
                Nueva Mascota
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Completa la información de tu mascota
              </p>
            </div>

            <PetForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
