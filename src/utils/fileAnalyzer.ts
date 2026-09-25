import { LoadedPdfFile, PdfTool, ToolCategory } from "../types";
import { ALL_TOOLS } from "../data/tools";

export interface FileAnalysisResult {
  fileTypeLabel: string;
  description: string;
  availableTools: PdfTool[];
  availableCategories: ToolCategory[];
}

export function analyzeLoadedFiles(files: LoadedPdfFile[]): FileAnalysisResult {
  if (!files || files.length === 0) {
    return {
      fileTypeLabel: "No Files Uploaded",
      description: "Upload a document or image to access specialized PDF tools.",
      availableTools: ALL_TOOLS,
      availableCategories: [
        "organize",
        "optimize",
        "convert-to",
        "convert-from",
        "edit",
        "security",
        "intelligence",
      ],
    };
  }

  const isPdf = (f: LoadedPdfFile) =>
    f.name.toLowerCase().endsWith(".pdf") || (f.pageCount && f.pageCount > 0 && !f.name.includes("."));
  const isImage = (f: LoadedPdfFile) =>
    /\.(jpg|jpeg|png|webp|bmp|gif|tiff)$/i.test(f.name);
  const isWord = (f: LoadedPdfFile) =>
    /\.(docx|doc|txt)$/i.test(f.name);
  const isPpt = (f: LoadedPdfFile) =>
    /\.(pptx|ppt)$/i.test(f.name);
  const isExcel = (f: LoadedPdfFile) =>
    /\.(xlsx|xls|csv)$/i.test(f.name);
  const isHtml = (f: LoadedPdfFile) =>
    /\.(html|htm)$/i.test(f.name);

  const pdfFiles = files.filter(isPdf);
  const imageFiles = files.filter(isImage);
  const wordFiles = files.filter(isWord);
  const pptFiles = files.filter(isPpt);
  const excelFiles = files.filter(isExcel);
  const htmlFiles = files.filter(isHtml);

  // Scenario 1: All files are PDFs
  if (pdfFiles.length === files.length) {
    const categories: ToolCategory[] = [
      "organize",
      "optimize",
      "convert-from",
      "edit",
      "security",
      "intelligence",
    ];

    if (files.length === 1) {
      // 1 PDF file: Exclude merge tool
      const availableTools = ALL_TOOLS.filter(
        (t) => categories.includes(t.category) && t.id !== "merge"
      );
      return {
        fileTypeLabel: "1 PDF Document Uploaded",
        description:
          "Showing Organize, Optimize, Convert From PDF, Edit, Security, and AI tools (Merge PDF disabled for 1 file).",
        availableTools,
        availableCategories: categories,
      };
    } else {
      // 2 or more PDF files: Include merge tool
      const availableTools = ALL_TOOLS.filter((t) => categories.includes(t.category));
      return {
        fileTypeLabel: `${files.length} PDF Documents Uploaded`,
        description:
          "Showing all PDF tools including Merge PDF, Organize, Optimize, Convert, Security & AI Intelligence.",
        availableTools,
        availableCategories: categories,
      };
    }
  }

  // Scenario 2: Image files (JPG, PNG, etc.)
  if (imageFiles.length === files.length) {
    const availableTools = ALL_TOOLS.filter(
      (t) => t.id === "jpg-to-pdf" || (imageFiles.length >= 2 && t.id === "merge")
    );
    return {
      fileTypeLabel: `${files.length} Image ${files.length === 1 ? "File" : "Files"} (${files
        .map((f) => f.name.split(".").pop()?.toUpperCase())
        .join(", ")})`,
      description: "Showing JPG / Image to PDF conversion tools.",
      availableTools,
      availableCategories: ["convert-to"],
    };
  }

  // Scenario 3: Word files
  if (wordFiles.length === files.length) {
    const availableTools = ALL_TOOLS.filter((t) => t.id === "word-to-pdf");
    return {
      fileTypeLabel: `Word Document (${files[0].name})`,
      description: "Showing Word to PDF conversion tool.",
      availableTools,
      availableCategories: ["convert-to"],
    };
  }

  // Scenario 4: PowerPoint files
  if (pptFiles.length === files.length) {
    const availableTools = ALL_TOOLS.filter((t) => t.id === "ppt-to-pdf");
    return {
      fileTypeLabel: `PowerPoint Presentation (${files[0].name})`,
      description: "Showing PowerPoint to PDF conversion tool.",
      availableTools,
      availableCategories: ["convert-to"],
    };
  }

  // Scenario 5: Excel files
  if (excelFiles.length === files.length) {
    const availableTools = ALL_TOOLS.filter((t) => t.id === "excel-to-pdf");
    return {
      fileTypeLabel: `Excel Spreadsheet (${files[0].name})`,
      description: "Showing Excel to PDF conversion tool.",
      availableTools,
      availableCategories: ["convert-to"],
    };
  }

  // Scenario 6: HTML files
  if (htmlFiles.length === files.length) {
    const availableTools = ALL_TOOLS.filter((t) => t.id === "html-to-pdf");
    return {
      fileTypeLabel: `HTML Document (${files[0].name})`,
      description: "Showing HTML to PDF conversion tool.",
      availableTools,
      availableCategories: ["convert-to"],
    };
  }

  // Scenario 7: Mixed file types (e.g., 1 PDF + 1 Image or Docs)
  const availableTools = ALL_TOOLS.filter(
    (t) =>
      t.id === "merge" ||
      t.id === "jpg-to-pdf" ||
      t.id === "word-to-pdf" ||
      t.id === "organize" ||
      t.category === "optimize" ||
      t.category === "intelligence"
  );
  const categories: ToolCategory[] = ["organize", "convert-to", "optimize", "intelligence"];

  return {
    fileTypeLabel: `Mixed Files (${files.length} items)`,
    description: "Showing Merge, Convert, Optimize and AI Intelligence tools for mixed document inputs.",
    availableTools,
    availableCategories: categories,
  };
}
