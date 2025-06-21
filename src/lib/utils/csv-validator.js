import { getColumnMappingsFromEnv, findColumnName } from "../config/csv-columns";

/**
 * Validates a CSV file and provides feedback about column mapping
 * @param {string} csvText - The CSV content as text
 * @returns {Object} Validation result with mapping information
 */
export function validateCSV(csvText) {
  try {
    const { parse } = require("papaparse");
    const { data, meta, errors } = parse(csvText, { 
      header: true, 
      skipEmptyLines: true,
      preview: 5 // Only parse first 5 rows for validation
    });
    
    const headers = meta.fields || [];
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
    
    // Check for parsing errors
    const hasErrors = errors && errors.length > 0;
    if (hasErrors) {
      errors.forEach(error => {
        validationErrors.push(`CSV parsing error: ${error.message}`);
      });
    }
    
    // Check if we have any data
    if (!data || data.length === 0) {
      validationErrors.push("No data found in CSV file. Please ensure the file contains at least one row of data.");
    }
    
    // Determine overall validation status
    const isValid = !hasErrors && 
                   data.length > 0 && 
                   missingRequiredColumns.length === 0;
    
    return {
      isValid: isValid,
      headers: headers,
      rowCount: data.length,
      mappingAnalysis: mappingAnalysis,
      unmappedColumns: unmappedColumns,
      mappedColumns: mappedColumns,
      missingRequiredColumns: missingRequiredColumns,
      validationErrors: validationErrors,
      errors: errors || [],
      sampleData: data.slice(0, 3), // First 3 rows for preview
      columnMappings: columnMappings
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
      validationErrors: [`File parsing error: ${error.message}`],
      errors: [error.message]
    };
  }
}

/**
 * Generates a sample CSV template based on current column mappings
 * @returns {string} CSV template string
 */
export function generateCSVTemplate() {
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
  
  return [headers.join(','), templateRow.join(',')].join('\n');
}

/**
 * Provides suggestions for environment variable configuration based on CSV headers
 * @param {Array} headers - CSV headers
 * @returns {Object} Suggested environment variable configurations
 */
export function suggestColumnMappings(headers) {
  const suggestions = {};
  
  // Common patterns for each field
  const patterns = {
    news_title: ['title', 'headline', 'article', 'news'],
    category: ['category', 'section', 'topic', 'type'],
    source_link: ['link', 'url', 'source', 'reference'],
    date: ['date', 'published', 'created', 'time'],
    news_content: ['content', 'body', 'text', 'description', 'summary']
  };
  
  Object.keys(patterns).forEach(field => {
    const matchingHeaders = headers.filter(header => 
      patterns[field].some(pattern => 
        header.toLowerCase().includes(pattern.toLowerCase())
      )
    );
    
    if (matchingHeaders.length > 0) {
      suggestions[field] = {
        envKey: `CSV_${field.toUpperCase()}_COLUMNS`,
        suggestedValue: matchingHeaders.join(','),
        matchingHeaders: matchingHeaders
      };
    }
  });
  
  return suggestions;
}

/**
 * Client-side CSV validation function
 * This can be used to validate CSV files before uploading
 * @param {File} file - The CSV file to validate
 * @returns {Promise<Object>} Validation result
 */
export async function validateCSVFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csvText = e.target.result;
        const validation = validateCSV(csvText);
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
        validationErrors: ["Failed to read CSV file. Please ensure it's a valid CSV file."],
        errors: ["File read error"]
      });
    };
    
    reader.readAsText(file);
  });
} 