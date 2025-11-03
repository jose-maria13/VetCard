'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Heart, Loader2, ArrowLeft } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import Logo from '@/components/Logo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('El email no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setError('')
      console.log('🔐 Intentando iniciar sesión con:', data.email)
      await signIn(data.email, data.password)
      console.log('✅ Inicio de sesión exitoso, redirigiendo...')
      // Esperar un momento antes de redirigir para asegurar que la sesión se establezca
      setTimeout(() => {
        router.push('/dashboard')
      }, 100)
    } catch (err: any) {
      // Solo mostrar el mensaje de error al usuario, no loguear el error completo
      // para evitar que Next.js muestre el stack trace completo en la consola
      const errorMessage = err?.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.'
      setError(errorMessage)
      // Solo loguear en desarrollo, no en producción
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error en inicio de sesión:', errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Back to Home Button - Fixed Position */}
      <div className="fixed top-4 left-4 z-50">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Inicio
          </Link>
        </Button>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Logo size="lg" />
          </div>
          <CardTitle className="text-2xl text-foreground">Iniciar Sesión</CardTitle>
          <CardDescription className="text-muted-foreground">
            Ingresa a tu cuenta para gestionar el carnet de vacunación de tus mascotas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              ¿No tienes una cuenta?{' '}
              <Link href="/auth/register" className="text-primary hover:underline">
                Regístrate aquí
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              <Link href="/auth/forgot-password" className="text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
