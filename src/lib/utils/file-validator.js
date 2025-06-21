import { validateCSV, validateCSVFile, generateCSVTemplate } from './csv-validator';
import { validateExcel, validateExcelFile, generateExcelTemplate } from './excel-validator';

/**
 * Unified file validation function that handles both CSV and Excel files
 * @param {File} file - The file to validate
 * @returns {Promise<Object>} Validation result
 */
export async function validateFile(file) {
  const fileExtension = file.name.toLowerCase().split('.').pop();
  
  switch (fileExtension) {
    case 'csv':
      return await validateCSVFile(file);
    case 'xlsx':
    case 'xls':
      return await validateExcelFile(file);
    default:
      return {
        isValid: false,
        error: "Unsupported file type",
        headers: [],
        rowCount: 0,
        mappingAnalysis: {},
        unmappedColumns: [],
        mappedColumns: [],
        missingRequiredColumns: [],
        validationErrors: [`Unsupported file type: ${fileExtension}. Please upload a CSV (.csv) or Excel (.xlsx, .xls) file.`],
        errors: ["Unsupported file type"]
      };
  }
}

/**
 * Unified template generation function
 * @param {string} format - 'csv' or 'excel'
 * @returns {string|ArrayBuffer} Template file
 */
export function generateTemplate(format = 'csv') {
  switch (format.toLowerCase()) {
    case 'csv':
      return generateCSVTemplate();
    case 'excel':
    case 'xlsx':
      return generateExcelTemplate();
    default:
      throw new Error('Unsupported template format');
  }
}

/**
 * Get supported file types for upload
 * @returns {Array} Array of supported file extensions
 */
export function getSupportedFileTypes() {
  return ['.csv', '.xlsx', '.xls'];
}

/**
 * Get accepted file types for input element
 * @returns {string} Comma-separated list of accepted file types
 */
export function getAcceptedFileTypes() {
  return '.csv,.xlsx,.xls';
}

/**
 * Check if file type is supported
 * @param {string} fileName - The file name to check
 * @returns {boolean} True if file type is supported
 */
export function isFileTypeSupported(fileName) {
  const fileExtension = fileName.toLowerCase().split('.').pop();
  return ['csv', 'xlsx', 'xls'].includes(fileExtension);
} 