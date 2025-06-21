# File Import Configuration

This document explains how to configure the file import functionality to handle multiple column name alternatives for both CSV and Excel files.

## Overview

The file import system now supports flexible column mapping for both CSV and Excel files, allowing you to specify multiple possible column names for each database field. This is particularly useful when importing data from different sources that may use different naming conventions.

## Supported File Formats

- **CSV files** (.csv) - Comma-separated values
- **Excel files** (.xlsx, .xls) - Microsoft Excel spreadsheets

## Default Column Mappings

The system comes with predefined mappings for each field:

### Title Field (`news_title`)
- `news_title`
- `title`
- `headline`
- `article_title`
- `news_headline`

### Category Field (`category`)
- `category`
- `section`
- `topic`
- `news_category`
- `article_category`

### Source Link Field (`source_link`)
- `source_link`
- `link`
- `url`
- `source_url`
- `article_link`
- `news_link`

### Date Field (`date`)
- `date`
- `published_date`
- `publish_date`
- `created_date`
- `news_date`
- `article_date`

### Content Field (`news_content`)
- `news_content`
- `content`
- `body`
- `article_content`
- `text`
- `description`
- `summary`

## Environment Variable Configuration

You can override the default mappings by setting environment variables. The format is:

```
CSV_{FIELD_NAME}_COLUMNS=column1,column2,column3
```

### Example Environment Variables

```bash
# Title column alternatives
CSV_NEWS_TITLE_COLUMNS=news_title,title,headline,article_title,news_headline

# Category column alternatives  
CSV_CATEGORY_COLUMNS=category,section,topic,news_category,article_category

# Source link column alternatives
CSV_SOURCE_LINK_COLUMNS=source_link,link,url,source_url,article_link,news_link

# Date column alternatives
CSV_DATE_COLUMNS=date,published_date,publish_date,created_date,news_date,article_date

# Content column alternatives
CSV_NEWS_CONTENT_COLUMNS=news_content,content,body,article_content,text,description,summary
```

## How It Works

1. **File Detection**: The system automatically detects the file type (CSV or Excel) based on the file extension.

2. **Column Detection**: The system reads the file headers and tries to match them against the configured column names (case-insensitive).

3. **Priority Order**: Column names are checked in the order they appear in the environment variable or default mapping.

4. **Fallback Values**: If a column is not found, the system uses default values:
   - Title: `Untitled Article {row_number}`
   - Category: `General`
   - Source Link: `""` (empty string)
   - Date: Current date/time
   - Content: `""` (empty string)

5. **Date Parsing**: The system attempts to parse dates in various formats. If parsing fails, it uses the current date.

## Example Files

### Example 1: Standard CSV Format
```csv
news_title,category,source_link,date,news_content
"Breaking News","Health","https://example.com","2024-01-15","Article content here"
```

### Example 2: Alternative Column Names (CSV)
```csv
headline,section,url,published_date,body
"Breaking News","Health","https://example.com","2024-01-15","Article content here"
```

### Example 3: Excel Format
Excel files should have the same column structure as CSV files, with headers in the first row and data in subsequent rows.

## Error Handling

The system provides detailed validation and error reporting:

### Validation Features
- **File Type Validation**: Ensures only supported file types are uploaded
- **Column Validation**: Checks for required columns and provides suggestions
- **Data Validation**: Ensures files contain actual data
- **Format Validation**: Validates CSV parsing and Excel structure

### Error Messages
- **Missing Required Columns**: Shows which columns are missing and what alternatives are accepted
- **Unrecognized Columns**: Warns about columns that won't be imported
- **File Format Errors**: Reports parsing issues and format problems
- **Data Issues**: Alerts when files are empty or contain invalid data

## Usage

1. Set up your environment variables with the desired column mappings
2. Upload your CSV or Excel file through the admin interface
3. The system will automatically detect the file type and validate it
4. Check the validation results for any issues
5. Import the file if validation passes

## Template Downloads

The system provides downloadable templates in both CSV and Excel formats:

- **CSV Template**: Simple text-based template
- **Excel Template**: Full Excel spreadsheet with sample data

## Troubleshooting

### Common Issues

1. **Unsupported File Type**: Ensure you're uploading .csv, .xlsx, or .xls files
2. **Columns Not Found**: Ensure your environment variables include the actual column names from your file
3. **Date Parsing Errors**: Check that your date format is supported by JavaScript's Date constructor
4. **Empty Data**: Verify that your file has the expected headers and data
5. **Excel Format Issues**: Ensure Excel files have headers in the first row and data in subsequent rows

### Debug Information

The system logs the following information to help with debugging:
- Detected file type
- File headers
- Applied column mappings
- Any warnings about missing or invalid data

## Adding New Column Mappings

To add support for new column names:

1. Update the `DEFAULT_COLUMN_MAPPINGS` in `src/lib/config/csv-columns.js`
2. Or set the appropriate environment variable
3. The system will automatically pick up the new mappings for both CSV and Excel files

## Performance Considerations

- **File Size**: Maximum recommended file size is 5MB
- **Row Limit**: Maximum 1000 rows per file for optimal performance
- **Memory Usage**: Large Excel files may use more memory during processing
- **Validation**: Files are validated before import to prevent processing errors 