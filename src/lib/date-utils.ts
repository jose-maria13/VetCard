/**
 * Utilidades para formatear fechas
 */

import { format } from 'date-fns'
import { es } from 'date-fns/locale'

/**
 * Formatea una fecha en formato español
 * @param date - Fecha en formato string o Date
 * @param formatStr - Formato deseado (por defecto: 'dd/MM/yyyy')
 * @returns Fecha formateada
 */
export function formatDate(date: string | Date, formatStr: string = 'dd/MM/yyyy'): string {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date
        return format(dateObj, formatStr, { locale: es })
    } catch (error) {
        return 'Fecha inválida'
    }
}

/**
 * Calcula los años transcurridos desde una fecha
 * @param date - Fecha de inicio
 * @returns Número de años
 */
export function getYearsSince(date: string | Date): number {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const today = new Date()
    return today.getFullYear() - dateObj.getFullYear()
}

/**
 * Calcula los meses transcurridos desde una fecha
 * @param date - Fecha de inicio
 * @returns Número de meses
 */
export function getMonthsSince(date: string | Date): number {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const today = new Date()
    return (today.getFullYear() - dateObj.getFullYear()) * 12 +
        (today.getMonth() - dateObj.getMonth())
}

/**
 * Verifica si una fecha está en el pasado
 * @param date - Fecha a verificar
 * @returns true si la fecha está en el pasado
 */
export function isPast(date: string | Date): boolean {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj < new Date()
}

/**
 * Verifica si una fecha está en el futuro
 * @param date - Fecha a verificar
 * @returns true si la fecha está en el futuro
 */
export function isFuture(date: string | Date): boolean {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj > new Date()
}
