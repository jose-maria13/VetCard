-- Crear extensión para UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla de usuarios (si no existe)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de mascotas
CREATE TABLE IF NOT EXISTS pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL DEFAULT 'dog',
  breed TEXT,
  birth_date DATE,
  weight DECIMAL(5,2),
  color TEXT,
  photo_url TEXT,
  microchip_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de vacunas
CREATE TABLE IF NOT EXISTS vaccines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  vaccine_name TEXT NOT NULL,
  vaccine_type TEXT NOT NULL DEFAULT 'obligatoria',
  date_applied DATE NOT NULL,
  next_dose_date DATE,
  veterinarian TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de desparasitaciones
CREATE TABLE IF NOT EXISTS dewormings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_type TEXT NOT NULL DEFAULT 'interno',
  date_applied DATE NOT NULL,
  next_date DATE,
  veterinarian TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de consultas médicas
CREATE TABLE IF NOT EXISTS medical_consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  consultation_type TEXT NOT NULL DEFAULT 'rutina',
  date DATE NOT NULL,
  reason TEXT NOT NULL,
  diagnosis TEXT,
  treatment TEXT,
  veterinarian TEXT,
  cost DECIMAL(10,2),
  notes TEXT,
  next_appointment DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de otros tratamientos
CREATE TABLE IF NOT EXISTS other_treatments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  treatment_name TEXT NOT NULL,
  treatment_type TEXT NOT NULL,
  application_date DATE NOT NULL,
  veterinarian TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccines ENABLE ROW LEVEL SECURITY;
ALTER TABLE dewormings ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE other_treatments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para la tabla pets
CREATE POLICY "Users can view their own pets" ON pets
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own pets" ON pets
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own pets" ON pets
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own pets" ON pets
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Políticas RLS para la tabla vaccines
CREATE POLICY "Users can view vaccines of their pets" ON vaccines
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = vaccines.pet_id 
      AND pets.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert vaccines for their pets" ON vaccines
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = vaccines.pet_id 
      AND pets.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can update vaccines of their pets" ON vaccines
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = vaccines.pet_id 
      AND pets.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete vaccines of their pets" ON vaccines
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = vaccines.pet_id 
      AND pets.user_id::text = auth.uid()::text
    )
  );

-- Políticas RLS para la tabla dewormings
CREATE POLICY "Users can view dewormings of their pets" ON dewormings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = dewormings.pet_id 
      AND pets.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert dewormings for their pets" ON dewormings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = dewormings.pet_id 
      AND pets.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can update dewormings of their pets" ON dewormings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = dewormings.pet_id 
      AND pets.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete dewormings of their pets" ON dewormings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = dewormings.pet_id 
      AND pets.user_id::text = auth.uid()::text
    )
  );

-- Políticas RLS para la tabla medical_consultations
CREATE POLICY "Users can view consultations of their pets" ON medical_consultations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = medical_consultations.pet_id 
      AND pets.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert consultations for their pets" ON medical_consultations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = medical_consultations.pet_id 
      AND pets.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can update consultations of their pets" ON medical_consultations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = medical_consultations.pet_id 
      AND pets.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete consultations of their pets" ON medical_consultations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = medical_consultations.pet_id 
      AND pets.user_id::text = auth.uid()::text
    )
  );

-- Políticas RLS para la tabla other_treatments
CREATE POLICY "Users can view treatments of their pets" ON other_treatments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = other_treatments.pet_id 
      AND pets.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert treatments for their pets" ON other_treatments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = other_treatments.pet_id 
      AND pets.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can update treatments of their pets" ON other_treatments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = other_treatments.pet_id 
      AND pets.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete treatments of their pets" ON other_treatments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = other_treatments.pet_id 
      AND pets.user_id::text = auth.uid()::text
    )
  );

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_pets_user_id ON pets(user_id);
CREATE INDEX IF NOT EXISTS idx_vaccines_pet_id ON vaccines(pet_id);
CREATE INDEX IF NOT EXISTS idx_dewormings_pet_id ON dewormings(pet_id);
CREATE INDEX IF NOT EXISTS idx_consultations_pet_id ON medical_consultations(pet_id);
CREATE INDEX IF NOT EXISTS idx_treatments_pet_id ON other_treatments(pet_id);

-- Crear bucket de almacenamiento para fotos de mascotas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pet-photos', 'pet-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Política para el bucket de fotos
CREATE POLICY "Users can upload pet photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'pet-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view pet photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'pet-photos');

CREATE POLICY "Users can update their pet photos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'pet-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their pet photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'pet-photos' AND auth.role() = 'authenticated');














