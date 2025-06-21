"use server";

import { revalidatePath } from "next/cache";
import { parse } from "papaparse";
import prisma from "../db";
import { getServerSession } from "../auth";
import { mapCSVDataToFields, getColumnMappingsFromEnv } from "../config/csv-columns";
import { validateCSV } from "../utils/csv-validator";
import { validateExcel } from "../utils/excel-validator";

// Create a new article
export async function createArticle(data) {
    try {
      // Get current user session
      const session = await getServerSession();
      if (!session || !session.user) {
        return { success: false, message: "User not authenticated" };
      }
      
      // Create article with author connection
      await prisma.article.create({
        data: {
          ...data,
          author: {
            connect: {
              id: session.user.id
            }
          }
        }
      });
      
      revalidatePath("/dashboard");
      revalidatePath("/admin/articles");
      return { success: true, message: "Article created successfully" };
    } catch (error) {
      console.error("Failed to create article:", error);
      return { success: false, message: "Failed to create article" };
    }
  }

// Import articles from CSV or Excel file
export async function importFile(formData) {
  try {
    const file = formData.get("file");
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();
    
    let validation;
    let data;
    let headers;
    
    if (fileExtension === 'csv') {
      // Handle CSV file
      const text = await file.text();
      
      // Validate CSV before processing
      validation = validateCSV(text);
      
      if (!validation.isValid) {
        return { 
          success: false, 
          message: "CSV validation failed",
          validationErrors: validation.validationErrors,
          missingRequiredColumns: validation.missingRequiredColumns,
          unmappedColumns: validation.unmappedColumns
        };
      }
      
      const parseResult = parse(text, { header: true, skipEmptyLines: true });
      data = parseResult.data;
      headers = parseResult.meta.fields || [];
      
    } else if (['xlsx', 'xls'].includes(fileExtension)) {
      // Handle Excel file
      const XLSX = require('xlsx');
      const arrayBuffer = await file.arrayBuffer();
      
      // Validate Excel before processing
      validation = validateExcel(arrayBuffer);
      
      if (!validation.isValid) {
        return { 
          success: false, 
          message: "Excel validation failed",
          validationErrors: validation.validationErrors,
          missingRequiredColumns: validation.missingRequiredColumns,
          unmappedColumns: validation.unmappedColumns
        };
      }
      
      // Get data from validation result
      data = validation.sampleData;
      headers = validation.headers;
      
      // Convert Excel data to proper format
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON with headers
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Extract data rows (skip header row)
      const dataRows = jsonData.slice(1).filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''));
      
      // Convert to objects
      data = dataRows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });
      
    } else {
      return {
        success: false,
        message: `Unsupported file type: ${fileExtension}. Please upload a CSV (.csv) or Excel (.xlsx, .xls) file.`
      };
    }
    
    if (!data || data.length === 0) {
      return { success: false, message: "No data found in file" };
    }
    
    // Get column mappings for validation
    const columnMappings = getColumnMappingsFromEnv();
    
    // Log the detected headers and mappings for debugging
    console.log("File Headers:", headers);
    console.log("Column Mappings:", columnMappings);
    
    // Validate and transform data
    const articles = data.map((item, index) => {
      const mappedData = mapCSVDataToFields(item, headers);
      
      // Validate required fields
      if (!mappedData.news_title || !mappedData.news_content) {
        console.warn(`Row ${index + 1}: Missing required fields (title or content)`);
      }
      
      // Parse date properly
      let parsedDate = new Date();
      if (mappedData.date) {
        const dateValue = new Date(mappedData.date);
        if (!isNaN(dateValue.getTime())) {
          parsedDate = dateValue;
        } else {
          console.warn(`Row ${index + 1}: Invalid date format: ${mappedData.date}`);
        }
      }
      
      return {
        news_title: mappedData.news_title || `Untitled Article ${index + 1}`,
        category: mappedData.category || "General",
        source_link: mappedData.source_link || "",
        date: parsedDate,
        news_content: mappedData.news_content || "",
        authorId: "27399042-edab-423a-b242-e58ec20ff29e"
      };
    });
    
    // Create articles in batch
    await prisma.article.createMany({ data: articles });
    
    revalidatePath("/dashboard");
    revalidatePath("/admin/articles");
    return { 
      success: true, 
      count: articles.length,
      message: `Successfully imported ${articles.length} articles from ${fileExtension.toUpperCase()} file`
    };
  } catch (error) {
    console.error("Import failed:", error);
    return { success: false, message: `Failed to import articles: ${error.message}` };
  }
}

// Keep the old function name for backward compatibility
export async function importCSV(formData) {
  return await importFile(formData);
}

// Get articles with caching (for dashboard)
export async function getCachedArticles(page = 1, itemsPerPage = 10) {
  const skip = (page - 1) * itemsPerPage;
  return prisma.article.findMany({
    orderBy: { date: "desc" },
    skip,
    take: itemsPerPage,
  });
}

// Get all articles for client-side filtering (for dashboard)
export async function getAllArticles() {
  return prisma.article.findMany({
    orderBy: { date: "desc" },
  });
}

// Get article count
export async function getCachedArticleCount() {
  return prisma.article.count();
}

// Get a single article by ID
export async function getArticle(id) {
  try {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    return article;
  } catch (error) {
    console.error("Failed to fetch article:", error);
    return null;
  }
}

// Update an existing article
export async function updateArticle(id, data) {
    try {
      // Get current user session
      const session = await getServerSession();
      if (!session || !session.user) {
        return { success: false, message: "User not authenticated" };
      }
      
      await prisma.article.update({
        where: { id },
        data: {
          ...data,
          author: {
            connect: {
              id: session.user.id
            }
          }
        }
      });
      
      revalidatePath("/dashboard");
      revalidatePath("/admin/articles");
      return { success: true, message: "Article updated successfully" };
    } catch (error) {
      console.error("Failed to update article:", error);
      return { success: false, message: "Failed to update article" };
    }
  }
  
  // Delete an article
  export async function deleteArticle(id) {
    try {
      await prisma.article.delete({
        where: { id }
      });
      
      revalidatePath("/dashboard");
      revalidatePath("/admin/articles");
      return { success: true, message: "Article deleted successfully" };
    } catch (error) {
      console.error("Failed to delete article:", error);
      return { success: false, message: "Failed to delete article" };
    }
  }