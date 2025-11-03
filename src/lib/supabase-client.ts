import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Intentar obtener las variables de entorno de múltiples formas
  const supabaseUrl = 
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    (typeof window !== 'undefined' ? (window as any).__ENV__?.NEXT_PUBLIC_SUPABASE_URL : undefined)

  const supabaseAnonKey = 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    (typeof window !== 'undefined' ? (window as any).__ENV__?.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined)

  // Debug temporal - eliminar después de solucionar
  if (typeof window !== 'undefined') {
    console.log('🔍 Debug env vars:', {
      url: supabaseUrl ? '✅ Presente' : '❌ Faltante',
      key: supabaseAnonKey ? '✅ Presente' : '❌ Faltante',
      envKeys: Object.keys(process.env).filter(k => k.includes('SUPABASE'))
    })
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      `Missing Supabase environment variables. 
      URL: ${supabaseUrl ? 'OK' : 'MISSING'}
      Key: ${supabaseAnonKey ? 'OK' : 'MISSING'}
      
      Por favor, asegúrate de que el archivo .env.local existe en la raíz del proyecto
      y contiene:
      NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
      NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key`
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
