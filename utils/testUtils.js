import fs from 'fs';
import path from 'path';

class TestErrorLogger {
  constructor() {
    this.errors = [];
    this.filename = `test-errors-${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
  }

  addError(testName, error) {
    const errorEntry = {
      testName,
      error: error.message || error,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
    this.errors.push(errorEntry);
  }

  saveErrorsToFile() {
    if (this.errors.length === 0) {
      return null;
    }

    const errorContent = this.generateErrorContent();
    const filePath = path.join(process.cwd(), 'test-results', this.filename);

    // Asegurarse de que el directorio existe
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, errorContent);
    return filePath;
  }

  generateErrorContent() {
    let content = `REPORTE DE ERRORES EN TESTS\n`;
    content += `Fecha: ${new Date().toLocaleString()}\n`;
    content += `Total de errores: ${this.errors.length}\n`;
    content += '='.repeat(50) + '\n\n';

    this.errors.forEach((error, index) => {
      content += `ERROR ${index + 1}:\n`;
      content += `Test: ${error.testName}\n`;
      content += `Timestamp: ${error.timestamp}\n`;
      content += `Mensaje: ${error.error}\n`;

      if (error.stack) {
        content += `Stack Trace:\n${error.stack}\n`;
      }

      content += '-'.repeat(30) + '\n\n';
    });

    return content;
  }

  clearErrors() {
    this.errors = [];
  }

  getErrorCount() {
    return this.errors.length;
  }
}

export const testErrorLogger = new TestErrorLogger();