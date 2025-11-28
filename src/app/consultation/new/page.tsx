'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { consultationService } from '@/services/consultationService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Stethoscope, Heart } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Sidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { usePets } from '@/hooks/usePets'
import { getSpeciesName } from '@/lib/pet-utils'

const consultationSchema = z.object({
  petId: z.string().min(1, 'Debes seleccionar una mascota'),
  consultationType: z.string().min(1, 'El tipo de consulta es requerido'),
  reason: z.string().min(1, 'El motivo de la consulta es requerido'),
  consultationDate: z.string().min(1, 'La fecha de la consulta es requerida'),
  veterinarian: z.string().min(1, 'El nombre del veterinario es requerido'),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
  nextAppointment: z.string().optional(),
})

type ConsultationFormData = z.infer<typeof consultationSchema>

export default function NewConsultationPage() {
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
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
  })

  const selectedPetId = watch('petId')

  const onSubmit = async (data: ConsultationFormData) => {
    if (!user) return

    try {
      setIsSubmitting(true)
      const consultationData = {
        pet_id: data.petId,
        consultation_type: data.consultationType,
        date: data.consultationDate,
        reason: data.reason,
        diagnosis: data.diagnosis || null,
        treatment: data.treatment || null,
        veterinarian: data.veterinarian,
        notes: data.notes || null,
        next_appointment: data.nextAppointment || null,
      }

      await consultationService.createConsultation(consultationData)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error al crear consulta:', error)
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
                Registrar Nueva Consulta Médica
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Selecciona una mascota y completa la información de la consulta
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
                    Primero debes registrar una mascota para poder agregar consultas médicas.
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
                                {pet.species} • {pet.weight}kg
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

                {/* Consultation Form */}
                <div className="lg:col-span-3">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Información de la Consulta
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
                      <Label htmlFor="consultationType">Tipo de Consulta *</Label>
                      <Select onValueChange={(value) => setValue('consultationType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rutina">Consulta de Rutina</SelectItem>
                          <SelectItem value="urgencia">Urgencia</SelectItem>
                          <SelectItem value="seguimiento">Seguimiento</SelectItem>
                          <SelectItem value="cirugia">Cirugía</SelectItem>
                          <SelectItem value="revision">Revisión Post-Operatoria</SelectItem>
                          <SelectItem value="vacunacion">Vacunación</SelectItem>
                          <SelectItem value="desparasitacion">Desparasitación</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.consultationType && (
                        <p className="text-sm text-red-600">{errors.consultationType.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">Motivo de la Consulta *</Label>
                      <Input
                        id="reason"
                        placeholder="Ej: Revisión general, síntomas específicos..."
                        {...register('reason')}
                      />
                      {errors.reason && (
                        <p className="text-sm text-red-600">{errors.reason.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="consultationDate">Fecha de la Consulta *</Label>
                      <Input
                        id="consultationDate"
                        type="date"
                        {...register('consultationDate')}
                      />
                      {errors.consultationDate && (
                        <p className="text-sm text-red-600">{errors.consultationDate.message}</p>
                      )}
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
                      <Label htmlFor="diagnosis">Diagnóstico</Label>
                      <Textarea
                        id="diagnosis"
                        placeholder="Diagnóstico realizado por el veterinario..."
                        {...register('diagnosis')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="treatment">Tratamiento</Label>
                      <Textarea
                        id="treatment"
                        placeholder="Tratamiento prescrito..."
                        {...register('treatment')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nextAppointment">Próxima Cita (Opcional)</Label>
                      <Input
                        id="nextAppointment"
                        type="date"
                        {...register('nextAppointment')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notas Adicionales</Label>
                      <Textarea
                        id="notes"
                        placeholder="Información adicional sobre la consulta..."
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
                            <Stethoscope className="h-4 w-4 mr-2" />
                            Registrar Consulta
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
