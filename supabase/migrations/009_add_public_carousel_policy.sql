-- Agregar política pública para el carrusel de mascotas
-- Esta política permite acceso de solo lectura a todas las mascotas para usuarios no autenticados
-- Solo para el carrusel público en la página principal

CREATE POLICY "Public can view pets for carousel" ON pets
  FOR SELECT USING (true);

-- Comentario: Esta política permite que usuarios no autenticados puedan ver
-- todas las mascotas para el carrusel público. Solo afecta a operaciones SELECT.
-- Los usuarios autenticados siguen teniendo control total sobre sus propias mascotas
-- gracias a las políticas existentes que tienen mayor prioridad.



