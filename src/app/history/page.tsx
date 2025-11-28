'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { petService } from '@/services/petService'
import { vaccineService } from '@/services/vaccineService'
import { dewormingService } from '@/services/dewormingService'
import { consultationService } from '@/services/consultationService'
import { Pet, Vaccine, Deworming, MedicalConsultation } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heart, Syringe, Shield, Stethoscope, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Sidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HistoryPage() {
  const { user } = useAuth()
  const [pets, setPets] = useState<Pet[]>([])
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [vaccines, setVaccines] = useState<Vaccine[]>([])
  const [dewormings, setDewormings] = useState<Deworming[]>([])
  const [consultations, setConsultations] = useState<MedicalConsultation[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
      if (petsData.length > 0) {
        setSelectedPet(petsData[0])
        await loadPetHistory(petsData[0].id)
      }
    } catch (error) {
      console.error('Error al cargar mascotas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadPetHistory = async (petId: string) => {
    if (!user) return

    try {
      setIsLoadingHistory(true)
      const [vaccinesData, dewormingsData, consultationsData] = await Promise.all([
        vaccineService.getVaccinesByPet(petId),
        dewormingService.getDewormingsByPet(petId),
        consultationService.getConsultationsByPet(petId)
      ])

      setVaccines(vaccinesData)
      setDewormings(dewormingsData)
      setConsultations(consultationsData)
    } catch (error) {
      console.error('Error al cargar historial:', error)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const handlePetSelect = async (pet: Pet) => {
    setSelectedPet(pet)
    await loadPetHistory(pet.id)
  }

  const getVaccineTypeColor = (type: string) => {
    switch (type) {
      case 'obligatoria': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'opcional': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'refuerzo': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'anual': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getConsultationTypeColor = (type: string) => {
    switch (type) {
      case 'urgencia': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'rutina': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'cirugia': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'seguimiento': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Fecha no especificada'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Fecha inválida'
      return format(date, 'dd/MM/yyyy', { locale: es })
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Fecha inválida'
    }
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
                Historial Médico Completo
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Revisa el historial médico completo de tus mascotas
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
                    Primero debes registrar una mascota para poder ver su historial médico.
                  </p>
                  <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                    <Link href="/pet/new">Registrar Primera Mascota</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Pets List */}
                <div className="lg:col-span-1">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Selecciona una Mascota
                  </h2>
                  <div className="space-y-3">
                    {pets.map((pet) => (
                      <Card
                        key={pet.id}
                        className={`cursor-pointer transition-all bg-white dark:bg-[#081028] hover:shadow-md ${selectedPet?.id === pet.id
                            ? 'ring-2 ring-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                            : ''
                          }`}
                        onClick={() => handlePetSelect(pet)}
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
                                {pet.species} • {pet.breed || 'Sin raza'}
                              </p>
                            </div>
                            {selectedPet?.id === pet.id && (
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

                {/* History Content */}
                <div className="lg:col-span-3">
                  {selectedPet ? (
                    <div>
                      <Card className="mb-6 bg-white dark:bg-[#081028]">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center space-x-3">
                            {selectedPet.photo_url ? (
                              <img
                                src={selectedPet.photo_url}
                                alt={selectedPet.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                <Heart className="h-6 w-6 text-slate-400" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium text-slate-900 dark:text-white">{selectedPet.name}</h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {selectedPet.species} • {selectedPet.breed || 'Sin raza'}
                              </p>
                            </div>
                          </CardTitle>
                        </CardHeader>
                      </Card>

                      <Tabs defaultValue="vaccines" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-[#081028]">
                          <TabsTrigger value="vaccines" className="flex items-center space-x-2">
                            <Syringe className="h-4 w-4" />
                            <span className="hidden sm:inline">Vacunas</span>
                          </TabsTrigger>
                          <TabsTrigger value="dewormings" className="flex items-center space-x-2">
                            <Shield className="h-4 w-4" />
                            <span className="hidden sm:inline">Desparasitaciones</span>
                          </TabsTrigger>
                          <TabsTrigger value="consultations" className="flex items-center space-x-2">
                            <Stethoscope className="h-4 w-4" />
                            <span className="hidden sm:inline">Consultas</span>
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="vaccines" className="mt-6">
                          <Card className="bg-white dark:bg-[#081028]">
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <Syringe className="h-5 w-5" />
                                <span>Vacunas</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {isLoadingHistory ? (
                                <div className="text-center py-8">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                                  <p className="text-slate-500 dark:text-slate-400">Cargando vacunas...</p>
                                </div>
                              ) : vaccines.length === 0 ? (
                                <div className="text-center py-8">
                                  <Syringe className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                  <p className="text-slate-500 dark:text-slate-400">No hay vacunas registradas</p>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  {vaccines.map((vaccine) => (
                                    <div key={vaccine.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-slate-900 dark:text-white">{vaccine.vaccine_name}</h4>
                                        <Badge className={getVaccineTypeColor(vaccine.vaccine_type)}>
                                          {vaccine.vaccine_type}
                                        </Badge>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center space-x-2">
                                          <Calendar className="h-4 w-4" />
                                          <span>Aplicada: {formatDate(vaccine.date_applied)}</span>
                                        </div>
                                        {vaccine.next_dose_date && (
                                          <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>Próxima: {formatDate(vaccine.next_dose_date)}</span>
                                          </div>
                                        )}
                                        <div className="flex items-center space-x-2">
                                          <User className="h-4 w-4" />
                                          <span>{vaccine.veterinarian}</span>
                                        </div>
                                      </div>
                                      {vaccine.notes && (
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{vaccine.notes}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="dewormings" className="mt-6">
                          <Card className="bg-white dark:bg-[#081028]">
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <Shield className="h-5 w-5" />
                                <span>Desparasitaciones</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {isLoadingHistory ? (
                                <div className="text-center py-8">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                                  <p className="text-slate-500 dark:text-slate-400">Cargando desparasitaciones...</p>
                                </div>
                              ) : dewormings.length === 0 ? (
                                <div className="text-center py-8">
                                  <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                  <p className="text-slate-500 dark:text-slate-400">No hay desparasitaciones registradas</p>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  {dewormings.map((deworming) => (
                                    <div key={deworming.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-slate-900 dark:text-white">{deworming.product_name}</h4>
                                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                          {deworming.product_type}
                                        </Badge>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center space-x-2">
                                          <Calendar className="h-4 w-4" />
                                          <span>Aplicada: {formatDate(deworming.date_applied)}</span>
                                        </div>
                                        {deworming.next_date && (
                                          <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>Próxima: {formatDate(deworming.next_date)}</span>
                                          </div>
                                        )}
                                        <div className="flex items-center space-x-2">
                                          <User className="h-4 w-4" />
                                          <span>{deworming.veterinarian}</span>
                                        </div>
                                      </div>
                                      {deworming.notes && (
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{deworming.notes}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="consultations" className="mt-6">
                          <Card className="bg-white dark:bg-[#081028]">
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <Stethoscope className="h-5 w-5" />
                                <span>Consultas Médicas</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {isLoadingHistory ? (
                                <div className="text-center py-8">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                                  <p className="text-slate-500 dark:text-slate-400">Cargando consultas...</p>
                                </div>
                              ) : consultations.length === 0 ? (
                                <div className="text-center py-8">
                                  <Stethoscope className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                  <p className="text-slate-500 dark:text-slate-400">No hay consultas registradas</p>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  {consultations.map((consultation) => (
                                    <div key={consultation.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-slate-900 dark:text-white">{consultation.reason}</h4>
                                        <Badge className={getConsultationTypeColor(consultation.consultation_type)}>
                                          {consultation.consultation_type}
                                        </Badge>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
                                        <div className="flex items-center space-x-2">
                                          <Calendar className="h-4 w-4" />
                                          <span>{formatDate(consultation.date)}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <User className="h-4 w-4" />
                                          <span>{consultation.veterinarian}</span>
                                        </div>
                                      </div>
                                      {consultation.diagnosis && (
                                        <div className="mb-2">
                                          <p className="text-sm font-medium text-slate-900 dark:text-white">Diagnóstico:</p>
                                          <p className="text-sm text-slate-500 dark:text-slate-400">{consultation.diagnosis}</p>
                                        </div>
                                      )}
                                      {consultation.treatment && (
                                        <div className="mb-2">
                                          <p className="text-sm font-medium text-slate-900 dark:text-white">Tratamiento:</p>
                                          <p className="text-sm text-slate-500 dark:text-slate-400">{consultation.treatment}</p>
                                        </div>
                                      )}
                                      {consultation.notes && (
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{consultation.notes}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500 dark:text-slate-400">Selecciona una mascota para ver su historial</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
