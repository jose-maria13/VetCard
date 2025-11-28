/**
 * Utilidades para formatear y procesar datos de mascotas
 */

// Mapeo de especies a sus etiquetas y emojis
export const SPECIES_MAP: Record<string, { label: string; emoji: string }> = {
    dog: { label: 'Perro', emoji: '🐕' },
    cat: { label: 'Gato', emoji: '🐱' },
    bird: { label: 'Ave', emoji: '🐦' },
    rabbit: { label: 'Conejo', emoji: '🐰' },
    hamster: { label: 'Hámster', emoji: '🐹' },
    other: { label: 'Otro', emoji: '🐾' }
}

/**
 * Obtiene la etiqueta de una especie con su emoji
 * @param species - Código de la especie (dog, cat, etc.)
 * @returns Etiqueta formateada con emoji (ej: "🐕 Perro")
 */
export function getSpeciesLabel(species: string): string {
    const speciesData = SPECIES_MAP[species]
    if (speciesData) {
        return `${speciesData.emoji} ${speciesData.label}`
    }
    return '🐾 Mascota'
}

/**
 * Obtiene solo el emoji de una especie
 * @param species - Código de la especie
 * @returns Emoji correspondiente
 */
export function getSpeciesEmoji(species: string): string {
    return SPECIES_MAP[species]?.emoji || '🐾'
}

/**
 * Obtiene solo el nombre de una especie (sin emoji)
 * @param species - Código de la especie
 * @returns Nombre de la especie
 */
export function getSpeciesName(species: string): string {
    return SPECIES_MAP[species]?.label || 'Mascota'
}

/**
 * Calcula la edad de una mascota a partir de su fecha de nacimiento
 * @param birthDate - Fecha de nacimiento en formato string
 * @returns Edad formateada (ej: "2 años 3 meses", "11 meses")
 */
export function getAge(birthDate: string | null): string {
    if (!birthDate) return 'Edad no especificada'

    const birth = new Date(birthDate)
    const today = new Date()
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 +
        (today.getMonth() - birth.getMonth())

    if (ageInMonths < 12) {
        return `${ageInMonths} ${ageInMonths === 1 ? 'mes' : 'meses'}`
    } else {
        const years = Math.floor(ageInMonths / 12)
        const months = ageInMonths % 12
        if (months > 0) {
            return `${years} ${years === 1 ? 'año' : 'años'} ${months} ${months === 1 ? 'mes' : 'meses'}`
        }
        return `${years} ${years === 1 ? 'año' : 'años'}`
    }
}

// Mapeo de nombres de colores a códigos hexadecimales
export const PET_COLORS: Record<string, string> = {
    // Colores básicos
    'blanco': '#FFFFFF',
    'white': '#FFFFFF',
    'negro': '#000000',
    'black': '#000000',
    'gris': '#808080',
    'gray': '#808080',
    'gris claro': '#D3D3D3',
    'light gray': '#D3D3D3',
    'gris oscuro': '#A9A9A9',
    'dark gray': '#A9A9A9',

    // Colores primarios
    'rojo': '#FF0000',
    'red': '#FF0000',
    'azul': '#0000FF',
    'blue': '#0000FF',
    'verde': '#008000',
    'green': '#008000',
    'amarillo': '#FFFF00',
    'yellow': '#FFFF00',

    // Colores secundarios
    'naranja': '#FFA500',
    'orange': '#FFA500',
    'rosa': '#FFC0CB',
    'pink': '#FFC0CB',
    'morado': '#800080',
    'purple': '#800080',
    'marrón': '#A52A2A',
    'brown': '#A52A2A',
    'beige': '#F5F5DC',
    'crema': '#FFFDD0',
    'cream': '#FFFDD0',

    // Colores específicos de mascotas
    'dorado': '#FFD700',
    'golden': '#FFD700',
    'plateado': '#C0C0C0',
    'silver': '#C0C0C0',
    'chocolate': '#7B3F00',
    'canela': '#D2691E',
    'cinnamon': '#D2691E',
    'atigrado': '#8B4513',
    'tabby': '#8B4513',
    'tricolor': '#8B4513',
    'tortuga': '#8B4513',
    'tortoiseshell': '#8B4513',

    // Colores mixtos comunes
    'blanco y negro': '#FFFFFF',
    'white and black': '#FFFFFF',
    'negro y blanco': '#000000',
    'black and white': '#000000',
    'marrón y blanco': '#A52A2A',
    'brown and white': '#A52A2A',
    'blanco y marrón': '#FFFFFF',
    'white and brown': '#FFFFFF',
}

/**
 * Obtiene el código hexadecimal de un color
 * @param colorName - Nombre del color
 * @returns Código hexadecimal del color
 */
export function getColorHex(colorName: string): string {
    const normalizedColor = colorName.toLowerCase().trim()
    return PET_COLORS[normalizedColor] || '#808080' // Gris por defecto
}
