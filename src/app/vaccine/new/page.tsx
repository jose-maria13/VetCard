'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { vaccineService } from '@/services/vaccineService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Syringe, Heart } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Sidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { usePets } from '@/hooks/usePets'
import { getSpeciesName } from '@/lib/pet-utils'

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
  const { pets, isLoading, error } = usePets()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
      <div className="min-h-screen bg-gray-50 dark:bg-[#050a1f] flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col lg:ml-[270px] transition-all duration-300">
          <DashboardHeader setSidebarOpen={setSidebarOpen} />

          <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Registrar Nueva Vacuna
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Selecciona una mascota y completa la información de la vacuna
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
              </div>
            ) : pets.length === 0 ? (
              <Card className="bg-white dark:bg-[#081028] border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Heart className="h-16 w-16 text-slate-400 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    No tienes mascotas registradas
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">
                    Primero debes registrar una mascota para poder agregar vacunas.
                  </p>
                  <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                    <Link href="/pet/new">Registrar Primera Mascota</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-4 gap-8">
                {/* Pets List */}
                <div className="lg:col-span-1">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Selecciona una Mascota
                  </h2>
                  <div className="space-y-3">
                    {pets.map((pet) => (
                      <Card
                        key={pet.id}
                        className={`cursor-pointer transition-all bg-white dark:bg-[#081028] hover:shadow-md ${selectedPetId === pet.id
                          ? 'ring-2 ring-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                          : ''
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
                              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                <Heart className="h-6 w-6 text-slate-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="font-medium text-slate-900 dark:text-white">{pet.name}</h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {getSpeciesName(pet.species)} • {pet.breed || 'Sin raza'}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {pet.weight ? `${pet.weight}kg` : 'Peso no especificado'}
                              </p>
                            </div>
                            {selectedPetId === pet.id && (
                              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
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
                <div className="lg:col-span-3">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Información de la Vacuna
                  </h2>

                  {selectedPet && (
                    <Card className="mb-6 bg-white dark:bg-[#081028]">
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
                            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                              <Heart className="h-8 w-8 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium text-slate-900 dark:text-white">{selectedPet.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {getSpeciesName(selectedPet.species)} • {selectedPet.breed || 'Sin raza'}
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
                        <p className="text-sm text-red-600">{errors.vaccineName.message}</p>
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
                        <p className="text-sm text-red-600">{errors.vaccineType.message}</p>
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
                          <p className="text-sm text-red-600">{errors.applicationDate.message}</p>
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
                        <p className="text-sm text-red-600">{errors.veterinarian.message}</p>
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
                      <Button type="submit" disabled={isSubmitting} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
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
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
