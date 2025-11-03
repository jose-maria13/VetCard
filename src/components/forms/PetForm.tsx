'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload, X, Heart } from 'lucide-react'
import { PetFormData } from '@/types'
import { PET_SPECIES, DOG_BREEDS, CAT_BREEDS, PET_COLORS } from '@/constants'

const petSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  species: z.string().min(1, 'La especie es obligatoria'),
  breed: z.string().optional(),
  birth_date: z.string().optional(),
  weight: z.string().optional(),
  color: z.string().optional(),
})

type PetFormValues = z.infer<typeof petSchema>

interface PetFormProps {
  initialData?: Partial<PetFormData>
  onSubmit: (data: PetFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export default function PetForm({ initialData, onSubmit, onCancel, isLoading = false }: PetFormProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [breedOpen, setBreedOpen] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: initialData?.name || '',
      species: initialData?.species || 'dog',
      breed: initialData?.breed || '',
      birth_date: initialData?.birth_date || '',
      weight: initialData?.weight || undefined,
      color: initialData?.color || '',
    },
  })

  const selectedSpecies = watch('species')

  // Cargar foto existente cuando se inicializa el formulario
  useEffect(() => {
    if (initialData?.photo_url) {
      setPhotoPreview(initialData.photo_url)
    }
  }, [initialData?.photo_url])

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('El archivo es demasiado grande. Máximo 5MB.')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Solo se permiten archivos de imagen.')
        return
      }

      setPhotoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  const removePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  const onFormSubmit = async (data: PetFormValues) => {
    try {
      setError('')
      await onSubmit({
        ...data,
        photo: photoFile || undefined,
      })
    } catch (err: any) {
      setError(err.message || 'Error al guardar la mascota')
    }
  }

  const getBreedOptions = () => {
    switch (selectedSpecies) {
      case 'dog':
        return DOG_BREEDS
      case 'cat':
        return CAT_BREEDS
      default:
        return ['Otra']
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-blue-600" />
          <span>{initialData ? 'Editar Mascota' : 'Nueva Mascota'}</span>
        </CardTitle>
        <CardDescription>
          {initialData ? 'Actualiza la información de tu mascota' : 'Registra una nueva mascota en tu carnet digital'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Foto de la mascota */}
          <div className="space-y-2">
            <Label>Foto de la mascota</Label>
            <div className="flex items-center space-x-4">
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removePhoto}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-20 h-20 bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <Label htmlFor="photo" className="cursor-pointer">
                  <div className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-muted">
                    <Upload className="h-4 w-4" />
                    <span>Subir foto</span>
                  </div>
                </Label>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG o WebP. Máximo 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              placeholder="Ej: Max, Luna, Rocky..."
              {...register('name')}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Especie */}
          <div className="space-y-2">
            <Label htmlFor="species">Especie *</Label>
            <Select
              value={selectedSpecies}
              onValueChange={(value) => setValue('species', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona la especie" />
              </SelectTrigger>
              <SelectContent>
                {PET_SPECIES.map((species) => (
                  <SelectItem key={species.value} value={species.value}>
                    {species.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.species && (
              <p className="text-sm text-red-600">{errors.species.message}</p>
            )}
          </div>

          {/* Raza */}
          <div className="space-y-2">
            <Label htmlFor="breed">Raza</Label>
            <Popover open={breedOpen} onOpenChange={setBreedOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={breedOpen}
                  className="w-full justify-between"
                  disabled={isLoading}
                >
                  {watch('breed') || 'Selecciona o escribe la raza...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Buscar o escribir raza..." 
                    value={watch('breed') || ''}
                    onValueChange={(value) => setValue('breed', value)}
                  />
                  <CommandList>
                    <CommandEmpty>
                      <div className="py-2 text-center text-sm text-muted-foreground">
                         Escribe tu raza y haz click en el campo de raza para seleccionarla 
                      </div>
                    </CommandEmpty>
                    <CommandGroup>
                      {getBreedOptions().map((breed) => (
                        <CommandItem
                          key={breed}
                          value={breed}
                          onSelect={(currentValue) => {
                            setValue('breed', currentValue)
                            setBreedOpen(false)
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              watch('breed') === breed ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                          {breed}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Fecha de nacimiento */}
          <div className="space-y-2">
            <Label htmlFor="birth_date">Fecha de nacimiento</Label>
            <Input
              id="birth_date"
              type="date"
              {...register('birth_date')}
              disabled={isLoading}
            />
          </div>

          {/* Peso y Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="Ej: 15.5"
                {...register('weight')}
                disabled={isLoading}
              />
              {errors.weight && (
                <p className="text-sm text-red-600">{errors.weight.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Select
                value={watch('color') || ''}
                onValueChange={(value) => setValue('color', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el color" />
                </SelectTrigger>
                <SelectContent>
                  {PET_COLORS.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>


          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? 'Actualizar' : 'Crear'} Mascota
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}


