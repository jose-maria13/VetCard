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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Plus, Calendar, AlertTriangle, LogOut, User, Search, Syringe, Shield, Stethoscope, FileText, Home } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/ThemeToggle'
import { motion } from 'framer-motion'
import Logo from '@/components/Logo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
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

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
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
      await loadPets() // Recargar la lista
    } catch (error) {
      console.error('Error al eliminar mascota:', error)
    }
  }

  const handleGeneratePDF = async (pet: Pet) => {
    try {
      setSelectedPet(pet)
      
      // Cargar datos médicos de la mascota
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

  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.species.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Link href="/">
                <Logo size="lg" />
              </Link>
            </motion.div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{user?.email}</span>
              </div>
              <ThemeToggle />
              <Button variant="ghost" asChild>
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Volver al Inicio
                </Link>
              </Button>
              <Button variant="ghost" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              ¡Bienvenido a VetCard!
            </h1>
            <p className="text-muted-foreground">
              Gestiona el carnet de vacunación digital de tus mascotas
            </p>
          </div>

          {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="hover:scale-105 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">Mascotas Registradas</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold group-hover:text-primary transition-colors">{pets.length}</div>
                <p className="text-xs text-muted-foreground">
                  {pets.length === 0 ? 'Agrega tu primera mascota' : 'Total registradas'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:scale-105 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-orange-600 transition-colors">Vacunas Pendientes</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground group-hover:text-orange-600 group-hover:scale-110 transition-all duration-300" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold group-hover:text-orange-600 transition-colors">{upcomingVaccines}</div>
                <p className="text-xs text-muted-foreground">
                  Próximas a vencer (30 días)
                </p>
              </CardContent>
            </Card>

            <Card className="hover:scale-105 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-blue-600 transition-colors">Desparasitaciones</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold group-hover:text-blue-600 transition-colors">{upcomingDewormings}</div>
                <p className="text-xs text-muted-foreground">
                  Próximas a vencer (30 días)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search Bar */}
          {pets.length > 0 && (
            <div className="mb-8">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar mascotas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          {/* Pets Grid or Empty State */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando mascotas...</p>
            </div>
          ) : filteredPets.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {pets.length === 0 ? 'No tienes mascotas registradas' : 'No se encontraron mascotas'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {pets.length === 0 
                  ? 'Comienza agregando tu primera mascota para gestionar su carnet de vacunación digital.'
                  : 'Intenta con otros términos de búsqueda.'
                }
              </p>
              {pets.length === 0 && (
                <Button asChild size="lg" className="hover:scale-105 hover:shadow-lg transition-all duration-300">
                  <Link href="/pet/new">
                    <Plus className="h-5 w-5 mr-2" />
                    Agregar Primera Mascota
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredPets.map((pet) => (
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

          {/* Add Pet Button */}
          {pets.length > 0 && (
            <div className="text-center">
              <Button asChild size="lg" className="hover:scale-105 hover:shadow-lg transition-all duration-300">
                <Link href="/pet/new">
                  <Plus className="h-5 w-5 mr-2" />
                  Agregar Nueva Mascota
                </Link>
              </Button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Acciones Rápidas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:scale-105 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group" onClick={() => router.push('/vaccine/new')}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/40 transition-colors">
                      <Syringe className="h-5 w-5 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Agregar Vacunas</h3>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">Registrar vacunación</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:scale-105 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group" onClick={() => router.push('/deworming/new')}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40 transition-colors">
                      <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Desparasitaciones</h3>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">Registrar desparasitación</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:scale-105 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group" onClick={() => router.push('/consultation/new')}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors">
                      <Stethoscope className="h-5 w-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Consultas Médicas</h3>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">Registrar consulta</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:scale-105 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group" onClick={() => router.push('/history')}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-900/40 transition-colors">
                      <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Historial</h3>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">Ver registros médicos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* PDF Preview Modal */}
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
