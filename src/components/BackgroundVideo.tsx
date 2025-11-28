'use client'

import { useEffect, useRef, useState } from 'react'

interface BackgroundVideoProps {
  src: string
  className?: string
  overlay?: boolean
  overlayOpacity?: number
}

export default function BackgroundVideo({ 
  src, 
  className = '',
  overlay = true,
  overlayOpacity = 30 // 30% por defecto (más claro)
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Función para intentar reproducir
    const playVideo = async () => {
      try {
        // Verificar que el video esté listo
        if (video.readyState >= 2) {
          await video.play()
          setIsLoaded(true)
          console.log('✅ Video reproducido correctamente')
        }
      } catch (error) {
        console.error('❌ Error al reproducir video:', error)
        // No marcar como error si es solo un problema de autoplay
        // El video puede seguir intentando cargar
      }
    }

    // Manejar cuando el video está listo para reproducir
    const handleCanPlay = () => {
      console.log('📹 Video listo para reproducir')
      playVideo()
    }

    // Manejar cuando los datos están cargados
    const handleLoadedData = () => {
      console.log('📹 Video cargado, intentando reproducir...')
      playVideo()
    }

    // Manejar errores de carga
    const handleError = (e: Event) => {
      console.error('❌ Error cargando video:', e)
      setError(true)
    }

    // Agregar event listeners
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('error', handleError)

    // Intentar reproducir si ya está listo
    if (video.readyState >= 2) {
      playVideo()
    }

    // Cleanup
    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('error', handleError)
    }
  }, [])

  // Si hay error, mostrar fondo de fallback
  if (error) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 z-0" />
    )
  }

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover z-0 ${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          minWidth: '100%',
          minHeight: '100%',
        }}
        onError={(e) => {
          console.error('❌ Error cargando video:', e)
          setError(true)
        }}
        onCanPlay={() => {
          console.log('✅ Video listo para reproducir')
          setIsLoaded(true)
        }}
        onLoadedData={() => {
          console.log('📹 Datos del video cargados')
        }}
      >
        <source src={src} type="video/mp4" />
        Tu navegador no soporta videos de fondo
      </video>
      {overlay && (
        <div 
          className={`absolute inset-0 bg-black/${overlayOpacity} z-[1]`}
          style={{
            backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})`
          }}
        />
      )}
      {/* Fondo de carga mientras se carga el video */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 z-0" />
      )}
    </>
  )
}

