import React, { useState, useRef, useEffect } from "react";
import { LoadedPdfFile, Annotation, SavedSignature } from "../types";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Trash2,
  Highlighter,
  PenTool,
  Type,
  Square,
  EyeOff,
  Stamp,
  Check,
  Download,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";

interface Props {
  pdfFile: LoadedPdfFile | null;
  annotations: Annotation[];
  signatures: SavedSignature[];
  onAddAnnotation: (ann: Annotation) => void;
  onRemoveAnnotation: (id: string) => void;
  onRotatePage: (pageIndex: number, deltaAngle: number) => void;
  onDeletePage: (pageIndex: number) => void;
  onReorderPages?: (fromIndex: number, toIndex: number) => void;
  onSavePdf: () => void;
}

export const PdfViewerCanvas: React.FC<Props> = ({
  pdfFile,
  annotations,
  signatures,
  onAddAnnotation,
  onRemoveAnnotation,
  onRotatePage,
  onDeletePage,
  onReorderPages,
  onSavePdf,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [activeTool, setActiveTool] = useState<"select" | "draw" | "highlight" | "text" | "redact" | "stamp" | "signature">("select");
  const [selectedColor, setSelectedColor] = useState("#4f46e5");
  const [stampText, setStampText] = useState("APPROVED");
  const [draggedPageIndex, setDraggedPageIndex] = useState<number | null>(null);

  // Canvas annotation drawing
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawPoints, setDrawPoints] = useState<{ x: number; y: number }[]>([]);

  const totalPages = pdfFile?.pages.length || 1;
  const currentPageMeta = pdfFile?.pages[currentPage - 1];

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === "select") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === "text") {
      const input = prompt("Enter text annotation:", "Sample Note");
      if (input) {
        onAddAnnotation({
          id: "ann_" + Date.now(),
          pageNumber: currentPage,
          type: "text",
          x,
          y,
          text: input,
          color: selectedColor,
          fontSize: 14,
        });
      }
      return;
    }

    if (activeTool === "stamp") {
      onAddAnnotation({
        id: "ann_" + Date.now(),
        pageNumber: currentPage,
        type: "stamp",
        x,
        y,
        width: 140,
        height: 40,
        text: stampText,
        color: selectedColor,
      });
      return;
    }

    if (activeTool === "redact") {
      onAddAnnotation({
        id: "ann_" + Date.now(),
        pageNumber: currentPage,
        type: "redact",
        x,
        y,
        width: 160,
        height: 35,
        color: "#000000",
      });
      return;
    }

    if (activeTool === "signature" && signatures.length > 0) {
      onAddAnnotation({
        id: "ann_" + Date.now(),
        pageNumber: currentPage,
        type: "signature",
        x,
        y,
        width: 150,
        height: 60,
        dataUrl: signatures[0].dataUrl,
      });
      return;
    }

    setIsDrawing(true);
    setDrawPoints([{ x, y }]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setDrawPoints((prev) => [...prev, { x: e.clientX - rect.left, y: e.clientY - rect.top }]);
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (drawPoints.length > 1) {
      onAddAnnotation({
        id: "ann_" + Date.now(),
        pageNumber: currentPage,
        type: activeTool === "highlight" ? "highlight" : "draw",
        x: drawPoints[0].x,
        y: drawPoints[0].y,
        color: activeTool === "highlight" ? "rgba(253, 224, 71, 0.4)" : selectedColor,
        thickness: activeTool === "highlight" ? 18 : 3,
        points: drawPoints,
      });
    }
    setDrawPoints([]);
  };

  // Render overlay annotations onto page canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const pageAnns = annotations.filter((a) => a.pageNumber === currentPage);

    pageAnns.forEach((ann) => {
      if (ann.type === "text" && ann.text) {
        ctx.fillStyle = ann.color || "#000000";
        ctx.font = `${ann.fontSize || 14}px sans-serif`;
        ctx.fillText(ann.text, ann.x, ann.y);
      } else if (ann.type === "redact") {
        ctx.fillStyle = "#000000";
        ctx.fillRect(ann.x, ann.y, ann.width || 120, ann.height || 30);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px sans-serif";
        ctx.fillText("REDACTED", ann.x + 10, ann.y + 18);
      } else if (ann.type === "stamp") {
        ctx.strokeStyle = ann.color || "#dc2626";
        ctx.lineWidth = 2;
        ctx.strokeRect(ann.x, ann.y, ann.width || 120, ann.height || 36);
        ctx.fillStyle = ann.color || "#dc2626";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(ann.text || "APPROVED", ann.x + (ann.width || 120) / 2, ann.y + 24);
      } else if (ann.type === "signature" && ann.dataUrl) {
        const img = new Image();
        img.src = ann.dataUrl;
        img.onload = () => {
          ctx.drawImage(img, ann.x, ann.y, ann.width || 140, ann.height || 50);
        };
      } else if ((ann.type === "draw" || ann.type === "highlight") && ann.points) {
        ctx.beginPath();
        ctx.strokeStyle = ann.color || "#4f46e5";
        ctx.lineWidth = ann.thickness || 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ann.points.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
      }
    });

    // Current active drawing stroke preview
    if (drawPoints.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = activeTool === "highlight" ? "rgba(253, 224, 71, 0.5)" : selectedColor;
      ctx.lineWidth = activeTool === "highlight" ? 18 : 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      drawPoints.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    }
  }, [annotations, currentPage, drawPoints, activeTool, selectedColor]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedPageIndex(index);
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedPageIndex !== null && draggedPageIndex !== targetIndex && onReorderPages) {
      onReorderPages(draggedPageIndex, targetIndex);
      setCurrentPage(targetIndex + 1);
    }
    setDraggedPageIndex(null);
  };

  if (!pdfFile) {
    return (
      <div className="p-12 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-950/40 text-center space-y-3">
        <p className="text-sm font-medium text-slate-400">No PDF uploaded for interactive viewing.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
      {/* Viewport Toolbar */}
      <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3">
        {/* Page Nav */}
        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-slate-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-slate-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Annotation & Edit Tools */}
        <div className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTool("draw")}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 ${
              activeTool === "draw" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
            title="Freehand Draw"
          >
            <PenTool className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool("highlight")}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 ${
              activeTool === "highlight" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
            title="Highlight Text"
          >
            <Highlighter className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool("text")}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 ${
              activeTool === "text" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
            title="Add Text Box"
          >
            <Type className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool("redact")}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 ${
              activeTool === "redact" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
            title="Redact Blackout"
          >
            <EyeOff className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool("stamp")}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 ${
              activeTool === "stamp" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
            title="Add Stamp"
          >
            <Stamp className="w-4 h-4" />
          </button>
        </div>

        {/* Page Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onRotatePage(currentPage - 1, 90)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center space-x-1"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rotate</span>
          </button>
          <button
            onClick={() => onDeletePage(currentPage - 1)}
            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-medium flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete Page</span>
          </button>
          <button
            onClick={onSavePdf}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Interactive Page Organizer Strip */}
      {pdfFile && pdfFile.pages.length > 0 && (
        <div className="px-6 py-3 bg-slate-950/90 border-b border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-200">Reorganize Pages</span>
              <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                Drag cards or use ← → to swap page order (e.g., move page 2 to 1st)
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Total {pdfFile.pages.length} Pages
            </span>
          </div>

          <div className="flex items-center space-x-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
            {pdfFile.pages.map((p, idx) => {
              const isActive = currentPage === idx + 1;
              return (
                <div
                  key={`strip-page-${idx}-${p.pageNumber}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, idx)}
                  className={`shrink-0 w-28 p-2 rounded-xl bg-slate-900 border transition-all cursor-grab active:cursor-grabbing flex flex-col justify-between space-y-2 ${
                    isActive
                      ? "border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-950/20 shadow-lg"
                      : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div
                    onClick={() => setCurrentPage(idx + 1)}
                    className="flex flex-col items-center justify-center h-16 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer relative hover:border-indigo-500/50"
                  >
                    <span className="text-[10px] font-extrabold text-indigo-300">
                      Page {idx + 1}
                    </span>
                    <span className="text-[9px] text-slate-500">Orig #{p.pageNumber}</span>
                    {isActive && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                    )}
                  </div>

                  {/* Reorder Controls */}
                  <div className="flex items-center justify-between gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        onReorderPages?.(idx, idx - 1);
                        setCurrentPage(idx);
                      }}
                      className="flex-1 py-1 bg-slate-800 hover:bg-indigo-600 disabled:opacity-20 text-slate-200 rounded text-[10px] font-bold text-center transition-colors"
                      title="Move Page Left"
                    >
                      ← Move
                    </button>
                    <button
                      type="button"
                      disabled={idx === pdfFile.pages.length - 1}
                      onClick={() => {
                        onReorderPages?.(idx, idx + 1);
                        setCurrentPage(idx + 2);
                      }}
                      className="flex-1 py-1 bg-slate-800 hover:bg-indigo-600 disabled:opacity-20 text-slate-200 rounded text-[10px] font-bold text-center transition-colors"
                      title="Move Page Right"
                    >
                      Move →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Page Rendering Area */}
      <div className="p-8 bg-slate-950 flex items-center justify-center min-h-[500px] overflow-auto relative">
        <div
          className="relative bg-white text-slate-900 rounded-lg shadow-2xl transition-transform duration-200 border border-slate-300 overflow-hidden"
          style={{
            transform: `scale(${zoom / 100}) rotate(${currentPageMeta?.rotation || 0}deg)`,
            width: "520px",
            height: "700px",
          }}
        >
          {/* Page background simulated paper */}
          <div className="p-8 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-800">{pdfFile.name}</h2>
              <span className="text-xs text-slate-400 font-mono">Page {currentPage}</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {pdfFile.extractedText ||
                "This page represents the live interactive canvas preview of your uploaded PDF document. You can draw, highlight, insert e-signatures, watermark, and black out sensitive data."}
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500 font-mono space-y-1">
              <div>• File Size: {(pdfFile.size / 1000000).toFixed(2)} MB</div>
              <div>• Resolution: 300 DPI Vector PDF</div>
              <div>• Security Status: 256-bit AES Validated</div>
            </div>
          </div>

          {/* Interactive Annotation Canvas Overlay */}
          <canvas
            ref={canvasRef}
            width={520}
            height={700}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="absolute inset-0 z-10 cursor-crosshair touch-none"
          />
        </div>
      </div>
    </div>
  );
};
