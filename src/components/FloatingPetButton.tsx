'use client'

import { motion } from 'framer-motion'
import { Heart, Sparkles, FileText, Shield, Calendar } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

export default function FloatingPetButton() {
  const [isHovering, setIsHovering] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const handleClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 400)
    setIsDialogOpen(true)
  }

  const handleCreateAccount = () => {
    setIsDialogOpen(false)
    router.push('/auth/register')
  }

  return (
    <Popover open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <PopoverTrigger asChild>
        <motion.button
          className="fixed bottom-6 right-6 z-50 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg hover:shadow-2xl border-2 border-white/20 flex items-center justify-center cursor-pointer group overflow-visible"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1, 
            scale: isClicked ? [1, 1.2, 1] : 1
          }}
          transition={isClicked ? {
            scale: { duration: 0.4, ease: "easeOut" }
          } : {
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 }
          }}
      whileHover={!isDialogOpen ? { scale: 1.1 } : {}}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => {
        if (!isDialogOpen) {
          setIsHovering(true)
        }
      }}
      onHoverEnd={() => {
        if (!isDialogOpen) {
          setIsHovering(false)
        }
      }}
      onClick={handleClick}
          aria-label="Mascota virtual"
        >
      {/* Efecto de brillo de fondo */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"
        animate={{ opacity: (isHovering && !isDialogOpen) ? 0.4 : 0.2 }}
        transition={{ duration: 0.3 }}
      />

      {/* Partículas flotantes al hacer hover */}
      {isHovering && !isDialogOpen && (
        <>
          <motion.div
            className="absolute top-2 left-2"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: -20, x: -10 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          >
            <Sparkles className="w-3 h-3 text-yellow-300" />
          </motion.div>
          <motion.div
            className="absolute top-2 right-2"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: -20, x: 10 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          >
            <Heart className="w-3 h-3 text-pink-300" />
          </motion.div>
          <motion.div
            className="absolute bottom-2 left-2"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: 20, x: -10 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          >
            <Sparkles className="w-3 h-3 text-blue-300" />
          </motion.div>
        </>
      )}

      {/* Huella de Mascota - Emoji 🐾 */}
      <motion.div
        className="relative z-10 text-4xl flex items-center justify-center select-none"
        animate={(isHovering && !isDialogOpen) ? {
          scale: [1, 1.15, 1],
          rotate: [0, 5, -5, 0]
        } : {
          scale: 1
        }}
        transition={{ duration: 0.5 }}
      >
        🐾
      </motion.div>

      {/* Tooltip al hacer hover */}
      {isHovering && !isDialogOpen && (
        <motion.div
          className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          {user ? '¡Haz clic para ver más! 🐾' : '¡Haz clic para comenzar! 🐾'}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </motion.div>
      )}
        </motion.button>
      </PopoverTrigger>

      {/* Globo de diálogo al lado del botón */}
      <PopoverContent 
        side="left" 
        align="end"
        sideOffset={20}
        className="w-80 sm:w-96 p-0 border-2 shadow-2xl"
      >
        <div className="p-6 space-y-4">
          {/* Header con emoji */}
          <div className="flex items-center justify-center mb-2">
            <div className="text-5xl">🐾</div>
          </div>
          
          {/* Título */}
          <h3 className="text-xl font-bold text-center">
            {user ? '¡Bienvenido de vuelta!' : '¡Crea el carnet digital de tu mascota!'}
          </h3>
          
          {/* Descripción */}
          <p className="text-sm text-muted-foreground text-center">
            {user 
              ? 'Continúa gestionando la salud de tus mascotas de forma fácil y segura.'
              : 'Registra y gestiona el carnet de vacunación de tus mascotas de forma digital, segura y siempre disponible.'
            }
          </p>
          
          {/* Iconos de características (solo si no está logueado) */}
          {!user && (
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-1">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs text-muted-foreground">Registro completo</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-1">
                  <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-xs text-muted-foreground">Recordatorios</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-1">
                  <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-xs text-muted-foreground">100% Seguro</p>
              </div>
            </div>
          )}
          
          {/* Botones */}
          <div className="flex flex-col gap-2 pt-2">
            {user ? (
              <Button 
                onClick={() => {
                  setIsDialogOpen(false)
                  router.push('/dashboard')
                }}
                className="w-full"
              >
                Ir al Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleCreateAccount}
                  className="w-full"
                  size="lg"
                >
                  Crear Cuenta Gratis
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    router.push('/auth/login')
                  }}
                  className="w-full"
                >
                  Ya tengo cuenta
                </Button>
              </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
