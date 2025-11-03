'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import PetForm from '@/components/forms/PetForm'
import { petService } from '@/services/petService'
import { PetFormData } from '@/types'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewPetPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const handleSubmit = async (data: PetFormData & { photo?: File }) => {
    if (!user) return

    try {
      setIsLoading(true)
      
      // Crear la mascota
      const petData = {
        user_id: user.id,
        name: data.name,
        species: data.species,
        breed: data.breed || null,
        birth_date: data.birth_date || null,
        weight: data.weight ? Number(data.weight) : null,
        color: data.color || null,
        microchip_number: null, // Campo removido del formulario
      }

      const newPet = await petService.createPet(petData)

      // Subir foto si existe
      if (data.photo) {
        try {
          const photoUrl = await petService.uploadPetPhoto(newPet.id, data.photo)
          await petService.updatePet(newPet.id, { photo_url: photoUrl })
        } catch (error) {
          console.error('Error al subir la foto:', error)
          // No fallar si la foto no se puede subir
        }
      }

      // Redirigir al dashboard
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
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver al Dashboard
                  </Link>
                </Button>
                <div className="h-6 w-px bg-border" />
                <h1 className="text-2xl font-bold text-foreground">Nueva Mascota</h1>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <PetForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </main>
      </div>
    </ProtectedRoute>
  )
}
