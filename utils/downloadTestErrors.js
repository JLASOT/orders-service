import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Para manejar __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function listTestErrorFiles() {
  const testResultsDir = path.join(process.cwd(), 'test-results');

  if (!fs.existsSync(testResultsDir)) {
    console.log('❌ No hay archivos de errores disponibles');
    return [];
  }

  const files = fs.readdirSync(testResultsDir)
    .filter(file => file.startsWith('test-errors-') && file.endsWith('.txt'))
    .sort()
    .reverse(); // Los más recientes primero

  return files.map(file => ({
    filename: file,
    path: path.join(testResultsDir, file),
    date: file.replace('test-errors-', '').replace('.txt', '')
  }));
}

function downloadErrorFile(filename) {
  const filePath = path.join(process.cwd(), 'test-results', filename);

  if (!fs.existsSync(filePath)) {
    console.log('❌ Archivo no encontrado');
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  return content;
}

function showLatestError() {
  const files = listTestErrorFiles();

  if (files.length === 0) {
    console.log('✅ No hay archivos de errores de tests');
    return;
  }

  const latestFile = files[0];
  console.log(`\n📁 ARCHIVO DE ERRORES MÁS RECIENTE:`);
  console.log(`📄 Nombre: ${latestFile.filename}`);
  console.log(`🕐 Fecha: ${latestFile.date}`);
  console.log('='.repeat(60));

  const content = downloadErrorFile(latestFile.filename);
  if (content) {
    console.log(content);
  }

  console.log('\n📋 Todos los archivos de errores disponibles:');
  files.forEach((file, index) => {
    console.log(`${index + 1}. ${file.filename}`);
  });
}

// Ejecutar si se llama directamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  showLatestError();
}

export { listTestErrorFiles, downloadErrorFile, showLatestError };