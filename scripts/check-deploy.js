#!/usr/bin/env node

/**
 * Script de verificación pre-despliegue
 * Ejecutar: node scripts/check-deploy.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando preparación para despliegue...\n');

let errors = [];
let warnings = [];

// 1. Verificar que no haya archivos .env en el repo
const envFiles = ['.env', '.env.local', '.env.production'];
envFiles.forEach(file => {
  const envPath = path.join(__dirname, '..', file);
  if (fs.existsSync(envPath)) {
    warnings.push(`⚠️  Archivo ${file} encontrado. Asegúrate de no hacer commit de secretos.`);
  }
});

// 2. Verificar package.json
const packagePath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  if (!packageJson.scripts.build) {
    errors.push('❌ Script "build" no encontrado en package.json');
  }
  
  if (!packageJson.dependencies['next']) {
    errors.push('❌ Next.js no encontrado en dependencias');
  }
  
  if (!packageJson.dependencies['@supabase/supabase-js']) {
    errors.push('❌ Supabase client no encontrado en dependencias');
  }
}

// 3. Verificar next.config.ts
const configPath = path.join(__dirname, '..', 'next.config.ts');
if (!fs.existsSync(configPath)) {
  warnings.push('⚠️  next.config.ts no encontrado');
} else {
  const config = fs.readFileSync(configPath, 'utf8');
  if (!config.includes('remotePatterns')) {
    warnings.push('⚠️  No se encontró configuración de remotePatterns en next.config.ts');
  }
}

// 4. Verificar estructura de carpetas importantes
const requiredDirs = [
  'src/app',
  'src/components',
  'src/lib',
  'src/services'
];

requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    errors.push(`❌ Directorio requerido no encontrado: ${dir}`);
  }
});

// 5. Verificar archivos clave
const requiredFiles = [
  'src/lib/supabase-client.ts'
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    errors.push(`❌ Archivo requerido no encontrado: ${file}`);
  }
});

// 6. Verificar que .gitignore incluya .env
const gitignorePath = path.join(__dirname, '..', '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignore = fs.readFileSync(gitignorePath, 'utf8');
  if (!gitignore.includes('.env')) {
    warnings.push('⚠️  .gitignore no incluye .env');
  }
}

// Mostrar resultados
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ ¡Todo está listo para el despliegue!\n');
  console.log('📋 Próximos pasos:');
  console.log('   1. Ejecuta: npm run build');
  console.log('   2. Si compila sin errores, sigue el DEPLOY_PLAN.md');
  console.log('   3. Configura las variables de entorno en Vercel\n');
  process.exit(0);
}

if (errors.length > 0) {
  console.log('❌ ERRORES ENCONTRADOS:\n');
  errors.forEach(error => console.log(`   ${error}`));
  console.log('\n⚠️  Corrige estos errores antes de desplegar.\n');
}

if (warnings.length > 0) {
  console.log('⚠️  ADVERTENCIAS:\n');
  warnings.forEach(warning => console.log(`   ${warning}`));
  console.log('\n📝 Revisa estas advertencias, pero no son bloqueantes.\n');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

process.exit(errors.length > 0 ? 1 : 0);

