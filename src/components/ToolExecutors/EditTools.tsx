import React, { useState } from "react";
import { LoadedPdfFile, ToolId } from "../../types";
import { addWatermark, addPageNumbers } from "../../utils/pdfEngine";
import { RotateCw, Hash, Stamp, Crop, PenTool, CheckSquare, Loader2, Download, CheckCircle } from "lucide-react";

interface Props {
  activeToolId: ToolId;
  loadedFiles: LoadedPdfFile[];
}

export const EditTools: React.FC<Props> = ({ activeToolId, loadedFiles }) => {
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Watermark config
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.25);
  const [rotation, setRotation] = useState(45);

  // Page Numbers config
  const [numberPosition, setNumberPosition] = useState<"bottom-center" | "bottom-right" | "top-right">("bottom-center");
  const [numberFormat, setNumberFormat] = useState<"page-n-of-m" | "page-n" | "number-only">("page-n-of-m");

  const primaryFile = loadedFiles[0];

  const handleApplyWatermark = async () => {
    if (!primaryFile) return;
    setProcessing(true);
    try {
      const watermarkedBytes = await addWatermark(primaryFile.arrayBuffer, watermarkText, {
        opacity,
        angle: rotation,
      });
      const blob = new Blob([watermarkedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "watermarked_document.pdf";
      a.click();
      setSuccessMsg(`Applied watermark "${watermarkText}" across all pages.`);
    } catch (err: any) {
      alert("Watermark failed: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleApplyPageNumbers = async () => {
    if (!primaryFile) return;
    setProcessing(true);
    try {
      const numberedBytes = await addPageNumbers(primaryFile.arrayBuffer, {
        position: numberPosition,
        format: numberFormat,
      });
      const blob = new Blob([numberedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "numbered_document.pdf";
      a.click();
      setSuccessMsg("Page numbers inserted successfully.");
    } catch (err: any) {
      alert("Page numbers failed: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 text-slate-100">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
          {activeToolId === "watermark" && <Stamp className="w-6 h-6" />}
          {activeToolId === "page-numbers" && <Hash className="w-6 h-6" />}
          {activeToolId === "rotate" && <RotateCw className="w-6 h-6" />}
          {activeToolId === "crop" && <Crop className="w-6 h-6" />}
          {activeToolId === "edit-pdf" && <PenTool className="w-6 h-6" />}
          {activeToolId === "pdf-forms" && <CheckSquare className="w-6 h-6" />}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100 capitalize">
            {activeToolId.replace("-", " ")}
          </h2>
          <p className="text-xs text-slate-400">PDF document editor and layout customization</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center space-x-3 text-emerald-300 text-xs font-medium">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {activeToolId === "watermark" && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Watermark Text</label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Opacity ({Math.round(opacity * 100)}%)</label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Angle ({rotation}°)</label>
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <button
            onClick={handleApplyWatermark}
            disabled={processing || !primaryFile}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center space-x-2"
          >
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Stamp className="w-4 h-4" />}
            <span>Apply Watermark to PDF</span>
          </button>
        </div>
      )}

      {activeToolId === "page-numbers" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Position</label>
              <select
                value={numberPosition}
                onChange={(e: any) => setNumberPosition(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none"
              >
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="top-right">Top Right</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Format</label>
              <select
                value={numberFormat}
                onChange={(e: any) => setNumberFormat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none"
              >
                <option value="page-n-of-m">Page N of M</option>
                <option value="page-n">Page N</option>
                <option value="number-only">Numbers Only (1, 2, 3)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleApplyPageNumbers}
            disabled={processing || !primaryFile}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center space-x-2"
          >
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Hash className="w-4 h-4" />}
            <span>Insert Page Numbers</span>
          </button>
        </div>
      )}

      {(activeToolId === "edit-pdf" || activeToolId === "pdf-forms" || activeToolId === "rotate" || activeToolId === "crop") && (
        <p className="text-xs text-slate-400">
          Use the interactive PDF canvas preview above to draw annotations, fill text fields, crop boundaries, or rotate pages visually in real-time.
        </p>
      )}
    </div>
  );
};
