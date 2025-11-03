'use client'

import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Heart, Shield, FileText, Smartphone, Users, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Logo from '@/components/Logo'
import PetCarousel from '@/components/PetCarousel'
import { publicPetService, PublicPet } from '@/services/publicPetService'

// --- Enhanced Animations ---
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } },
}

// Nuevas animaciones para hovers
const cardHover = {
  scale: 1.05,
  y: -8,
}

const buttonHover = {
  scale: 1.05,
}

const iconHover = {
  scale: 1.2,
  rotate: 5,
}

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  // Estado para mascotas del carrusel
  const [publicPets, setPublicPets] = useState<PublicPet[]>([])
  const [petsLoading, setPetsLoading] = useState(true)

  useEffect(() => {
    const loadPets = async () => {
      console.log('🔄 Iniciando carga de mascotas para carrusel...')
      try {
        // Cargar mascotas reales de la base de datos
        const realPets = await publicPetService.getRandomPets(8)
        console.log('📊 Mascotas obtenidas de la base de datos:', realPets)
        
        if (realPets.length > 0) {
          setPublicPets(realPets)
          console.log('✅ Carrusel cargado con mascotas reales:', realPets.length)
          console.log('🐾 Mascotas:', realPets.map(p => `${p.name} (${p.species})`).join(', '))
        } else {
          console.log('⚠️ No se encontraron mascotas reales, usando datos de ejemplo')
          // Fallback con datos mock si no hay mascotas reales
          const mockPets = [
            { id: '1', name: 'Max', species: 'dog', photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=150&h=150&fit=crop&crop=face', created_at: '2024-01-01' },
            { id: '2', name: 'Luna', species: 'cat', photo_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop&crop=face', created_at: '2024-01-02' },
            { id: '3', name: 'Bella', species: 'dog', photo_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=150&h=150&fit=crop&crop=face', created_at: '2024-01-03' },
            { id: '4', name: 'Simba', species: 'cat', photo_url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=150&h=150&fit=crop&crop=face', created_at: '2024-01-04' },
            { id: '5', name: 'Rocky', species: 'dog', photo_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150&h=150&fit=crop&crop=face', created_at: '2024-01-05' },
            { id: '6', name: 'Mia', species: 'cat', photo_url: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=150&h=150&fit=crop&crop=face', created_at: '2024-01-06' },
          ]
          setPublicPets(mockPets)
          console.log('⚠️ Usando datos de ejemplo para el carrusel')
        }
      } catch (error) {
        console.error('❌ Error cargando mascotas:', error)
        console.error('❌ Detalles del error:', JSON.stringify(error, null, 2))
        // Fallback con datos mock en caso de error
        const mockPets = [
          { id: '1', name: 'Max', species: 'dog', photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=150&h=150&fit=crop&crop=face', created_at: '2024-01-01' },
          { id: '2', name: 'Luna', species: 'cat', photo_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop&crop=face', created_at: '2024-01-02' },
          { id: '3', name: 'Bella', species: 'dog', photo_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=150&h=150&fit=crop&crop=face', created_at: '2024-01-03' },
          { id: '4', name: 'Simba', species: 'cat', photo_url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=150&h=150&fit=crop&crop=face', created_at: '2024-01-04' },
        ]
        setPublicPets(mockPets)
        console.log('⚠️ Error cargando mascotas, usando datos de ejemplo')
      } finally {
        setPetsLoading(false)
      }
    }

    loadPets()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div 
          className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  // =========================================================
  // LOGGED IN VIEW
  // =========================================================
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* ---------- Header ---------- */}
        <motion.header 
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-border"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Logo size="lg" />
            </motion.div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <motion.div whileHover={buttonHover} whileTap={{ scale: 0.95 }}>
                <Button asChild>
                  <Link href="/dashboard">Ir al Dashboard</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* ---------- Welcome Section ---------- */}
        <section className="py-20 px-4 text-center overflow-hidden relative">
          {/* Fondo animado con partículas */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Partículas flotantes mejoradas */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-primary/20 dark:bg-primary/30 shadow-sm"
                style={{
                  width: Math.random() * 8 + 3,
                  height: Math.random() * 8 + 3,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -50, 0],
                  x: [0, Math.random() * 40 - 20, 0],
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: Math.random() * 8 + 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 3,
                }}
              />
            ))}
            
            {/* Ondas de fondo */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 dark:from-primary/10 dark:to-secondary/10"
              animate={{
                background: [
                  "linear-gradient(45deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))",
                  "linear-gradient(135deg, rgba(147, 51, 234, 0.05), rgba(59, 130, 246, 0.05))",
                  "linear-gradient(225deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))",
                  "linear-gradient(315deg, rgba(147, 51, 234, 0.05), rgba(59, 130, 246, 0.05))",
                ],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
          
          {/* Contenido principal */}
          <div className="container mx-auto relative z-10">
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="flex flex-col items-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <Badge variant="secondary" className="mb-4">
                  🐾 ¡Bienvenido de vuelta!
                </Badge>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Hola, <motion.span 
                  className="text-primary"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {user.email}
                </motion.span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Continúa gestionando el carnet de vacunación digital de tus mascotas.
                Todo está listo para que sigas cuidando a tus mejores amigos.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div 
                  whileHover={buttonHover} 
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Button size="lg" asChild>
                    <Link href="/dashboard">Ir al Dashboard</Link>
                  </Button>
                </motion.div>

                <motion.div 
                  whileHover={buttonHover} 
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/pet/new">Agregar Mascota</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ---------- Quick Actions Section ---------- */}
        <section className="py-20 px-4 bg-card">
          <div className="container mx-auto">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Tu centro de control para mascotas</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Accede rápidamente a todas las funciones de VetCard desde aquí.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Heart, color: 'blue', title: 'Agregar Mascota', desc: 'Registra una nueva mascota.', path: '/pet/new' },
                { icon: FileText, color: 'green', title: 'Registrar Vacuna', desc: 'Añade un nuevo registro.', path: '/vaccine/new' },
                { icon: Shield, color: 'purple', title: 'Desparasitación', desc: 'Registra tratamientos.', path: '/deworming/new' },
                { icon: Calendar, color: 'orange', title: 'Nueva Consulta', desc: 'Registra una consulta médica.', path: '/consultation/new' },
              ].map(({ icon: Icon, color, title, desc, path }, i) => (
                <motion.div
                  key={title}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } },
                  }}
                >
                  <motion.div
                    whileHover={cardHover}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Card
                      onClick={() => router.push(path)}
                      className="border-0 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
                    >
                      <CardHeader>
                        <motion.div 
                          className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-${color}-200 transition-colors`}
                          whileHover={iconHover}
                        >
                          <Icon className={`h-6 w-6 text-${color}-600`} />
                        </motion.div>
                        <CardTitle className="group-hover:text-primary transition-colors">{title}</CardTitle>
                        <CardDescription className="group-hover:text-foreground/80 transition-colors">{desc}</CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Footer ---------- */}
        <footer className="bg-muted py-12 px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn}
            className="container mx-auto text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="flex justify-center mb-4"
            >
              <Logo size="md" />
            </motion.div>
            <p className="text-muted-foreground mb-4">
              Cuidando a tus mascotas, un registro a la vez.
            </p>
            <p className="text-sm text-muted-foreground/60">
  © {new Date().getFullYear()} VetCard. Todos los derechos reservados.  
  Desarrollado por{' '}
  <a
    href="https://www.linkedin.com/in/jose-maria-atonur-94949324b/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-primary font-medium hover:underline hover:text-primary/80 transition-colors"
  >
    Jose Maria Atonur
  </a>
  .
</p>

          </motion.div>
        </footer>
      </div>
    )
  }

  // =========================================================
  // GUEST VIEW
  // =========================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* ---------- Header ---------- */}
      <motion.header 
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-border"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Logo size="lg" />
          </motion.div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <motion.div whileHover={buttonHover} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
            </motion.div>
            <motion.div whileHover={buttonHover} whileTap={{ scale: 0.95 }}>
            <Button asChild>
              <Link href="/auth/register">Registrarse</Link>
            </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* ---------- Hero Section ---------- */}
      <section className="py-20 px-4 text-center overflow-hidden relative">
        {/* Fondo animado con partículas */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Partículas flotantes mejoradas */}
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/20 dark:bg-primary/30 shadow-sm"
              style={{
                width: Math.random() * 8 + 3,
                height: Math.random() * 8 + 3,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, Math.random() * 40 - 20, 0],
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 8 + 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 3,
              }}
            />
          ))}
          
          {/* Ondas de fondo */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 dark:from-primary/10 dark:to-secondary/10"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))",
                "linear-gradient(135deg, rgba(147, 51, 234, 0.05), rgba(59, 130, 246, 0.05))",
                "linear-gradient(225deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))",
                "linear-gradient(315deg, rgba(147, 51, 234, 0.05), rgba(59, 130, 246, 0.05))",
              ],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
        
        {/* Contenido principal */}
        <motion.div
          className="container mx-auto relative z-10"
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
          <Badge variant="secondary" className="mb-4">
            🐾 Carnet Digital para Mascotas
          </Badge>
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Cuida a tu mascota con <motion.span 
              className="text-primary"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              VetCard
            </motion.span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Gestiona el carnet de vacunación digital de tus mascotas de forma fácil, 
            segura y siempre disponible. Nunca más pierdas el control de la salud de tu mejor amigo.
          </p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial="hidden"
            animate="show"
            variants={fadeIn}
          >
            <motion.div 
              whileHover={buttonHover} 
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
            <Button size="lg" asChild>
              <Link href="/auth/register">Comenzar Gratis</Link>
            </Button>
            </motion.div>
            <motion.div 
              whileHover={buttonHover} 
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Conocer Más</Link>
            </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ---------- Pet Carousel Section ---------- */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4">
              🐾 Mascotas Registradas
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Conoce a algunas de nuestras mascotas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Miles de mascotas ya confían en VetCard para mantener su salud al día
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            {petsLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                <span className="ml-3 text-muted-foreground">Cargando mascotas...</span>
          </div>
            ) : (
              <PetCarousel pets={publicPets} />
            )}
          </motion.div>
        </div>
      </section>

      {/* ---------- Features Section ---------- */}
      <section id="features" className="py-20 px-4 bg-card">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Todo lo que necesitas para cuidar a tu mascota</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Una plataforma completa diseñada específicamente para el cuidado y seguimiento médico de tus mascotas.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FileText, color: 'blue', title: 'Registro Completo', desc: 'Registra vacunas, desparasitaciones y consultas médicas.' },
              { icon: Calendar, color: 'green', title: 'Recordatorios Inteligentes', desc: 'Recibe alertas sobre próximas vacunas y tratamientos.' },
              { icon: Shield, color: 'purple', title: 'Seguro y Privado', desc: 'Protección de datos con encriptación de nivel bancario.' },
              { icon: Smartphone, color: 'orange', title: 'Acceso Móvil', desc: 'Consulta la salud de tu mascota desde cualquier lugar.' },
              { icon: FileText, color: 'red', title: 'PDF Exportable', desc: 'Descarga el carnet en PDF para imprimir o compartir.' },
              { icon: Users, color: 'indigo', title: 'Múltiples Mascotas', desc: 'Gestiona todas tus mascotas desde una sola cuenta.' },
            ].map(({ icon: Icon, color, title, desc }, i) => (
              <motion.div
                key={title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } },
                }}
              >
                <motion.div
                  whileHover={cardHover}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-2xl transition-all transform cursor-pointer group">
              <CardHeader>
                      <motion.div 
                        className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-${color}-200 transition-colors`}
                        whileHover={iconHover}
                      >
                        <Icon className={`h-6 w-6 text-${color}-600`} />
                      </motion.div>
                      <CardTitle className="group-hover:text-primary transition-colors">{title}</CardTitle>
                      <CardDescription className="group-hover:text-foreground/80 transition-colors">{desc}</CardDescription>
              </CardHeader>
            </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA Section ---------- */}
      <motion.section
        className="py-20 px-4 bg-primary text-center"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Únete a miles de dueños de mascotas que ya confían en VetCard.
          </p>
          <motion.div 
            whileHover={buttonHover} 
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth/register">Crear Cuenta Gratis</Link>
          </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* ---------- Footer ---------- */}
      <footer className="bg-muted py-12 px-4">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeIn}
          className="container mx-auto text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="flex justify-center mb-4"
          >
            <Logo size="md" />
          </motion.div>
          <p className="text-muted-foreground mb-4">
            Cuidando a tus mascotas, un registro a la vez.
          </p>
          <p className="text-sm text-muted-foreground/60">
  © {new Date().getFullYear()} VetCard. Todos los derechos reservados.  
  Desarrollado por{' '}
  <a
    href="https://www.linkedin.com/in/jose-maria-atonur-94949324b/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-primary font-medium hover:underline hover:text-primary/80 transition-colors"
  >
    Jose Maria Atonur
  </a>
  .
</p>

        </motion.div>
      </footer>
    </div>
  )
}