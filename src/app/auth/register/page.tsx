'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Lock, CheckCircle, ArrowLeft } from 'lucide-react'
import Logo from '@/components/Logo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('El email no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setError('')
      await signUp(data.email, data.password)
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 shadow-2xl rounded-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            ¡Cuenta Creada!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Revisa tu email para confirmar tu cuenta y luego podrás acceder a VetHealth.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex items-center justify-center p-4 relative">
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
        <Button variant="ghost" asChild className="hover:bg-transparent hover:text-indigo-600 dark:hover:text-indigo-400 p-0">
          <Link href="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver al Inicio</span>
          </Link>
        </Button>
      </div>
      <div className="max-w-6xl w-full bg-white dark:bg-slate-900 shadow-2xl rounded-2xl overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-y-8">

          {/* Form Section */}
          <div className="p-8 md:p-12 w-full max-w-md mx-auto flex flex-col justify-center">
            <div className="mb-10 text-center lg:text-left">
              <Link href="/" className="inline-block mb-8">
                <Logo size="lg" />
              </Link>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Crear una cuenta</h1>
              <p className="text-slate-600 dark:text-slate-400">Únete a nuestra comunidad de dueños responsables.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="email" className="text-slate-900 dark:text-slate-200 text-sm font-medium mb-2 block">Email</Label>
                <div className="relative flex items-center">
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    {...register('email')}
                    disabled={isLoading}
                    className="w-full text-sm pl-4 pr-10 py-6 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
                  />
                  <Mail className="w-5 h-5 text-slate-400 absolute right-4" />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="text-slate-900 dark:text-slate-200 text-sm font-medium mb-2 block">Contraseña</Label>
                <div className="relative flex items-center">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    disabled={isLoading}
                    className="w-full text-sm pl-4 pr-10 py-6 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
                  />
                  <Lock className="w-5 h-5 text-slate-400 absolute right-4" />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-slate-900 dark:text-slate-200 text-sm font-medium mb-2 block">Confirmar Contraseña</Label>
                <div className="relative flex items-center">
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                    disabled={isLoading}
                    className="w-full text-sm pl-4 pr-10 py-6 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
                  />
                  <Lock className="w-5 h-5 text-slate-400 absolute right-4" />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Crear Cuenta
              </Button>
            </form>

            <p className="text-sm mt-8 text-center text-slate-600 dark:text-slate-400">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/auth/login" className="text-indigo-600 font-medium hover:underline ml-1">
                Inicia sesión aquí
              </Link>
            </p>
          </div>

          {/* Image Section */}
          <div className="hidden lg:block relative h-full min-h-[600px] bg-slate-100 dark:bg-slate-800">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80"
                className="w-full h-full object-cover"
                alt="Register image"
              />
              <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-[2px]"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
              <div className="max-w-md text-white">
                <h2 className="text-4xl font-bold mb-6">Únete a VetHealth</h2>
                <p className="text-lg text-indigo-100 leading-relaxed">
                  Comienza hoy mismo a llevar el control de la salud de tus mascotas de forma profesional y segura.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
