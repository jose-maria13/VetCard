'use client'

import { Pet } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Calendar, Weight, Edit, Trash2, FileText, Syringe, Shield, Stethoscope } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { vaccineService } from '@/services/vaccineService'
import { dewormingService } from '@/services/dewormingService'
import { consultationService } from '@/services/consultationService'
import ImageModal from './ImageModal'

interface PetCardProps {
  pet: Pet
  onEdit?: (pet: Pet) => void
  onDelete?: (pet: Pet) => void
  onGeneratePDF?: (pet: Pet) => void
}

export default function PetCard({ pet, onEdit, onDelete, onGeneratePDF }: PetCardProps) {
  const [medicalCounts, setMedicalCounts] = useState({
    vaccines: 0,
    dewormings: 0,
    consultations: 0
  })
  const [isLoadingMedical, setIsLoadingMedical] = useState(true)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  useEffect(() => {
    loadMedicalCounts()
  }, [pet.id])

  const loadMedicalCounts = async () => {
    try {
      setIsLoadingMedical(true)
      const [vaccines, dewormings, consultations] = await Promise.all([
        vaccineService.getVaccinesByPet(pet.id),
        dewormingService.getDewormingsByPet(pet.id),
        consultationService.getConsultationsByPet(pet.id)
      ])
      
      setMedicalCounts({
        vaccines: vaccines.length,
        dewormings: dewormings.length,
        consultations: consultations.length
      })
    } catch (error) {
      console.error('Error al cargar conteos médicos:', error)
    } finally {
      setIsLoadingMedical(false)
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
    if (!pet.birth_date) return 'Edad no especificada'
    
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

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
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
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <CardTitle className="text-xl text-foreground">{pet.name}</CardTitle>
              <CardDescription className="flex items-center space-x-2">
                <Badge variant="secondary">
                  {getSpeciesLabel(pet.species)}
                </Badge>
                {pet.breed && (
                  <span className="text-sm text-muted-foreground">{pet.breed}</span>
                )}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex space-x-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(pet)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(pet)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Información básica */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{getAge()}</span>
            </div>
            {pet.weight && (
              <div className="flex items-center space-x-2">
                <Weight className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{pet.weight} kg</span>
              </div>
            )}
          </div>

          {/* Color y microchip */}
          {(pet.color || pet.microchip_number) && (
            <div className="space-y-1 text-sm">
              {pet.color && (
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-border shadow-sm"
                    style={{ backgroundColor: getColorHex(pet.color) }}
                    title={`Color: ${pet.color}`}
                  />
                  <span className="text-muted-foreground">{pet.color}</span>
                </div>
              )}
              {pet.microchip_number && (
                <div className="text-muted-foreground">
                  <span className="font-medium">Microchip:</span> {pet.microchip_number}
                </div>
              )}
            </div>
          )}

          {/* Información médica */}
          {!isLoadingMedical && (
            <div className="grid grid-cols-3 gap-2 py-2 border-t border-border">
              <div className="flex flex-col items-center space-y-1">
                <div className="flex items-center space-x-1">
                  <Syringe className="h-3 w-3 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-foreground">{medicalCounts.vaccines}</span>
                </div>
                <span className="text-xs text-muted-foreground">Vacunas</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-medium text-foreground">{medicalCounts.dewormings}</span>
                </div>
                <span className="text-xs text-muted-foreground">Desparasitaciones</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="flex items-center space-x-1">
                  <Stethoscope className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-medium text-foreground">{medicalCounts.consultations}</span>
                </div>
                <span className="text-xs text-muted-foreground">Consultas</span>
              </div>
            </div>
          )}

          {/* Fecha de registro */}
          <div className="text-xs text-muted-foreground">
            Registrado el {format(new Date(pet.created_at), 'dd/MM/yyyy', { locale: es })}
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-2 pt-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/pet/${pet.id}`}>
                Ver Detalles
              </Link>
            </Button>
            {onGeneratePDF && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onGeneratePDF(pet)}
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-1" />
                PDF
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      
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
    </Card>
  )
}
