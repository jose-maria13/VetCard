'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import PetCard from '@/components/PetCard'
import PDFPreviewModal from '@/components/PDFPreviewModal'
import { petService } from '@/services/petService'
import { vaccineService } from '@/services/vaccineService'
import { dewormingService } from '@/services/dewormingService'
import { consultationService } from '@/services/consultationService'
import { Pet, Vaccine, Deworming, MedicalConsultation } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Plus, Calendar, AlertTriangle, Syringe, Shield, Stethoscope, FileText, TrendingUp, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [upcomingVaccines, setUpcomingVaccines] = useState(0)
  const [upcomingDewormings, setUpcomingDewormings] = useState(0)
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [petMedicalData, setPetMedicalData] = useState<{
    vaccines: Vaccine[]
    dewormings: Deworming[]
    consultations: MedicalConsultation[]
  }>({
    vaccines: [],
    dewormings: [],
    consultations: []
  })

  useEffect(() => {
    if (user) {
      loadPets()
      loadUpcomingReminders()
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

  const loadUpcomingReminders = async () => {
    if (!user) return

    try {
      const [vaccines, dewormings] = await Promise.all([
        vaccineService.getUpcomingVaccines(user.id, 30),
        dewormingService.getUpcomingDewormings(user.id, 30)
      ])
      setUpcomingVaccines(vaccines.length)
      setUpcomingDewormings(dewormings.length)
    } catch (error) {
      console.error('Error al cargar recordatorios:', error)
    }
  }

  const handleEditPet = (pet: Pet) => {
    router.push(`/pet/${pet.id}/edit`)
  }

  const handleDeletePet = async (pet: Pet) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar a ${pet.name}? Esta acción no se puede deshacer.`)) {
      return
    }

    try {
      await petService.deletePet(pet.id)
      await loadPets()
    } catch (error) {
      console.error('Error al eliminar mascota:', error)
    }
  }

  const handleGeneratePDF = async (pet: Pet) => {
    try {
      setSelectedPet(pet)
      const [vaccines, dewormings, consultations] = await Promise.all([
        vaccineService.getVaccinesByPet(pet.id),
        dewormingService.getDewormingsByPet(pet.id),
        consultationService.getConsultationsByPet(pet.id)
      ])

      setPetMedicalData({
        vaccines,
        dewormings,
        consultations
      })

      setIsPDFModalOpen(true)
    } catch (error) {
      console.error('Error al cargar datos médicos:', error)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-[#050a1f] flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col lg:ml-[270px] transition-all duration-300">
          <DashboardHeader setSidebarOpen={setSidebarOpen} />

          <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
            {/* Welcome Section */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Hola, {user?.email?.split('@')[0]} 👋
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Aquí tienes el resumen de tus mascotas hoy.
                </p>
              </div>
              <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30">
                <Link href="/pet/new">
                  <Plus className="w-5 h-5 mr-2" />
                  Nueva Mascota
                </Link>
              </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {/* Total Pets */}
              <Card className="bg-white dark:bg-[#081028] border-none shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      + Activos
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{pets.length}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Mascotas Registradas</p>
                </CardContent>
              </Card>

              {/* Vaccines */}
              <Card className="bg-white dark:bg-[#081028] border-none shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                      <Syringe className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    {upcomingVaccines > 0 && (
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 animate-pulse">
                        Pendientes
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{upcomingVaccines}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Vacunas Próximas</p>
                </CardContent>
              </Card>

              {/* Dewormings */}
              <Card className="bg-white dark:bg-[#081028] border-none shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{upcomingDewormings}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Desparasitaciones</p>
                </CardContent>
              </Card>

            </div>

            {/* Pets Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Mis Mascotas</h2>
                <Button variant="ghost" className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                  Ver todas
                </Button>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
                </div>
              ) : pets.length === 0 ? (
                <Card className="bg-white dark:bg-[#081028] border-dashed border-2 border-slate-200 dark:border-slate-700">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <Heart className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No hay mascotas aún</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
                      Comienza agregando a tu compañero peludo para llevar el control de su salud.
                    </p>
                    <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      <Link href="/pet/new">
                        <Plus className="w-5 h-5 mr-2" />
                        Agregar Mascota
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pets.map((pet) => (
                    <PetCard
                      key={pet.id}
                      pet={pet}
                      onEdit={handleEditPet}
                      onDelete={handleDeletePet}
                      onGeneratePDF={handleGeneratePDF}
                    />
                  ))}
                </div>
              )}
            </div>

          </main>
        </div>

        {/* PDF Modal */}
        {selectedPet && (
          <PDFPreviewModal
            isOpen={isPDFModalOpen}
            onClose={() => {
              setIsPDFModalOpen(false)
              setSelectedPet(null)
            }}
            pet={selectedPet}
            vaccines={petMedicalData.vaccines}
            dewormings={petMedicalData.dewormings}
            consultations={petMedicalData.consultations}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
