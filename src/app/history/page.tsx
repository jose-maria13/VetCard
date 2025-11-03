'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { petService } from '@/services/petService'
import { vaccineService } from '@/services/vaccineService'
import { dewormingService } from '@/services/dewormingService'
import { consultationService } from '@/services/consultationService'
import { Pet, Vaccine, Deworming, MedicalConsultation } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, ArrowLeft, Heart, Syringe, Shield, Stethoscope, Calendar, User } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function HistoryPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [pets, setPets] = useState<Pet[]>([])
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [vaccines, setVaccines] = useState<Vaccine[]>([])
  const [dewormings, setDewormings] = useState<Deworming[]>([])
  const [consultations, setConsultations] = useState<MedicalConsultation[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

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
                <FileText className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-foreground">Historial Médico</span>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Historial Médico Completo
              </h1>
              <p className="text-muted-foreground">
                Revisa el historial médico completo de tus mascotas
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
                  Primero debes registrar una mascota para poder ver su historial médico.
                </p>
                <Button asChild>
                  <Link href="/pet/new">
                    Registrar Primera Mascota
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-4 gap-8">
                {/* Pets List */}
                <div className="lg:col-span-1">
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Selecciona una Mascota
                  </h2>
                  <div className="space-y-3">
                    {pets.map((pet) => (
                      <Card 
                        key={pet.id} 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedPet?.id === pet.id 
                            ? 'ring-2 ring-primary bg-primary/5' 
                            : 'hover:bg-muted/50'
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
                              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                                <Heart className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="font-medium text-foreground">{pet.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {pet.species} • {pet.breed || 'Sin raza especificada'}
                              </p>
                            </div>
                            {selectedPet?.id === pet.id && (
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

                {/* History Content */}
                <div className="lg:col-span-3">
                  {selectedPet ? (
                    <div>
                      <Card className="mb-6">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center space-x-3">
                            {selectedPet.photo_url ? (
                              <img 
                                src={selectedPet.photo_url} 
                                alt={selectedPet.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                                <Heart className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium text-foreground">{selectedPet.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {selectedPet.species} • {selectedPet.breed || 'Sin raza especificada'}
                              </p>
                            </div>
                          </CardTitle>
                        </CardHeader>
                      </Card>

                      <Tabs defaultValue="vaccines" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
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
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <Syringe className="h-5 w-5" />
                                <span>Vacunas</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {isLoadingHistory ? (
                                <div className="text-center py-8">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                  <p className="text-muted-foreground">Cargando vacunas...</p>
                                </div>
                              ) : vaccines.length === 0 ? (
                                <div className="text-center py-8">
                                  <Syringe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                  <p className="text-muted-foreground">No hay vacunas registradas</p>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  {vaccines.map((vaccine) => (
                                    <div key={vaccine.id} className="border rounded-lg p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-foreground">{vaccine.vaccine_name}</h4>
                                        <Badge className={getVaccineTypeColor(vaccine.vaccine_type)}>
                                          {vaccine.vaccine_type}
                                        </Badge>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
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
                                        <p className="text-sm text-muted-foreground mt-2">{vaccine.notes}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="dewormings" className="mt-6">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <Shield className="h-5 w-5" />
                                <span>Desparasitaciones</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {isLoadingHistory ? (
                                <div className="text-center py-8">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                  <p className="text-muted-foreground">Cargando desparasitaciones...</p>
                                </div>
                              ) : dewormings.length === 0 ? (
                                <div className="text-center py-8">
                                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                  <p className="text-muted-foreground">No hay desparasitaciones registradas</p>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  {dewormings.map((deworming) => (
                                    <div key={deworming.id} className="border rounded-lg p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-foreground">{deworming.product_name}</h4>
                                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                          {deworming.product_type}
                                        </Badge>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
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
                                        <p className="text-sm text-muted-foreground mt-2">{deworming.notes}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="consultations" className="mt-6">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <Stethoscope className="h-5 w-5" />
                                <span>Consultas Médicas</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {isLoadingHistory ? (
                                <div className="text-center py-8">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                  <p className="text-muted-foreground">Cargando consultas...</p>
                                </div>
                              ) : consultations.length === 0 ? (
                                <div className="text-center py-8">
                                  <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                  <p className="text-muted-foreground">No hay consultas registradas</p>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  {consultations.map((consultation) => (
                                    <div key={consultation.id} className="border rounded-lg p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-foreground">{consultation.reason}</h4>
                                        <Badge className={getConsultationTypeColor(consultation.consultation_type)}>
                                          {consultation.consultation_type}
                                        </Badge>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
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
                                          <p className="text-sm font-medium text-foreground">Diagnóstico:</p>
                                          <p className="text-sm text-muted-foreground">{consultation.diagnosis}</p>
                                        </div>
                                      )}
                                      {consultation.treatment && (
                                        <div className="mb-2">
                                          <p className="text-sm font-medium text-foreground">Tratamiento:</p>
                                          <p className="text-sm text-muted-foreground">{consultation.treatment}</p>
                                        </div>
                                      )}
                                      {consultation.notes && (
                                        <p className="text-sm text-muted-foreground">{consultation.notes}</p>
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
                      <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Selecciona una mascota para ver su historial</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
