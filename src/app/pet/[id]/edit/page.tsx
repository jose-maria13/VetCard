'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import PetForm from '@/components/forms/PetForm'
import { petService } from '@/services/petService'
import { PetFormData, Pet } from '@/types'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

export default function EditPetPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [pet, setPet] = useState<Pet | null>(null)
  const [isLoadingPet, setIsLoadingPet] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const petId = params.id as string

  useEffect(() => {
    if (petId) {
      loadPet()
    }
  }, [petId])

  const loadPet = async () => {
    try {
      setIsLoadingPet(true)
      setError('')
      const petData = await petService.getPetById(petId)
      
      if (!petData) {
        setError('Mascota no encontrada')
        return
      }
      
      setPet(petData)
    } catch (err: any) {
      setError(err.message || 'Error al cargar la mascota')
    } finally {
      setIsLoadingPet(false)
    }
  }

  const handleSubmit = async (data: PetFormData & { photo?: File }) => {
    if (!user || !pet) return

    try {
      setIsLoading(true)
      
      // Actualizar la mascota
      const updateData = {
        name: data.name,
        species: data.species,
        breed: data.breed || null,
        birth_date: data.birth_date || null,
        weight: data.weight ? Number(data.weight) : null,
        color: data.color || null,
        // microchip_number se mantiene como está en la base de datos
      }

      await petService.updatePet(pet.id, updateData)

      // Subir nueva foto si existe
      if (data.photo) {
        try {
          const photoUrl = await petService.uploadPetPhoto(pet.id, data.photo)
          await petService.updatePet(pet.id, { photo_url: photoUrl })
        } catch (error) {
          console.error('Error al subir la foto:', error)
          // No fallar si la foto no se puede subir
        }
      }

      // Redirigir a la página de detalle de la mascota
      router.push(`/pet/${pet.id}`)
    } catch (error: any) {
      throw new Error(error.message || 'Error al actualizar la mascota')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push(`/pet/${petId}`)
  }

  if (isLoadingPet) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando información de la mascota...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !pet) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {error || 'Mascota no encontrada'}
              </h2>
              <Button asChild>
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
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/pet/${pet.id}`}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a {pet.name}
                  </Link>
                </Button>
                <div className="h-6 w-px bg-border" />
                <h1 className="text-2xl font-bold text-foreground">Editar {pet.name}</h1>
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
    </ProtectedRoute>
  )
}
