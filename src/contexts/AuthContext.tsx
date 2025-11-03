'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { User, AuthContextType } from '@/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ? {
        id: session.user.id,
        email: session.user.email!,
        created_at: session.user.created_at
      } : null)
      setLoading(false)
    }

    getInitialSession()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ? {
          id: session.user.id,
          email: session.user.email!,
          created_at: session.user.created_at
        } : null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      // Traducir errores comunes de Supabase sin lanzar el error original
      let errorMessage = 'Error al iniciar sesión'
      
      switch (error.message) {
        case 'Invalid login credentials':
          errorMessage = 'Email o contraseña incorrectos'
          break
        case 'Email not confirmed':
          errorMessage = 'Por favor, confirma tu email antes de iniciar sesión'
          break
        case 'Too many requests':
          errorMessage = 'Demasiados intentos. Por favor, espera un momento'
          break
        default:
          errorMessage = error.message || 'Error al iniciar sesión'
      }
      
      // Crear un error completamente nuevo sin referencia al error original
      // Esto evita que Next.js muestre el stack trace del error de Supabase
      const authError: Error = new Error(errorMessage)
      // Establecer el nombre del error
      Object.defineProperty(authError, 'name', {
        value: 'AuthenticationError',
        writable: false,
        enumerable: false,
        configurable: true
      })
      // Limpiar el stack trace para que comience desde aquí
      if (Error.captureStackTrace) {
        Error.captureStackTrace(authError, signIn)
      }
      
      throw authError
    }
    
    console.log('✅ Inicio de sesión exitoso:', data.user?.email)
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    // Redirigir a la página principal después de cerrar sesión
    window.location.href = '/'
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

