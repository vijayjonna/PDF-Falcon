export type ToolCategory =
  | "organize"
  | "optimize"
  | "convert-to"
  | "convert-from"
  | "edit"
  | "security"
  | "intelligence";

export type ToolId =
  // Organize
  | "merge"
  | "split"
  | "remove-pages"
  | "extract-pages"
  | "organize"
  | "scan-to-pdf"
  // Optimize
  | "compress"
  | "repair"
  | "ocr"
  // Convert to
  | "jpg-to-pdf"
  | "word-to-pdf"
  | "ppt-to-pdf"
  | "excel-to-pdf"
  | "html-to-pdf"
  // Convert from
  | "pdf-to-jpg"
  | "pdf-to-word"
  | "pdf-to-ppt"
  | "pdf-to-excel"
  | "pdf-to-pdfa"
  // Edit
  | "rotate"
  | "page-numbers"
  | "watermark"
  | "crop"
  | "edit-pdf"
  | "pdf-forms"
  // Security
  | "unlock"
  | "protect"
  | "sign"
  | "redact"
  | "compare"
  // Intelligence
  | "ai-summarizer"
  | "translate"
  | "pdf-to-markdown";

export interface PdfTool {
  id: ToolId;
  title: string;
  category: ToolCategory;
  description: string;
  iconName: string;
  badge?: string;
  popular?: boolean;
}

export interface PdfPageMeta {
  pageNumber: number;
  rotation: number; // 0, 90, 180, 270
  selected: boolean;
  dataUrl?: string; // thumbnail rendering
}

export interface LoadedPdfFile {
  id: string;
  name: string;
  size: number;
  pageCount: number;
  arrayBuffer: ArrayBuffer;
  pages: PdfPageMeta[];
  extractedText?: string;
  createdAt: string;
}

export interface Annotation {
  id: string;
  pageNumber: number;
  type: "text" | "draw" | "highlight" | "redact" | "stamp" | "signature" | "rectangle";
  x: number; // percentage or px
  y: number;
  width?: number;
  height?: number;
  color?: string;
  thickness?: number;
  text?: string;
  fontSize?: number;
  points?: { x: number; y: number }[]; // for draw / highlight
  dataUrl?: string; // for signature / stamp
}

export interface SavedSignature {
  id: string;
  title: string;
  dataUrl: string;
  type: "drawn" | "typed" | "uploaded";
  createdAt: string;
}

export interface WorkflowRecipe {
  id: string;
  name: string;
  description: string;
  steps: {
    toolId: ToolId;
    config?: Record<string, any>;
  }[];
  active: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  plan: "Free Tier" | "Pro Studio" | "Enterprise AI";
  avatar: string;
  googleDriveConnected: boolean;
  dropboxConnected: boolean;
  vaultEncrypted: boolean;
  storageUsedMB: number;
  storageLimitMB: number;
}

export interface WatermarkConfig {
  text: string;
  fontSize: number;
  opacity: number;
  rotationAngle: number; // e.g. 45
  color: string;
}

export interface PageNumberConfig {
  position: "bottom-center" | "bottom-right" | "bottom-left" | "top-right" | "top-center";
  format: "number-only" | "page-n" | "page-n-of-m";
  fontSize: number;
  startNumber: number;
}
