'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import PDFPreviewModal from '@/components/PDFPreviewModal'
import { petService } from '@/services/petService'
import { vaccineService } from '@/services/vaccineService'
import { dewormingService } from '@/services/dewormingService'
import { consultationService } from '@/services/consultationService'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ImageModal from '@/components/ImageModal'
import Sidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import {
  Heart,
  Edit,
  Trash2,
  FileText,
  Calendar,
  Plus,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getSpeciesName, getAge, getColorHex } from '@/lib/pet-utils'
import { usePet } from '@/hooks/usePet'
import { useMedicalRecords } from '@/hooks/useMedicalRecords'
import { MedicalRecordCard } from '@/components/MedicalRecordCard'

export default function PetDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const petId = params.id as string

  const { pet, isLoading: isPetLoading, error: petError } = usePet(petId)
  const {
    vaccines,
    dewormings,
    consultations,
    isLoading: isRecordsLoading,
    error: recordsError,
    reload: reloadRecords
  } = useMedicalRecords(petId)

  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [actionError, setActionError] = useState('')

  const isLoading = isPetLoading || isRecordsLoading
  const error = petError || recordsError || actionError

  const handleDelete = async () => {
    if (!pet || !confirm('¿Estás seguro de que quieres eliminar esta mascota? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      await petService.deletePet(pet.id)
      router.push('/dashboard')
    } catch (err: any) {
      setActionError(err.message || 'Error al eliminar la mascota')
    }
  }

  const handleGeneratePDF = () => {
    if (pet) {
      setIsPDFModalOpen(true)
    }
  }

  const handleDeleteVaccine = async (vaccineId: string, vaccineName: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la vacuna "${vaccineName}"? Esta acción no se puede deshacer.`)) {
      return
    }

    try {
      await vaccineService.deleteVaccine(vaccineId)
      await reloadRecords()
    } catch (err: any) {
      setActionError(err.message || 'Error al eliminar la vacuna')
    }
  }

  const handleDeleteDeworming = async (dewormingId: string, productName: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la desparasitación "${productName}"? Esta acción no se puede deshacer.`)) {
      return
    }

    try {
      await dewormingService.deleteDeworming(dewormingId)
      await reloadRecords()
    } catch (err: any) {
      setActionError(err.message || 'Error al eliminar la desparasitación')
    }
  }

  const handleDeleteConsultation = async (consultationId: string, reason: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la consulta "${reason}"? Esta acción no se puede deshacer.`)) {
      return
    }

    try {
      await consultationService.deleteConsultation(consultationId)
      await reloadRecords()
    } catch (err: any) {
      setActionError(err.message || 'Error al eliminar la consulta')
    }
  }

  if (isLoading) {
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
            {/* Pet Info Card */}
            <Card className="mb-6 bg-white dark:bg-[#081028]">
              <CardContent className="p-6">
                <div className="flex items-start space-x-6">
                  <div
                    className="relative w-24 h-24 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                    onClick={() => pet.photo_url && setIsImageModalOpen(true)}
                  >
                    {pet.photo_url ? (
                      <Image
                        src={pet.photo_url}
                        alt={pet.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="h-12 w-12 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{pet.name}</h2>
                        <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                          {getSpeciesName(pet.species)}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/pet/${pet.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleGeneratePDF}>
                          <FileText className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        {pet.breed && (
                          <div>
                            <span className="font-medium text-slate-500 dark:text-slate-400">Raza:</span>
                            <span className="text-slate-900 dark:text-white ml-1">{pet.breed}</span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-slate-500 dark:text-slate-400">Edad:</span>
                          <span className="text-slate-900 dark:text-white ml-1">{getAge(pet.birth_date)}</span>
                        </div>
                        {pet.weight && (
                          <div>
                            <span className="font-medium text-slate-500 dark:text-slate-400">Peso:</span>
                            <span className="text-slate-900 dark:text-white ml-1">{pet.weight} kg</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        {pet.color && (
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-slate-500 dark:text-slate-400">Color:</span>
                            <div
                              className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shadow-sm"
                              style={{ backgroundColor: getColorHex(pet.color) }}
                              title={`Color: ${pet.color}`}
                            />
                            <span className="text-slate-900 dark:text-white">{pet.color}</span>
                          </div>
                        )}
                        {pet.microchip_number && pet.microchip_number.trim() !== '' && (
                          <div>
                            <span className="font-medium text-slate-500 dark:text-slate-400">Microchip:</span>
                            <span className="text-slate-900 dark:text-white ml-1">{pet.microchip_number}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for different sections */}
            <Tabs defaultValue="vaccines" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-[#081028]">
                <TabsTrigger value="vaccines">Vacunas ({vaccines.length})</TabsTrigger>
                <TabsTrigger value="dewormings">Desparasitaciones ({dewormings.length})</TabsTrigger>
                <TabsTrigger value="consultations">Consultas ({consultations.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="vaccines" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Vacunas</h3>
                  <Button size="sm" onClick={() => router.push('/vaccine/new')} className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Vacuna
                  </Button>
                </div>
                {vaccines.length === 0 ? (
                  <Card className="bg-white dark:bg-[#081028]">
                    <CardContent className="p-6 text-center">
                      <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500 dark:text-slate-400">No hay vacunas registradas</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {vaccines.map((vaccine) => (
                      <MedicalRecordCard
                        key={vaccine.id}
                        title={vaccine.vaccine_name}
                        date={vaccine.date_applied}
                        dateLabel="Aplicada el"
                        veterinarian={vaccine.veterinarian}
                        notes={vaccine.notes}
                        nextDate={vaccine.next_dose_date}
                        onDelete={() => handleDeleteVaccine(vaccine.id, vaccine.vaccine_name)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="dewormings" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Desparasitaciones</h3>
                  <Button size="sm" onClick={() => router.push('/deworming/new')} className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Desparasitación
                  </Button>
                </div>
                {dewormings.length === 0 ? (
                  <Card className="bg-white dark:bg-[#081028]">
                    <CardContent className="p-6 text-center">
                      <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500 dark:text-slate-400">No hay desparasitaciones registradas</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {dewormings.map((deworming) => (
                      <MedicalRecordCard
                        key={deworming.id}
                        title={deworming.product_name}
                        date={deworming.date_applied}
                        dateLabel="Aplicada el"
                        veterinarian={deworming.veterinarian}
                        notes={deworming.notes}
                        nextDate={deworming.next_date}
                        onDelete={() => handleDeleteDeworming(deworming.id, deworming.product_name)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="consultations" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Consultas Médicas</h3>
                  <Button size="sm" onClick={() => router.push('/consultation/new')} className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Consulta
                  </Button>
                </div>
                {consultations.length === 0 ? (
                  <Card className="bg-white dark:bg-[#081028]">
                    <CardContent className="p-6 text-center">
                      <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500 dark:text-slate-400">No hay consultas registradas</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {consultations.map((consultation) => (
                      <MedicalRecordCard
                        key={consultation.id}
                        title={consultation.reason}
                        date={consultation.date}
                        veterinarian={consultation.veterinarian}
                        notes={consultation.notes}
                        onDelete={() => handleDeleteConsultation(consultation.id, consultation.reason)}
                      >
                        {consultation.diagnosis && (
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            <span className="font-medium">Diagnóstico:</span> {consultation.diagnosis}
                          </p>
                        )}
                        {consultation.treatment && (
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            <span className="font-medium">Tratamiento:</span> {consultation.treatment}
                          </p>
                        )}
                      </MedicalRecordCard>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>

        {/* Modal para imagen expandida */}
        {pet.photo_url && (
          <ImageModal
            isOpen={isImageModalOpen}
            onClose={() => setIsImageModalOpen(false)}
            src={pet.photo_url}
            alt={pet.name}
            petName={pet.name}
          />
        )}

        {/* PDF Preview Modal */}
        {pet && (
          <PDFPreviewModal
            isOpen={isPDFModalOpen}
            onClose={() => setIsPDFModalOpen(false)}
            pet={pet}
            vaccines={vaccines}
            dewormings={dewormings}
            consultations={consultations}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
