import { getColumnMappingsFromEnv, findColumnName } from "../config/csv-columns";

/**
 * Validates an Excel file and provides feedback about column mapping
 * @param {ArrayBuffer} fileBuffer - The Excel file as ArrayBuffer
 * @returns {Object} Validation result with mapping information
 */
export function validateExcel(fileBuffer) {
  try {
    const XLSX = require('xlsx');
    
    // Read the workbook
    const workbook = XLSX.read(fileBuffer, { type: 'array' });
    
    // Get the first worksheet
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return {
        isValid: false,
        error: "No worksheets found in Excel file",
        headers: [],
        rowCount: 0,
        mappingAnalysis: {},
        unmappedColumns: [],
        mappedColumns: [],
        missingRequiredColumns: [],
        validationErrors: ["No worksheets found in Excel file"],
        errors: ["No worksheets found"]
      };
    }
    
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON with headers
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (!jsonData || jsonData.length === 0) {
      return {
        isValid: false,
        error: "No data found in Excel file",
        headers: [],
        rowCount: 0,
        mappingAnalysis: {},
        unmappedColumns: [],
        mappedColumns: [],
        missingRequiredColumns: [],
        validationErrors: ["No data found in Excel file"],
        errors: ["No data found"]
      };
    }
    
    // Extract headers (first row)
    const headers = jsonData[0] || [];
    
    // Extract data rows (skip header row)
    const dataRows = jsonData.slice(1).filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''));
    
    if (dataRows.length === 0) {
      return {
        isValid: false,
        error: "No data rows found in Excel file",
        headers: headers,
        rowCount: 0,
        mappingAnalysis: {},
        unmappedColumns: [],
        mappedColumns: [],
        missingRequiredColumns: [],
        validationErrors: ["No data rows found in Excel file"],
        errors: ["No data rows"]
      };
    }
    
    const columnMappings = getColumnMappingsFromEnv();
    
    // Analyze column mapping
    const mappingAnalysis = {};
    const unmappedColumns = [];
    const mappedColumns = [];
    const validationErrors = [];
    const missingRequiredColumns = [];
    
    // Define required columns
    const requiredColumns = ['news_title', 'category', 'source_link', 'date'];
    const optionalColumns = ['news_content'];
    
    Object.keys(columnMappings).forEach(field => {
      const possibleNames = columnMappings[field];
      const foundColumn = findColumnName(headers, possibleNames);
      
      if (foundColumn) {
        mappingAnalysis[field] = {
          found: true,
          columnName: foundColumn,
          possibleNames: possibleNames
        };
        mappedColumns.push(foundColumn);
      } else {
        mappingAnalysis[field] = {
          found: false,
          possibleNames: possibleNames
        };
        
        // Check if this is a required column
        if (requiredColumns.includes(field)) {
          missingRequiredColumns.push({
            field: field,
            possibleNames: possibleNames
          });
          validationErrors.push(`Missing required column: "${field}". Expected one of: ${possibleNames.join(', ')}`);
        }
      }
    });
    
    // Find unmapped columns
    headers.forEach(header => {
      if (!mappedColumns.includes(header)) {
        unmappedColumns.push(header);
        validationErrors.push(`Unrecognized column: "${header}". This column will be ignored during import.`);
      }
    });
    
    // Check if we have any data
    if (dataRows.length === 0) {
      validationErrors.push("No data found in Excel file. Please ensure the file contains at least one row of data.");
    }
    
    // Determine overall validation status
    const isValid = dataRows.length > 0 && missingRequiredColumns.length === 0;
    
    // Convert data rows to objects for sample data
    const sampleData = dataRows.slice(0, 3).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
    
    return {
      isValid: isValid,
      headers: headers,
      rowCount: dataRows.length,
      mappingAnalysis: mappingAnalysis,
      unmappedColumns: unmappedColumns,
      mappedColumns: mappedColumns,
      missingRequiredColumns: missingRequiredColumns,
      validationErrors: validationErrors,
      errors: [],
      sampleData: sampleData,
      columnMappings: columnMappings,
      worksheet: worksheet,
      workbook: workbook
    };
  } catch (error) {
    return {
      isValid: false,
      error: error.message,
      headers: [],
      rowCount: 0,
      mappingAnalysis: {},
      unmappedColumns: [],
      mappedColumns: [],
      missingRequiredColumns: [],
      validationErrors: [`Excel parsing error: ${error.message}`],
      errors: [error.message]
    };
  }
}

/**
 * Generates a sample Excel template based on current column mappings
 * @returns {ArrayBuffer} Excel file as ArrayBuffer
 */
export function generateExcelTemplate() {
  try {
    const XLSX = require('xlsx');
    const columnMappings = getColumnMappingsFromEnv();
    
    // Use the first (primary) column name for each field
    const headers = Object.keys(columnMappings).map(field => 
      columnMappings[field][0]
    );
    
    const templateRow = headers.map(header => {
      switch (header) {
        case 'news_title':
          return 'Sample Article Title';
        case 'category':
          return 'Health';
        case 'source_link':
          return 'https://example.com/article';
        case 'date':
          return '2024-01-15';
        case 'news_content':
          return 'This is a sample article content...';
        default:
          return 'Sample Data';
      }
    });
    
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([headers, templateRow]);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Articles');
    
    // Generate Excel file as ArrayBuffer
    const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    
    return excelBuffer;
  } catch (error) {
    console.error('Error generating Excel template:', error);
    throw new Error('Failed to generate Excel template');
  }
}

/**
 * Client-side Excel validation function
 * This can be used to validate Excel files before uploading
 * @param {File} file - The Excel file to validate
 * @returns {Promise<Object>} Validation result
 */
export async function validateExcelFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target.result;
        const validation = validateExcel(arrayBuffer);
        resolve(validation);
      } catch (error) {
        resolve({
          isValid: false,
          error: error.message,
          headers: [],
          rowCount: 0,
          mappingAnalysis: {},
          unmappedColumns: [],
          mappedColumns: [],
          missingRequiredColumns: [],
          validationErrors: [`File validation error: ${error.message}`],
          errors: [error.message]
        });
      }
    };
    
    reader.onerror = () => {
      resolve({
        isValid: false,
        error: "Failed to read file",
        headers: [],
        rowCount: 0,
        mappingAnalysis: {},
        unmappedColumns: [],
        mappedColumns: [],
        missingRequiredColumns: [],
        validationErrors: ["Failed to read Excel file. Please ensure it's a valid Excel file."],
        errors: ["File read error"]
      });
    };
    
    reader.readAsArrayBuffer(file);
  });
} 