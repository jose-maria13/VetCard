'use client'

import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Heart, Shield, FileText, Smartphone, Users, Calendar, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Logo from '@/components/Logo'
import PetCarousel from '@/components/PetCarousel'
import FloatingPetButton from '@/components/FloatingPetButton'
import { WobbleCard } from '@/components/ui/wobble-card'
import { publicPetService, PublicPet } from '@/services/publicPetService'

// --- Animations ---
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } },
}

const buttonHover = {
  scale: 1.05,
}

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Estado para mascotas del carrusel
  const [publicPets, setPublicPets] = useState<PublicPet[]>([])
  const [petsLoading, setPetsLoading] = useState(true)

  useEffect(() => {
    const loadPets = async () => {
      try {
        const realPets = await publicPetService.getRandomPets(8)
        if (realPets.length > 0) {
          setPublicPets(realPets)
        } else {
          // Fallback mock data
          const mockPets = [
            { id: '1', name: 'Max', species: 'dog', photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=150&h=150&fit=crop&crop=face', created_at: '2024-01-01' },
            { id: '2', name: 'Luna', species: 'cat', photo_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop&crop=face', created_at: '2024-01-02' },
            { id: '3', name: 'Bella', species: 'dog', photo_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=150&h=150&fit=crop&crop=face', created_at: '2024-01-03' },
            { id: '4', name: 'Simba', species: 'cat', photo_url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=150&h=150&fit=crop&crop=face', created_at: '2024-01-04' },
            { id: '5', name: 'Rocky', species: 'dog', photo_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150&h=150&fit=crop&crop=face', created_at: '2024-01-05' },
            { id: '6', name: 'Mia', species: 'cat', photo_url: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=150&h=150&fit=crop&crop=face', created_at: '2024-01-06' },
          ]
          setPublicPets(mockPets)
        }
      } catch (error) {
        console.error('Error loading pets', error)
      } finally {
        setPetsLoading(false)
      }
    }

    // Cargar mascotas al montar el componente
    loadPets()

    // Recargar mascotas cuando la página se vuelve visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadPets()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-tl from-purple-50 via-sky-50 to-purple-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-x-hidden">

      {/* ---------- Header ---------- */}
      <header className="fixed top-0 w-full z-50 bg-white/10 dark:bg-black/10 backdrop-blur-md border-b border-white/20 dark:border-white/5">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo size="md" />
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg shadow-indigo-500/30">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button variant="ghost" asChild className="hidden sm:inline-flex">
                  <Link href="/auth/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg shadow-indigo-500/30">
                  <Link href="/auth/register">Comenzar Gratis</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ---------- Hero Section ---------- */}
      <div className="pt-32 pb-20 px-4 sm:px-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-2 items-center gap-x-12 gap-y-16">

            {/* Text Content */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
            >
              <div className="max-w-3xl max-lg:mx-auto max-lg:text-center">
                <p className="mb-4 font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide flex items-center max-lg:justify-center">
                  <span className="w-8 h-[2px] bg-indigo-600 dark:bg-indigo-400 mr-2"></span>
                  Cuidado Inteligente para tu Mascota
                </p>
                <h1 className="text-slate-900 dark:text-white md:text-6xl text-4xl font-extrabold !leading-tight mb-6">
                  Tu Mascota, Su Salud, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                    Todo en un solo lugar
                  </span>
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8">
                  VetHealth es la plataforma integral para gestionar el historial médico de tus mejores amigos.
                  Vacunas, desparasitaciones y consultas, todo organizado y accesible desde cualquier lugar.
                </p>

                <div className="flex flex-wrap gap-4 max-lg:justify-center">
                  <motion.div whileHover={buttonHover} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" asChild className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-xl shadow-indigo-500/30 rounded-xl">
                      <Link href={user ? "/dashboard" : "/auth/register"}>
                        {user ? "Ir al Dashboard" : "Comenzar Gratis"}
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={buttonHover} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" variant="outline" asChild className="h-14 px-8 text-lg border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl bg-transparent">
                      <Link href="#features">Descubrir Más</Link>
                    </Button>
                  </motion.div>
                </div>

                {/* Stats */}
                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                  <div className="grid grid-cols-3 gap-x-4 gap-y-6 max-lg:text-center">
                    <div className="flex flex-col">
                      <h5 className="text-indigo-700 dark:text-indigo-400 font-bold text-3xl mb-1">100%</h5>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Seguro</p>
                    </div>
                    <div className="flex flex-col">
                      <h5 className="text-indigo-700 dark:text-indigo-400 font-bold text-3xl mb-1">+100</h5>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Mascotas</p>
                    </div>
                    <div className="flex flex-col">
                      <h5 className="text-indigo-700 dark:text-indigo-400 font-bold text-3xl mb-1">24/7</h5>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Acceso</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Image Masonry */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="columns-2 space-y-4 gap-4"
            >
              <div className="break-inside-avoid space-y-4">
                <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                  <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&q=80" alt="Perro feliz"
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                  <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80" alt="Gato curioso"
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
              <div className="break-inside-avoid space-y-4 pt-8">
                <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                  <img src="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600&q=80" alt="Perro y dueño"
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ---------- Carousel Section ---------- */}
      <section className="py-16 px-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-none px-4 py-1">
              Comunidad VetHealth
            </Badge>
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
              Mascotas que ya están protegidas
            </h2>
          </motion.div>

          {petsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
          ) : (
            <PetCarousel pets={publicPets} />
          )}
        </div>
      </section>

      {/* ---------- Features Section ---------- */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Todo lo que necesitas</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Herramientas profesionales diseñadas para simplificar el cuidado de tu mascota.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
            <WobbleCard
              containerClassName="col-span-1 min-h-[300px] bg-indigo-600 cursor-pointer"
              className="p-6"
            >
              <div className="h-full flex flex-col justify-between">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Historial Médico</h2>
                  <p className="text-indigo-100">Registro completo de vacunas y tratamientos.</p>
                </div>
              </div>
            </WobbleCard>

            <WobbleCard
              containerClassName="col-span-1 min-h-[300px] bg-purple-600 cursor-pointer"
              className="p-6"
            >
              <div className="h-full flex flex-col justify-between">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Recordatorios</h2>
                  <p className="text-purple-100">Alertas automáticas para próximas dosis.</p>
                </div>
              </div>
            </WobbleCard>

            <WobbleCard
              containerClassName="col-span-1 min-h-[300px] bg-pink-600 cursor-pointer"
              className="p-6"
            >
              <div className="h-full flex flex-col justify-between">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Seguridad Total</h2>
                  <p className="text-pink-100">Tus datos protegidos y siempre disponibles.</p>
                </div>
              </div>
            </WobbleCard>
          </div>
        </div>
      </section>

      {/* ---------- CTA Section ---------- */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-indigo-600 rounded-3xl p-8 sm:p-16 text-center relative overflow-hidden shadow-2xl">
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                ¿Listo para mejorar la vida de tu mascota?
              </h2>
              <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                Únete a la comunidad de dueños responsables que eligen VetHealth.
              </p>
              <Button size="lg" asChild className="h-14 px-8 text-lg bg-white text-indigo-600 hover:bg-indigo-50 border-none shadow-xl rounded-xl">
                <Link href="/auth/register">
                  Crear Cuenta Gratis <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Logo size="md" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Cuidando a tus mascotas, un registro a la vez.
          </p>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Página Desarrollada por <a href="https://www.linkedin.com/in/jose-maria-atonur-94949324b" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Jose Maria Atonur</a>.
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-600">
            © {new Date().getFullYear()} VetHealth. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Botón flotante de mascota */}
      <FloatingPetButton />
    </div>
  )
}