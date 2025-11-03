'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface Pet {
  id: string
  name: string
  species: string
  photo_url: string | null
  created_at: string
}

interface PetCarouselProps {
  pets: Pet[]
}

export default function PetCarousel({ pets }: PetCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Autoplay functionality
  useEffect(() => {
    if (!isAutoPlaying || pets.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % pets.length)
    }, 3000) // Cambia cada 3 segundos

    return () => clearInterval(interval)
  }, [isAutoPlaying, pets.length])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % pets.length)
    setIsAutoPlaying(false) // Pausar autoplay al navegar manualmente
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + pets.length) % pets.length)
    setIsAutoPlaying(false) // Pausar autoplay al navegar manualmente
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false) // Pausar autoplay al navegar manualmente
  }

  if (pets.length === 0) return null

  return (
    <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
      {/* Carrusel Container */}
      <div className="relative overflow-hidden rounded-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="flex justify-center"
          >
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 w-full max-w-sm">
              <CardContent className="p-6 text-center">
                {/* Pet Photo */}
                <div className="relative w-32 h-32 mx-auto mb-4">
                  {pets[currentIndex].photo_url ? (
                    <Image
                      src={pets[currentIndex].photo_url}
                      alt={pets[currentIndex].name}
                      fill
                      sizes="(max-width: 640px) 128px, (max-width: 1024px) 160px, 192px"
                      className="object-cover rounded-full border-4 border-primary/20"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center">
                      <Heart className="h-12 w-12 text-primary" />
                    </div>
                  )}
                </div>

                {/* Pet Info */}
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {pets[currentIndex].name}
                </h3>
                <p className="text-muted-foreground mb-3">
                  {pets[currentIndex].species === 'dog' ? '🐕 Perro' : '🐱 Gato'}
                </p>
                <div className="text-sm text-muted-foreground/60">
                  Miembro desde {new Date(pets[currentIndex].created_at).getFullYear()}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {pets.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {pets.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {pets.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary w-8'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}

      {/* Play/Pause Button */}
      {pets.length > 1 && (
        <div className="flex justify-center mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isAutoPlaying ? '⏸️ Pausar' : '▶️ Reproducir'}
          </Button>
        </div>
      )}
    </div>
  )
}
