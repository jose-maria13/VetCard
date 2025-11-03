'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { petService } from '@/services/petService'
import { vaccineService } from '@/services/vaccineService'
import { Pet } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Syringe, ArrowLeft, Heart, Calendar, AlertCircle } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const vaccineSchema = z.object({
  petId: z.string().min(1, 'Debes seleccionar una mascota'),
  vaccineName: z.string().min(1, 'El nombre de la vacuna es requerido'),
  vaccineType: z.string().min(1, 'El tipo de vacuna es requerido'),
  applicationDate: z.string().min(1, 'La fecha de aplicación es requerida'),
  nextDueDate: z.string().optional(),
  veterinarian: z.string().min(1, 'El nombre del veterinario es requerido'),
  notes: z.string().optional(),
})

type VaccineFormData = z.infer<typeof vaccineSchema>

export default function NewVaccinePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<VaccineFormData>({
    resolver: zodResolver(vaccineSchema),
  })

  const selectedPetId = watch('petId')

  useEffect(() => {
    if (user) {
      loadPets()
    }
  }, [user])

  const loadPets = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const petsData = await petService.getPets(user.id)
      setPets(petsData)
    } catch (error) {
      console.error('Error al cargar mascotas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: VaccineFormData) => {
    if (!user) return

    try {
      setIsSubmitting(true)
      const vaccineData = {
        pet_id: data.petId,
        vaccine_name: data.vaccineName,
        vaccine_type: data.vaccineType,
        date_applied: data.applicationDate,
        next_dose_date: data.nextDueDate || null,
        veterinarian: data.veterinarian,
        notes: data.notes || null,
      }
      
      console.log('Creating vaccine with data:', vaccineData)
      await vaccineService.createVaccine(vaccineData)
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Error al crear vacuna:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedPet = pets.find(pet => pet.id === selectedPetId)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Dashboard
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <Syringe className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-foreground">Nueva Vacuna</span>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Registrar Nueva Vacuna
              </h1>
              <p className="text-muted-foreground">
                Selecciona una mascota y completa la información de la vacuna
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando mascotas...</p>
              </div>
            ) : pets.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No tienes mascotas registradas
                </h3>
                <p className="text-muted-foreground mb-6">
                  Primero debes registrar una mascota para poder agregar vacunas.
                </p>
                <Button asChild>
                  <Link href="/pet/new">
                    Registrar Primera Mascota
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Pets List */}
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Selecciona una Mascota
                  </h2>
                  <div className="space-y-3">
                    {pets.map((pet) => (
                      <Card 
                        key={pet.id} 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedPetId === pet.id 
                            ? 'ring-2 ring-primary bg-primary/5' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setValue('petId', pet.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            {pet.photo_url ? (
                              <img 
                                src={pet.photo_url} 
                                alt={pet.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                                <Heart className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="font-medium text-foreground">{pet.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {pet.species} • {pet.breed || 'Sin raza especificada'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {pet.age} • {pet.weight}kg
                              </p>
                            </div>
                            {selectedPetId === pet.id && (
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Vaccine Form */}
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Información de la Vacuna
                  </h2>
                  
                  {selectedPet && (
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="text-lg">Mascota Seleccionada</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-3">
                          {selectedPet.photo_url ? (
                            <img 
                              src={selectedPet.photo_url} 
                              alt={selectedPet.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                              <Heart className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium text-foreground">{selectedPet.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {selectedPet.species} • {selectedPet.breed || 'Sin raza especificada'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="vaccineName">Nombre de la Vacuna *</Label>
                      <Input
                        id="vaccineName"
                        placeholder="Ej: Rabia, Parvovirus, Moquillo..."
                        {...register('vaccineName')}
                      />
                      {errors.vaccineName && (
                        <p className="text-sm text-destructive">{errors.vaccineName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vaccineType">Tipo de Vacuna *</Label>
                      <Select onValueChange={(value) => setValue('vaccineType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="obligatoria">Obligatoria</SelectItem>
                          <SelectItem value="opcional">Opcional</SelectItem>
                          <SelectItem value="refuerzo">Refuerzo</SelectItem>
                          <SelectItem value="anual">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.vaccineType && (
                        <p className="text-sm text-destructive">{errors.vaccineType.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="applicationDate">Fecha de Aplicación *</Label>
                        <Input
                          id="applicationDate"
                          type="date"
                          {...register('applicationDate')}
                        />
                        {errors.applicationDate && (
                          <p className="text-sm text-destructive">{errors.applicationDate.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nextDueDate">Próxima Fecha (Opcional)</Label>
                        <Input
                          id="nextDueDate"
                          type="date"
                          {...register('nextDueDate')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="veterinarian">Veterinario *</Label>
                      <Input
                        id="veterinarian"
                        placeholder="Nombre del veterinario"
                        {...register('veterinarian')}
                      />
                      {errors.veterinarian && (
                        <p className="text-sm text-destructive">{errors.veterinarian.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notas Adicionales</Label>
                      <Textarea
                        id="notes"
                        placeholder="Información adicional sobre la vacuna..."
                        {...register('notes')}
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button type="submit" disabled={isSubmitting} className="flex-1">
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Syringe className="h-4 w-4 mr-2" />
                            Registrar Vacuna
                          </>
                        )}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => router.push('/dashboard')}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
