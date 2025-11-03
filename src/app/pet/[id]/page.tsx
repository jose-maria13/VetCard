'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import PDFPreviewModal from '@/components/PDFPreviewModal'
import { petService } from '@/services/petService'
import { vaccineService } from '@/services/vaccineService'
import { dewormingService } from '@/services/dewormingService'
import { consultationService } from '@/services/consultationService'
import { Pet, Vaccine, Deworming, MedicalConsultation } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThemeToggle } from '@/components/ThemeToggle'
import ImageModal from '@/components/ImageModal'
import { 
  Heart, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  FileText, 
  Calendar, 
  Weight, 
  Plus,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function PetDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const petId = params.id as string

  const [pet, setPet] = useState<Pet | null>(null)
  const [vaccines, setVaccines] = useState<Vaccine[]>([])
  const [dewormings, setDewormings] = useState<Deworming[]>([])
  const [consultations, setConsultations] = useState<MedicalConsultation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false)

  useEffect(() => {
    if (petId) {
      loadPetData()
    }
  }, [petId])

  const loadPetData = async () => {
    try {
      setIsLoading(true)
      setError('')

      const [petData, vaccinesData, dewormingsData, consultationsData] = await Promise.all([
        petService.getPetById(petId),
        vaccineService.getVaccinesByPetId(petId),
        dewormingService.getDewormingsByPetId(petId),
        consultationService.getConsultationsByPetId(petId)
      ])

      if (!petData) {
        setError('Mascota no encontrada')
        return
      }

      setPet(petData)
      setVaccines(vaccinesData)
      setDewormings(dewormingsData)
      setConsultations(consultationsData)
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!pet || !confirm('¿Estás seguro de que quieres eliminar esta mascota? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      await petService.deletePet(pet.id)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la mascota')
    }
  }

  const handleGeneratePDF = () => {
    if (pet) {
      setIsPDFModalOpen(true)
    }
  }

  // Funciones para eliminar registros médicos
  const handleDeleteVaccine = async (vaccineId: string, vaccineName: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la vacuna "${vaccineName}"? Esta acción no se puede deshacer.`)) {
      return
    }

    try {
      await vaccineService.deleteVaccine(vaccineId)
      // Recargar los datos después de eliminar
      await loadPetData()
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la vacuna')
    }
  }

  const handleDeleteDeworming = async (dewormingId: string, productName: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la desparasitación "${productName}"? Esta acción no se puede deshacer.`)) {
      return
    }

    try {
      await dewormingService.deleteDeworming(dewormingId)
      // Recargar los datos después de eliminar
      await loadPetData()
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la desparasitación')
    }
  }

  const handleDeleteConsultation = async (consultationId: string, reason: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la consulta "${reason}"? Esta acción no se puede deshacer.`)) {
      return
    }

    try {
      await consultationService.deleteConsultation(consultationId)
      // Recargar los datos después de eliminar
      await loadPetData()
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la consulta')
    }
  }

  const getSpeciesLabel = (species: string) => {
    const speciesMap: { [key: string]: string } = {
      dog: 'Perro',
      cat: 'Gato',
      bird: 'Ave',
      rabbit: 'Conejo',
      hamster: 'Hámster',
      other: 'Otro'
    }
    return speciesMap[species] || species
  }

  const getAge = () => {
    if (!pet?.birth_date) return 'Edad no especificada'
    
    const birthDate = new Date(pet.birth_date)
    const today = new Date()
    const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                       (today.getMonth() - birthDate.getMonth())
    
    if (ageInMonths < 12) {
      return `${ageInMonths} meses`
    } else {
      const years = Math.floor(ageInMonths / 12)
      const months = ageInMonths % 12
      return months > 0 ? `${years} años ${months} meses` : `${years} años`
    }
  }

  const getColorHex = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      // Colores básicos
      'blanco': '#FFFFFF',
      'white': '#FFFFFF',
      'negro': '#000000',
      'black': '#000000',
      'gris': '#808080',
      'gray': '#808080',
      'gris claro': '#D3D3D3',
      'light gray': '#D3D3D3',
      'gris oscuro': '#A9A9A9',
      'dark gray': '#A9A9A9',
      
      // Colores primarios
      'rojo': '#FF0000',
      'red': '#FF0000',
      'azul': '#0000FF',
      'blue': '#0000FF',
      'verde': '#008000',
      'green': '#008000',
      'amarillo': '#FFFF00',
      'yellow': '#FFFF00',
      
      // Colores secundarios
      'naranja': '#FFA500',
      'orange': '#FFA500',
      'rosa': '#FFC0CB',
      'pink': '#FFC0CB',
      'morado': '#800080',
      'purple': '#800080',
      'marrón': '#A52A2A',
      'brown': '#A52A2A',
      'beige': '#F5F5DC',
      'crema': '#FFFDD0',
      'cream': '#FFFDD0',
      
      // Colores específicos de mascotas
      'dorado': '#FFD700',
      'golden': '#FFD700',
      'plateado': '#C0C0C0',
      'silver': '#C0C0C0',
      'chocolate': '#7B3F00',
      'canela': '#D2691E',
      'cinnamon': '#D2691E',
      'atigrado': '#8B4513',
      'tabby': '#8B4513',
      'tricolor': '#8B4513',
      'tortuga': '#8B4513',
      'tortoiseshell': '#8B4513',
      
      // Colores mixtos comunes
      'blanco y negro': '#FFFFFF',
      'white and black': '#FFFFFF',
      'negro y blanco': '#000000',
      'black and white': '#000000',
      'marrón y blanco': '#A52A2A',
      'brown and white': '#A52A2A',
      'blanco y marrón': '#FFFFFF',
      'white and brown': '#FFFFFF',
    }
    
    const normalizedColor = colorName.toLowerCase().trim()
    return colorMap[normalizedColor] || '#808080' // Gris por defecto si no se encuentra
  }

  if (isLoading) {
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
                  <Link href="/dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                  </Link>
                </Button>
                <div className="h-6 w-px bg-border" />
                <h1 className="text-2xl font-bold text-foreground">{pet.name}</h1>
              </div>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
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
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Pet Info Card */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <div 
                  className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
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
                      <Heart className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold text-foreground">{pet.name}</h2>
                    <Badge variant="secondary">
                      {getSpeciesLabel(pet.species)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      {pet.breed && (
                        <div>
                          <span className="font-medium text-muted-foreground">Raza:</span> 
                          <span className="text-foreground ml-1">{pet.breed}</span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-muted-foreground">Edad:</span> 
                        <span className="text-foreground ml-1">{getAge()}</span>
                      </div>
                      {pet.weight && (
                        <div>
                          <span className="font-medium text-muted-foreground">Peso:</span> 
                          <span className="text-foreground ml-1">{pet.weight} kg</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      {pet.color && (
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-muted-foreground">Color:</span>
                          <div 
                            className="w-4 h-4 rounded-full border border-border shadow-sm"
                            style={{ backgroundColor: getColorHex(pet.color) }}
                            title={`Color: ${pet.color}`}
                          />
                          <span className="text-foreground">{pet.color}</span>
                        </div>
                      )}
                      {pet.microchip_number && pet.microchip_number.trim() !== '' && (
                        <div>
                          <span className="font-medium text-muted-foreground">Microchip:</span> 
                          <span className="text-foreground ml-1">{pet.microchip_number}</span>
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="vaccines">Vacunas ({vaccines.length})</TabsTrigger>
              <TabsTrigger value="dewormings">Desparasitaciones ({dewormings.length})</TabsTrigger>
              <TabsTrigger value="consultations">Consultas ({consultations.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="vaccines" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Vacunas</h3>
                <Button size="sm" onClick={() => router.push('/vaccine/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Vacuna
                </Button>
              </div>
              {vaccines.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hay vacunas registradas</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {vaccines.map((vaccine) => (
                    <Card key={vaccine.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{vaccine.vaccine_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Aplicada el {format(new Date(vaccine.date_applied), 'dd/MM/yyyy', { locale: es })}
                            </p>
                            {vaccine.veterinarian && (
                              <p className="text-sm text-muted-foreground/70">
                                Veterinario: {vaccine.veterinarian}
                              </p>
                            )}
                            {vaccine.notes && (
                              <p className="text-sm text-muted-foreground/70 mt-1">
                                Notas: {vaccine.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {vaccine.next_dose_date && (
                              <Badge variant="outline">
                                Próxima: {format(new Date(vaccine.next_dose_date), 'dd/MM/yyyy', { locale: es })}
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteVaccine(vaccine.id, vaccine.vaccine_name)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="dewormings" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Desparasitaciones</h3>
                <Button size="sm" onClick={() => router.push('/deworming/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Desparasitación
                </Button>
              </div>
              {dewormings.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hay desparasitaciones registradas</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {dewormings.map((deworming) => (
                    <Card key={deworming.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{deworming.product_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Aplicada el {format(new Date(deworming.date_applied), 'dd/MM/yyyy', { locale: es })}
                            </p>
                            {deworming.veterinarian && (
                              <p className="text-sm text-muted-foreground/70">
                                Veterinario: {deworming.veterinarian}
                              </p>
                            )}
                            {deworming.notes && (
                              <p className="text-sm text-muted-foreground/70 mt-1">
                                Notas: {deworming.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {deworming.next_date && (
                              <Badge variant="outline">
                                Próxima: {format(new Date(deworming.next_date), 'dd/MM/yyyy', { locale: es })}
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDeworming(deworming.id, deworming.product_name)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="consultations" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Consultas Médicas</h3>
                <Button size="sm" onClick={() => router.push('/consultation/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Consulta
                </Button>
              </div>
              {consultations.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hay consultas registradas</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {consultations.map((consultation) => (
                    <Card key={consultation.id}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground">{consultation.reason}</h4>
                              <span className="text-sm text-muted-foreground">
                                {format(new Date(consultation.date), 'dd/MM/yyyy', { locale: es })}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteConsultation(consultation.id, consultation.reason)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          {consultation.diagnosis && (
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Diagnóstico:</span> {consultation.diagnosis}
                            </p>
                          )}
                          {consultation.treatment && (
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Tratamiento:</span> {consultation.treatment}
                            </p>
                          )}
                          {consultation.veterinarian && (
                            <p className="text-sm text-muted-foreground/70">
                              Veterinario: {consultation.veterinarian}
                            </p>
                          )}
                          {consultation.notes && (
                            <p className="text-sm text-muted-foreground/70">
                              <span className="font-medium">Notas:</span> {consultation.notes}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

          </Tabs>
        </main>
        
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
