-- Script para eliminar la tabla other_treatments y todas sus referencias
-- ⚠️ ADVERTENCIA: Este script eliminará TODOS los datos de tratamientos existentes

-- Eliminar políticas RLS de la tabla other_treatments
DROP POLICY IF EXISTS "Users can view treatments of their pets" ON other_treatments;
DROP POLICY IF EXISTS "Users can insert treatments for their pets" ON other_treatments;
DROP POLICY IF EXISTS "Users can update treatments of their pets" ON other_treatments;
DROP POLICY IF EXISTS "Users can delete treatments of their pets" ON other_treatments;

-- Eliminar índices relacionados
DROP INDEX IF EXISTS idx_treatments_pet_id;

-- Eliminar la tabla other_treatments
DROP TABLE IF EXISTS other_treatments CASCADE;

-- Mostrar confirmación
SELECT 'Tabla other_treatments eliminada exitosamente' as status;














