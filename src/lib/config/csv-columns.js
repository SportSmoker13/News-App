// CSV Column Configuration
// This file defines the mapping between database fields and possible CSV column names
// Environment variables can override these mappings

const DEFAULT_COLUMN_MAPPINGS = {
  news_title: [
    'news_title',
    'title',
    'headline',
    'article_title',
    'news_headline',
    'NEWS TITLE'
  ],
  category: [
    'category',
    'section',
    'topic',
    'news_category',
    'article_category',
    'CATEGORY'
  ],
  source_link: [
    'source_link',
    'link',
    'url',
    'source_url',
    'article_link',
    'news_link',
    'SOURCE'
  ],
  date: [
    'date',
    'published_date',
    'publish_date',
    'created_date',
    'news_date',
    'article_date',
    'DATE'
  ],
  news_content: [
    'news_content',
    'content',
    'body',
    'article_content',
    'text',
    'description',
    'summary'
  ]
};

// Function to get column mappings from environment variables
function getColumnMappingsFromEnv() {
  const mappings = {};
  
  Object.keys(DEFAULT_COLUMN_MAPPINGS).forEach(field => {
    const envKey = `CSV_${field.toUpperCase()}_COLUMNS`;
    const envValue = process.env[envKey];
    
    if (envValue) {
      // Parse comma-separated values from environment variable
      mappings[field] = envValue.split(',').map(col => col.trim());
    } else {
      mappings[field] = DEFAULT_COLUMN_MAPPINGS[field];
    }
  });
  
  return mappings;
}

// Function to find the actual column name in CSV headers
function findColumnName(headers, possibleNames) {
  
  for (const name of possibleNames) {
    const found = headers.find(header => 
      header.toLowerCase().trim() === name.toLowerCase().trim()
    );
    if (found) {
      return found; // Return the original header name to preserve case
    }
  }
  return null;
}

// Function to map CSV data to database fields
function mapCSVDataToFields(csvRow, headers) {
  const columnMappings = getColumnMappingsFromEnv();
  const mappedData = {};
  
  Object.keys(columnMappings).forEach(field => {
    const possibleNames = columnMappings[field];
    const foundColumn = findColumnName(headers, possibleNames);
    
    if (foundColumn) {
      mappedData[field] = csvRow[foundColumn];
    } else {
      // Set default value if column not found
      mappedData[field] = field === 'date' ? new Date() : '';
    }
  });
  
  return mappedData;
}

export {
  DEFAULT_COLUMN_MAPPINGS,
  getColumnMappingsFromEnv,
  findColumnName,
  mapCSVDataToFields
}; 