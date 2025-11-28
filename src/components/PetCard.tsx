'use client'

import { Pet } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Calendar, Weight, Edit, Trash2, FileText, Syringe, Shield, Stethoscope } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { vaccineService } from '@/services/vaccineService'
import { dewormingService } from '@/services/dewormingService'
import { consultationService } from '@/services/consultationService'
import ImageModal from './ImageModal'
import { getSpeciesName, getAge, getColorHex } from '@/lib/pet-utils'
import { formatDate } from '@/lib/date-utils'

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



  return (
    <Card className="bg-white dark:bg-[#081028] hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-700 overflow-hidden">
      <CardContent className="p-6">
        {/* Header con foto y nombre */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div
              className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0 shadow-md"
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
                  <Heart className="h-10 w-10 text-slate-400" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{pet.name}</h3>
              <div className="flex items-center space-x-2">
                <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium">
                  {getSpeciesName(pet.species)}
                </Badge>
                {pet.breed && (
                  <span className="text-sm text-slate-600 dark:text-slate-400">{pet.breed}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(pet)}
                className="h-9 w-9 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Edit className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(pet)}
                className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Información básica */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span className="text-sm text-slate-600 dark:text-slate-300">{getAge(pet.birth_date)}</span>
          </div>
          {pet.weight && (
            <div className="flex items-center space-x-2">
              <Weight className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-300">{pet.weight} kg</span>
            </div>
          )}
        </div>

        {/* Color */}
        {pet.color && (
          <div className="flex items-center space-x-2 mb-4">
            <div
              className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 shadow-sm"
              style={{ backgroundColor: getColorHex(pet.color) }}
              title={`Color: ${pet.color}`}
            />
            <span className="text-sm text-slate-600 dark:text-slate-300">{pet.color}</span>
          </div>
        )}

        {/* Estadísticas médicas */}
        {!isLoadingMedical && (
          <div className="grid grid-cols-3 gap-3 py-4 border-y border-slate-200 dark:border-slate-700 mb-4">
            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center space-x-1">
                <Syringe className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-lg font-bold text-slate-900 dark:text-white">{medicalCounts.vaccines}</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Vacunas</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-lg font-bold text-slate-900 dark:text-white">{medicalCounts.dewormings}</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Desparasitaciones</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center space-x-1">
                <Stethoscope className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-lg font-bold text-slate-900 dark:text-white">{medicalCounts.consultations}</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Consultas</span>
            </div>
          </div>
        )}

        {/* Fecha de registro */}
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Registrado el {formatDate(pet.created_at)}
        </div>

        {/* Botones de acción */}
        <div className="grid grid-cols-2 gap-2">
          <Button asChild variant="outline" size="sm" className="w-full border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800">
            <Link href={`/pet/${pet.id}`}>
              Ver Detalles
            </Link>
          </Button>
          {onGeneratePDF && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGeneratePDF(pet)}
              className="w-full border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <FileText className="h-4 w-4 mr-1" />
              PDF
            </Button>
          )}
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
