'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'
import Image from 'next/image'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  src: string
  alt: string
  petName?: string
}

export default function ImageModal({ isOpen, onClose, src, alt, petName }: ImageModalProps) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Reset values when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setScale(1)
      setRotation(0)
      setPosition({ x: 0, y: 0 })
    }
  }, [isOpen])

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 3))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5))
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleReset = () => {
    setScale(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      handleZoomIn()
    } else {
      handleZoomOut()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-transparent border-none shadow-none">
        <DialogTitle className="sr-only">
          {petName ? `Imagen de ${petName}` : 'Imagen expandida'}
        </DialogTitle>
        <div className="relative inline-block max-w-[90vw] max-h-[90vh]">
          {/* Header con controles */}
          <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-medium">
                {petName ? `Foto de ${petName}` : 'Imagen'}
              </h3>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Controles de zoom y rotación */}
              <div className="flex items-center space-x-1 bg-black/50 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-white text-sm px-2">
                  {Math.round(scale * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRotate}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  Reset
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Imagen con controles */}
          <div 
            className="flex items-center justify-center overflow-hidden cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <div
              className="relative"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
              }}
            >
              <Image
                src={src}
                alt={alt}
                width={800}
                height={600}
                className="max-w-[90vw] max-h-[90vh] object-contain"
                style={{
                  maxWidth: '90vw',
                  maxHeight: '90vh'
                }}
                priority
              />
            </div>
          </div>

          {/* Instrucciones en la parte inferior */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-black/50 rounded-lg px-4 py-2 text-white text-sm">
              <span className="hidden sm:inline">
                Usa la rueda del mouse para hacer zoom • Arrastra para mover • Click en los controles para rotar
              </span>
              <span className="sm:hidden">
                Toca para hacer zoom • Arrastra para mover
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
