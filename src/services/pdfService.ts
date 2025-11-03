import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Pet, Vaccine, Deworming, MedicalConsultation } from '@/types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

// Función auxiliar para cargar imagen a Base64
async function getImageBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error loading image for PDF:', error)
    return null
  }
}

// Extender jsPDF para incluir autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export const pdfService = {
  // Generar PDF completo del carnet de vacunación
  async generateVaccinationCard(
    pet: Pet,
    vaccines: Vaccine[],
    dewormings: Deworming[],
    consultations: MedicalConsultation[]
  ): Promise<jsPDF> {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    let yPosition = margin

    // Logo en el header (primero el logo)
    const logoBase64 = await getImageBase64('/logo vet card.png')
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', margin, yPosition - 5, 25, 25)
      } catch (error) {
        console.warn('Error al agregar logo al PDF:', error)
      }
    }

    // Título del header (ajustado para no superponerse)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('Carnet de Vacunación Digital', pageWidth / 2, yPosition + 8, { align: 'center' })
    yPosition += 30

    // Información de la mascota
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Información de la Mascota', margin, yPosition)
    yPosition += 10

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')

    // Configuración para el layout de dos columnas
    const imageX = pageWidth - margin - 60 // Posición X para la imagen
    const imageY = yPosition // Posición Y para la imagen
    const imageHeight = 50 // Altura de la imagen
    const imageWidth = 50 // Ancho de la imagen

    // Cargar la imagen si existe
    let petPhotoBase64: string | null = null
    if (pet.photo_url) {
      petPhotoBase64 = await getImageBase64(pet.photo_url)
    }

    // Función auxiliar para formatear fechas de forma segura
    const formatDateSafe = (dateString: string | null | undefined): string => {
      if (!dateString) return 'No especificada'
      try {
        // Manejar formato ISO (YYYY-MM-DD) correctamente
        const date = new Date(dateString + 'T00:00:00')
        if (Number.isNaN(date.getTime())) return 'Fecha inválida'
        return format(date, 'dd/MM/yyyy', { locale: es })
      } catch (error) {
        console.error('Error formatting date:', error)
        return 'Fecha inválida'
      }
    }

    // Información de la mascota en el lado izquierdo
    const petInfo = [
      ['Nombre:', pet.name],
      ['Especie:', pet.species === 'dog' ? 'Perro' : pet.species === 'cat' ? 'Gato' : pet.species],
      ['Raza:', pet.breed || 'No especificada'],
      ['Nacimiento:', formatDateSafe(pet.birth_date)],
      ['Peso:', pet.weight ? `${pet.weight} kg` : 'No especificado'],
      ['Color:', pet.color || 'No especificado'],
    ]

    let currentY = yPosition
    petInfo.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold')
      doc.text(`${label}`, margin, currentY)
      doc.setFont('helvetica', 'normal')
      doc.text(value, margin + 40, currentY)
      currentY += 8
    })

    // Agregar la imagen en el lado derecho si existe
    if (petPhotoBase64) {
      try {
        doc.addImage(petPhotoBase64, 'JPEG', imageX, imageY, imageWidth, imageHeight)
      } catch (error) {
        console.error('Error adding image to PDF:', error)
      }
    }

    yPosition = Math.max(currentY, imageY + imageHeight) + 15

    // Vacunas
    if (vaccines.length > 0) {
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Vacunas', margin, yPosition)
      yPosition += 15

      const vaccineData = vaccines.map(vaccine => [
        vaccine.vaccine_name,
        format(new Date(vaccine.date_applied), 'dd/MM/yyyy', { locale: es }),
        vaccine.next_dose_date ? format(new Date(vaccine.next_dose_date), 'dd/MM/yyyy', { locale: es }) : 'N/A',
        vaccine.veterinarian || 'N/A',
        vaccine.notes || ''
      ])

      autoTable(doc, {
        startY: yPosition,
        head: [['Vacuna', 'Fecha Aplicada', 'Próxima Dosis', 'Veterinario', 'Notas']],
        body: vaccineData,
        styles: { 
          fontSize: 10,
          cellWidth: 'wrap',
          overflow: 'linebreak',
          halign: 'left'
        },
        columnStyles: {
          0: { cellWidth: 35 }, // Vacuna
          1: { cellWidth: 25 }, // Fecha Aplicada
          2: { cellWidth: 25 }, // Próxima Dosis
          3: { cellWidth: 30 }, // Veterinario
          4: { cellWidth: 35 }  // Notas
        },
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: margin, right: margin }
      })

      yPosition = (doc as any).lastAutoTable.finalY + 15
    }

    // Desparasitaciones
    if (dewormings.length > 0) {
      if (yPosition > pageHeight - 60) {
        doc.addPage()
        yPosition = margin
      }

      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Desparasitaciones', margin, yPosition)
      yPosition += 15

      const dewormingData = dewormings.map(deworming => [
        deworming.product_name,
        format(new Date(deworming.date_applied), 'dd/MM/yyyy', { locale: es }),
        deworming.next_date ? format(new Date(deworming.next_date), 'dd/MM/yyyy', { locale: es }) : 'N/A',
        deworming.notes || ''
      ])

      autoTable(doc, {
        startY: yPosition,
        head: [['Producto', 'Fecha Aplicada', 'Próxima Aplicación', 'Notas']],
        body: dewormingData,
        styles: { 
          fontSize: 10,
          cellWidth: 'wrap',
          overflow: 'linebreak',
          halign: 'left'
        },
        columnStyles: {
          0: { cellWidth: 40 }, // Producto
          1: { cellWidth: 30 }, // Fecha Aplicada
          2: { cellWidth: 30 }, // Próxima Aplicación
          3: { cellWidth: 50 }  // Notas
        },
        headStyles: { fillColor: [34, 197, 94] },
        margin: { left: margin, right: margin }
      })

      yPosition = (doc as any).lastAutoTable.finalY + 15
    }

    // Consultas Médicas
    if (consultations.length > 0) {
      if (yPosition > pageHeight - 80) {
        doc.addPage()
        yPosition = margin
      }

      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Consultas Médicas', margin, yPosition)
      yPosition += 15

      const consultationData = consultations.map(consultation => [
        format(new Date(consultation.date), 'dd/MM/yyyy', { locale: es }),
        consultation.reason,
        consultation.diagnosis || 'N/A',
        consultation.treatment || 'N/A',
        consultation.veterinarian || 'N/A'
      ])

      autoTable(doc, {
        startY: yPosition,
        head: [['Fecha', 'Motivo', 'Diagnóstico', 'Tratamiento', 'Veterinario']],
        body: consultationData,
        styles: { 
          fontSize: 9,
          cellWidth: 'wrap',
          overflow: 'linebreak',
          halign: 'left'
        },
        columnStyles: {
          0: { cellWidth: 20 }, // Fecha
          1: { cellWidth: 25 }, // Motivo
          2: { cellWidth: 30 }, // Diagnóstico
          3: { cellWidth: 30 }, // Tratamiento
          4: { cellWidth: 25 }  // Veterinario
        },
        headStyles: { fillColor: [239, 68, 68] },
        margin: { left: margin, right: margin }
      })

      yPosition = (doc as any).lastAutoTable.finalY + 15
    }


    // Footer
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(
        `Generado el ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })} - Página ${i} de ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )
    }

    return doc
  },

  // Generar PDF solo de vacunas
  generateVaccinesOnly(pet: Pet, vaccines: Vaccine[]): jsPDF {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let yPosition = margin

    // Header
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text(`Vacunas - ${pet.name}`, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 20

    if (vaccines.length > 0) {
      const vaccineData = vaccines.map(vaccine => [
        vaccine.vaccine_name,
        format(new Date(vaccine.date_applied), 'dd/MM/yyyy', { locale: es }),
        vaccine.next_dose_date ? format(new Date(vaccine.next_dose_date), 'dd/MM/yyyy', { locale: es }) : 'N/A',
        vaccine.veterinarian || 'N/A',
        vaccine.notes || ''
      ])

      autoTable(doc, {
        startY: yPosition,
        head: [['Vacuna', 'Fecha Aplicada', 'Próxima Dosis', 'Veterinario', 'Notas']],
        body: vaccineData,
        styles: { 
          fontSize: 10,
          cellWidth: 'wrap',
          overflow: 'linebreak',
          halign: 'left'
        },
        columnStyles: {
          0: { cellWidth: 35 }, // Vacuna
          1: { cellWidth: 25 }, // Fecha Aplicada
          2: { cellWidth: 25 }, // Próxima Dosis
          3: { cellWidth: 30 }, // Veterinario
          4: { cellWidth: 35 }  // Notas
        },
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: margin, right: margin }
      })
    } else {
      doc.setFontSize(12)
      doc.text('No hay vacunas registradas', margin, yPosition)
    }

    return doc
  },

  // Descargar PDF
  downloadPDF(doc: jsPDF, filename: string): void {
    doc.save(filename)
  }
}

