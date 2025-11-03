#!/usr/bin/env node

/**
 * Script para verificar y recrear .env.local correctamente
 */

const fs = require('fs');
const path = require('path');

const envLocalPath = path.join(__dirname, '..', '.env.local');
const envExamplePath = path.join(__dirname, '..', 'env.example');

console.log('🔧 Verificando configuración de variables de entorno...\n');

// Leer el archivo actual si existe
let currentContent = '';
if (fs.existsSync(envLocalPath)) {
  currentContent = fs.readFileSync(envLocalPath, 'utf8');
  console.log('✅ Archivo .env.local existe\n');
  console.log('Contenido actual:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(currentContent);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
} else {
  console.log('❌ Archivo .env.local NO existe\n');
}

// Verificar formato
const hasUrl = /NEXT_PUBLIC_SUPABASE_URL\s*=/i.test(currentContent);
const hasKey = /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/i.test(currentContent);

if (hasUrl && hasKey) {
  console.log('✅ Variables encontradas en el archivo\n');
  
  // Verificar que no estén vacías
  const urlMatch = currentContent.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.+)/i);
  const keyMatch = currentContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.+)/i);
  
  const urlValue = urlMatch ? urlMatch[1].trim() : '';
  const keyValue = keyMatch ? keyMatch[1].trim() : '';
  
  if (urlValue && urlValue !== 'https://tu-proyecto-id.supabase.co') {
    console.log(`✅ URL configurada: ${urlValue.substring(0, 30)}...`);
  } else {
    console.log('⚠️  URL no está configurada correctamente');
  }
  
  if (keyValue && keyValue.startsWith('eyJ')) {
    console.log(`✅ Key configurada: ${keyValue.substring(0, 30)}...`);
  } else {
    console.log('⚠️  Key no está configurada correctamente');
  }
  
  console.log('\n📝 RECOMENDACIONES:');
  console.log('1. Detén el servidor (Ctrl+C)');
  console.log('2. Elimina la carpeta .next: Remove-Item -Recurse -Force .next');
  console.log('3. Reinicia: npm run dev');
  console.log('4. Si el error persiste, verifica que el archivo .env.local');
  console.log('   esté en la raíz del proyecto (vetcard/.env.local)');
  
} else {
  console.log('❌ Variables no encontradas correctamente\n');
  console.log('📝 INSTRUCCIONES:');
  console.log('1. Abre tu proyecto en Supabase Dashboard');
  console.log('2. Ve a Settings → API');
  console.log('3. Copia la Project URL y anon public key');
  console.log('4. Crea o edita .env.local con:');
  console.log('\nNEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key-aqui\n');
}

// Verificar ubicación
const projectRoot = path.join(__dirname, '..');
const packageJsonPath = path.join(projectRoot, 'package.json');

if (fs.existsSync(packageJsonPath)) {
  console.log(`✅ Ubicación correcta: ${projectRoot}\n`);
} else {
  console.log(`❌ ERROR: El archivo no está en la raíz del proyecto!\n`);
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');


