'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, X, FileText, Calendar, Syringe, Shield, Stethoscope } from 'lucide-react'
import { Pet, Vaccine, Deworming, MedicalConsultation } from '@/types'
import { pdfService } from '@/services/pdfService'
import { format, isValid, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import Image from 'next/image'

// Helper function para formatear fechas de forma segura
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'No especificada'
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString)
    if (isValid(date)) {
      return format(date, 'dd/MM/yyyy', { locale: es })
    }
    return 'Fecha inválida'
  } catch (error) {
    return 'Fecha inválida'
  }
}

interface PDFPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  pet: Pet
  vaccines: Vaccine[]
  dewormings: Deworming[]
  consultations: MedicalConsultation[]
}

export default function PDFPreviewModal({
  isOpen,
  onClose,
  pet,
  vaccines,
  dewormings,
  consultations
}: PDFPreviewModalProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewData, setPreviewData] = useState<{
    pet: Pet
    vaccines: Vaccine[]
    dewormings: Deworming[]
    consultations: MedicalConsultation[]
  } | null>(null)

  useEffect(() => {
    if (isOpen && pet) {
      setPreviewData({
        pet,
        vaccines,
        dewormings,
        consultations
      })
    }
  }, [isOpen, pet, vaccines, dewormings, consultations])

  const handleDownload = async () => {
    if (!previewData) return

    setIsGenerating(true)
    try {
      const doc = await pdfService.generateVaccinationCard(
        previewData.pet,
        previewData.vaccines,
        previewData.dewormings,
        previewData.consultations
      )
      pdfService.downloadPDF(doc, `Carnet_${previewData.pet.name}_${formatDate(new Date().toISOString())}.pdf`)
    } catch (error) {
      console.error('Error generando PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadVaccinesOnly = async () => {
    if (!previewData) return

    setIsGenerating(true)
    try {
      const doc = pdfService.generateVaccinesOnly(
        previewData.pet,
        previewData.vaccines
      )
      pdfService.downloadPDF(doc, `Vacunas_${previewData.pet.name}_${formatDate(new Date().toISOString())}.pdf`)
    } catch (error) {
      console.error('Error generando PDF de vacunas:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!previewData) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] max-w-[1200px] w-full max-h-[95vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Vista Previa - Carnet de {previewData.pet.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Grid principal para secciones médicas */}
          <div className="space-y-4">
            {/* Información de la Mascota */}
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  🐾
                </div>
                Información de la Mascota
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Nombre:</span>
                    <span>{previewData.pet.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Especie:</span>
                    <Badge variant="secondary">
                      {previewData.pet.species === 'dog' ? 'Perro' : 'Gato'}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  {previewData.pet.breed && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Raza:</span>
                      <span>{previewData.pet.breed}</span>
                    </div>
                  )}
                  {previewData.pet.birth_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Fecha de nacimiento:</span>
                      <span>
                        {formatDate(previewData.pet.birth_date)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  {previewData.pet.weight && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Peso:</span>
                      <span>{previewData.pet.weight} kg</span>
                    </div>
                  )}
                  {previewData.pet.color && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Color:</span>
                      <span>{previewData.pet.color}</span>
                    </div>
                  )}
                </div>
              </div>
              {previewData.pet.photo_url && (
                <div className="mt-4 flex justify-center">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                    <Image
                      src={previewData.pet.photo_url}
                      alt={previewData.pet.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

            {/* Vacunas */}
            {previewData.vaccines.length > 0 && (
              <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Syringe className="h-5 w-5 text-green-600" />
                  Vacunas ({previewData.vaccines.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {previewData.vaccines.map((vaccine, index) => (
                    <div key={vaccine.id} className="border rounded-lg p-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm">{vaccine.vaccine_name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {formatDate(vaccine.date_applied)}
                          </Badge>
                        </div>
                        {vaccine.notes && (
                          <p className="text-xs text-muted-foreground">
                            {vaccine.notes}
                          </p>
                        )}
                        {vaccine.next_dose_date && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            <span className="font-medium">Próxima dosis:</span>{' '}
                            {formatDate(vaccine.next_dose_date)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

            {/* Desparasitaciones */}
            {previewData.dewormings.length > 0 && (
              <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Desparasitaciones ({previewData.dewormings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {previewData.dewormings.map((deworming, index) => (
                    <div key={deworming.id} className="border rounded-lg p-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm">{deworming.product_name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {formatDate(deworming.date_applied)}
                          </Badge>
                        </div>
                        {deworming.notes && (
                          <p className="text-xs text-muted-foreground">
                            {deworming.notes}
                          </p>
                        )}
                        {deworming.next_date && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            <span className="font-medium">Próxima dosis:</span>{' '}
                            {formatDate(deworming.next_date)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

            {/* Consultas */}
            {previewData.consultations.length > 0 && (
              <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-purple-600" />
                  Consultas ({previewData.consultations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {previewData.consultations.map((consultation, index) => (
                    <div key={consultation.id} className="border rounded-lg p-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm">{consultation.consultation_type}</h4>
                          <Badge variant="outline" className="text-xs">
                            {formatDate(consultation.date)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {consultation.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col lg:flex-row gap-3 pt-6 border-t">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <Button
                onClick={handleDownload}
                disabled={isGenerating}
                className="flex-1"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generando...' : 'Descargar Carnet Completo'}
              </Button>
              <Button
                onClick={handleDownloadVaccinesOnly}
                disabled={isGenerating}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <FileText className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generando...' : 'Solo Vacunas'}
              </Button>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              className="lg:w-auto"
              size="lg"
            >
              <X className="h-4 w-4 mr-2" />
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
