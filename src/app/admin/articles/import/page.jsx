// src/app/admin/articles/import/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { importFile } from "@/lib/actions/article";
import { validateFile, generateTemplate, getAcceptedFileTypes } from "@/lib/utils/file-validator";
import { FileUp, FileCheck, FileX, ArrowLeft, DownloadCloud, FileText, AlertTriangle, CheckCircle, XCircle, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function FileImportPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [templateFormat, setTemplateFormat] = useState('csv');

  console.log(process.env.DEFAULT_COLUMN_MAPPINGS);
  
  const handleFileChange = async (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setValidationResult(null); // Clear previous validation results
      
      // Validate file immediately
      setIsValidating(true);
      try {
        const validation = await validateFile(selectedFile);
        setValidationResult(validation);
        
        if (!validation.isValid) {
          toast.error("File validation failed", {
            description: "Please check the validation errors below",
            position: "top-center",
            duration: 5000
          });
        } else {
          toast.success("File validation passed", {
            description: "Your file is ready for import",
            position: "top-center",
            duration: 3000
          });
        }
      } catch (error) {
        console.error("Validation error:", error);
        toast.error("Validation error", {
          description: "Failed to validate file",
          position: "top-center"
        });
      } finally {
        setIsValidating(false);
      }
    }
  };
  
  const handleSubmit = async () => {
    if (!file) {
      toast.error("No file selected", {
        description: "Please select a file to import",
        position: "top-center"
      });
      return;
    }
    
    // Double-check validation before uploading
    if (validationResult && !validationResult.isValid) {
      toast.error("Cannot import invalid file", {
        description: "Please fix the validation errors before importing",
        position: "top-center"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const result = await importFile(formData);
      
      if (result.success) {
        toast.success("Import successful", {
          description: `${result.count} articles imported successfully`,
          position: "top-center",
          duration: 3000
        });
        setTimeout(() => router.push("/admin/articles"), 1500);
      } else {
        // Handle validation errors
        if (result.validationErrors) {
          setValidationResult({
            isValid: false,
            errors: result.validationErrors,
            missingRequiredColumns: result.missingRequiredColumns || [],
            unmappedColumns: result.unmappedColumns || []
          });
          
          toast.error("File validation failed", {
            description: "Please fix the validation errors below",
            position: "top-center",
            duration: 5000
          });
        } else {
          toast.error("Import failed", {
            description: result.message || "Please check your file format",
            position: "top-center",
            duration: 5000
          });
        }
      }
    } catch (error) {
      console.error("Import failed:", error);
      toast.error("Unexpected error", {
        description: "An unexpected error occurred during import",
        position: "top-center"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    try {
      const template = generateTemplate(templateFormat);
      
      if (templateFormat === 'csv') {
        // Handle CSV template
        const blob = new Blob([template], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'article-import-template.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // Handle Excel template
        const blob = new Blob([template], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'article-import-template.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      
      toast.success("Template downloaded", {
        description: `Use this ${templateFormat.toUpperCase()} template as a starting point for your file`,
        position: "top-center"
      });
    } catch (error) {
      console.error("Template download error:", error);
      toast.error("Template download failed", {
        description: "Failed to generate template",
        position: "top-center"
      });
    }
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return <FileUp className="w-12 h-12 text-gray-400 mb-3" />;
    
    const extension = fileName.toLowerCase().split('.').pop();
    switch (extension) {
      case 'csv':
        return <FileText className="w-12 h-12 text-[#0d2b69] mb-3" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-12 h-12 text-[#0d2b69] mb-3" />;
      default:
        return <FileText className="w-12 h-12 text-[#0d2b69] mb-3" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => router.back()}
            className="rounded-full bg-white border-gray-200 hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Import Articles from File</h1>
            <p className="text-gray-600 mt-1">
              Upload a CSV or Excel file containing articles to import into the system
            </p>
          </div>
        </div>
      </div>
      
      <Card className="rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <CardHeader className="flex flex-center bg-gradient-to-r from-slate-50 to-slate-100 border-b border-gray-200 py-5">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="bg-[#0d2b69] w-1.5 h-6 rounded-full"></span>
            File Import
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-8">
            <div>
              <Label className="block mb-3 text-gray-700 font-medium">
                Upload File (CSV or Excel)
              </Label>
              
              <div className="flex flex-col items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className={`
                    flex flex-col items-center justify-center w-full h-64 rounded-xl border-2 border-dashed cursor-pointer
                    ${file 
                      ? "border-[#0d2b69]/30 bg-[#0d2b69]/5" 
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                    }
                    transition-colors relative overflow-hidden
                  `}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                    {file ? (
                      <div className="flex flex-col items-center">
                        {getFileIcon(file.name)}
                        <p className="text-sm font-medium text-gray-700">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Click to change file
                        </p>
                        {isValidating && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
                            <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Validating...
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <FileUp className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          CSV, Excel (.xlsx, .xls) format only (Max size: 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200 overflow-hidden">
                    {(isUploading || isValidating) && (
                      <div className="h-full bg-[#0d2b69] animate-pulse"></div>
                    )}
                  </div>
                  
                  <input 
                    id="dropzone-file" 
                    type="file" 
                    accept={getAcceptedFileTypes()}
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isUploading || isValidating}
                  />
                </label>
              </div>
            </div>

            {/* Validation Results */}
            {validationResult && (
              <div className={`p-4 rounded-xl border ${
                validationResult.isValid 
                  ? "bg-green-50 border-green-200" 
                  : "bg-red-50 border-red-200"
              }`}>
                <div className="flex items-start gap-3 mb-4">
                  {validationResult.isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <h3 className={`font-medium ${
                      validationResult.isValid ? "text-green-800" : "text-red-800"
                    }`}>
                      {validationResult.isValid ? "File Validation Passed" : "File Validation Failed"}
                    </h3>
                    <p className={`text-sm ${
                      validationResult.isValid ? "text-green-700" : "text-red-700"
                    }`}>
                      {validationResult.isValid 
                        ? "Your file is ready for import." 
                        : "Please fix the following issues before importing:"
                      }
                    </p>
                  </div>
                </div>

                {!validationResult.isValid && validationResult.errors && (
                  <div className="space-y-3">
                    {validationResult.errors.map((error, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-red-700">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{error}</span>
                      </div>
                    ))}
                  </div>
                )}

                {validationResult.missingRequiredColumns && validationResult.missingRequiredColumns.length > 0 && (
                  <div className="mt-4 p-3 bg-red-100 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Missing Required Columns:</h4>
                    <div className="space-y-2">
                      {validationResult.missingRequiredColumns.map((column, index) => (
                        <div key={index} className="text-sm text-red-700">
                          <span className="font-medium">"{column.field}"</span> - Expected one of: 
                          <span className="font-mono bg-red-200 px-1 rounded ml-1">
                            {column.possibleNames.join(', ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {validationResult.unmappedColumns && validationResult.unmappedColumns.length > 0 && (
                  <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">Unrecognized Columns (will be ignored):</h4>
                    <div className="space-y-1">
                      {validationResult.unmappedColumns.map((column, index) => (
                        <div key={index} className="text-sm text-yellow-700 font-mono bg-yellow-200 px-2 py-1 rounded">
                          {column}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="bg-[#0d2b69]/5 p-5 rounded-xl border border-[#0d2b69]/10">
              <div className="flex items-start gap-3">
                <div className="bg-[#0d2b69]/10 p-2 rounded-lg">
                  <DownloadCloud className="w-5 h-5 text-[#0d2b69]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-[#0d2b69]">File Format Requirements</h3>
                    <div className="flex items-center gap-2">
                      <select
                        value={templateFormat}
                        onChange={(e) => setTemplateFormat(e.target.value)}
                        className="p-1 text-[#0d2b69] border rounded-md border-[#0d2b69]/20 hover:bg-[#0d2b69]/10"
                      >
                        <option value="csv">CSV Template</option>
                        <option value="excel">Excel Template</option>
                      </select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadTemplate}
                        className="text-[#0d2b69] border-[#0d2b69]/20 hover:bg-[#0d2b69]/10"
                      >
                        <DownloadCloud className="w-4 h-4 mr-1" />
                        Download Template
                      </Button>
                    </div>
                  </div>
                  <ul className="text-sm text-[#0d2b69]/80 space-y-2">
                    <li className="flex items-start">
                      <span className="bg-[#0d2b69]/20 text-[#0d2b69] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">1</span>
                      <span><strong>Supported formats:</strong> CSV (.csv), Excel (.xlsx, .xls)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-[#0d2b69]/20 text-[#0d2b69] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">2</span>
                      <span><strong>Required columns:</strong> <span className="font-mono bg-[#0d2b69]/10 px-1.5 py-0.5 rounded">news_title</span>, <span className="font-mono bg-[#0d2b69]/10 px-1.5 py-0.5 rounded">category</span>, <span className="font-mono bg-[#0d2b69]/10 px-1.5 py-0.5 rounded">source_link</span>, <span className="font-mono bg-[#0d2b69]/10 px-1.5 py-0.5 rounded">date</span></span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-[#0d2b69]/20 text-[#0d2b69] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">3</span>
                      <span><strong>Optional column:</strong> <span className="font-mono bg-[#0d2b69]/10 px-1.5 py-0.5 rounded">news_content</span></span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-[#0d2b69]/20 text-[#0d2b69] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">4</span>
                      <span>Date format: <span className="font-mono bg-[#0d2b69]/10 px-1.5 py-0.5 rounded">YYYY-MM-DD</span> (e.g., 2023-08-15)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-[#0d2b69]/20 text-[#0d2b69] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">5</span>
                      <span>Maximum 1000 rows per file</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                disabled={isUploading || isValidating}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!file || isUploading || isValidating || (validationResult && !validationResult.isValid)}
                className="bg-[#0d2b69] hover:bg-[#0a1f4f] transition-all shadow-md hover:shadow-lg px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Importing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FileUp className="w-4 h-4" />
                    Import Articles
                  </span>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}