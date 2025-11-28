'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Lock, CheckSquare, Square, ArrowLeft } from 'lucide-react'
import Logo from '@/components/Logo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('El email no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rememberMe: z.boolean().optional(),
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false
    }
  })

  const rememberMe = watch('rememberMe')

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setError('')
      await signIn(data.email, data.password)
      setTimeout(() => {
        router.push('/dashboard')
      }, 100)
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
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
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Bienvenido de nuevo</h1>
              <p className="text-slate-600 dark:text-slate-400">Ingresa tus datos para acceder a tu cuenta.</p>
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

              <div className="flex flex-wrap items-center gap-4 justify-between">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => setValue('rememberMe', !rememberMe)}
                >
                  {rememberMe ? (
                    <CheckSquare className="h-5 w-5 text-indigo-600" />
                  ) : (
                    <Square className="h-5 w-5 text-slate-400" />
                  )}
                  <label className="ml-2 block text-sm text-slate-900 dark:text-slate-300 cursor-pointer select-none">
                    Recordarme
                  </label>
                </div>
                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="text-indigo-600 font-medium hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Iniciar Sesión
              </Button>
            </form>

            <p className="text-sm mt-8 text-center text-slate-600 dark:text-slate-400">
              ¿No tienes una cuenta?{' '}
              <Link href="/auth/register" className="text-indigo-600 font-medium hover:underline ml-1">
                Regístrate aquí
              </Link>
            </p>
          </div>

          {/* Image Section */}
          <div className="hidden lg:block relative h-full min-h-[600px] bg-slate-100 dark:bg-slate-800">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1551730459-92db2a308d6a?w=800&q=80"
                className="w-full h-full object-cover"
                alt="Login image"
              />
              <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-[2px]"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
              <div className="max-w-md text-white">
                <h2 className="text-4xl font-bold mb-6">Tu mascota en las mejores manos</h2>
                <p className="text-lg text-indigo-100 leading-relaxed">
                  Accede a todo el historial médico, recordatorios y más. Porque ellos se merecen el mejor cuidado.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
