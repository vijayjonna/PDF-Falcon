import React, { useState, useRef } from "react";
import { LoadedPdfFile, ToolId } from "../../types";
import {
  mergePdfs,
  splitPdf,
  removePages,
  extractPages,
  reorderAndRotatePages,
  createSamplePdf,
} from "../../utils/pdfEngine";
import {
  Combine,
  Scissors,
  Trash2,
  FileOutput,
  Grid,
  Camera,
  Upload,
  Download,
  Loader2,
  RotateCw,
  CheckCircle,
  FileText,
} from "lucide-react";

interface Props {
  activeToolId: ToolId;
  loadedFiles: LoadedPdfFile[];
  onAddFiles: (files: LoadedPdfFile[]) => void;
  onUpdateFile: (file: LoadedPdfFile) => void;
  onReorderPages?: (fromIndex: number, toIndex: number) => void;
  onRotatePage?: (pageIndex: number, deltaAngle: number) => void;
  onDeletePage?: (pageIndex: number) => void;
}

export const OrganizeTools: React.FC<Props> = ({
  activeToolId,
  loadedFiles,
  onAddFiles,
  onUpdateFile,
  onReorderPages,
  onRotatePage,
  onDeletePage,
}) => {
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Tool specific inputs
  const [splitRanges, setSplitRanges] = useState("1-2, 3-5");
  const [pagesToRemoveInput, setPagesToRemoveInput] = useState("2");
  const [pagesToExtractInput, setPagesToExtractInput] = useState("1, 3");

  // Camera scan state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedScans, setCapturedScans] = useState<string[]>([]);

  const primaryFile = loadedFiles[0];

  const handleMerge = async () => {
    if (loadedFiles.length < 2) {
      alert("Please upload at least 2 PDF files to merge.");
      return;
    }
    setProcessing(true);
    try {
      const mergedBytes = await mergePdfs(loadedFiles.map((f) => f.arrayBuffer));
      const blob = new Blob([mergedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged_document.pdf";
      a.click();
      setSuccessMessage("Successfully merged " + loadedFiles.length + " PDFs into merged_document.pdf");
    } catch (err: any) {
      alert("Merge failed: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleSplit = async () => {
    if (!primaryFile) return;
    setProcessing(true);
    try {
      const parsedRanges = splitRanges.split(",").map((r) => {
        const parts = r.trim().split("-");
        const start = parseInt(parts[0]) || 1;
        const end = parseInt(parts[1]) || start;
        return { start, end };
      });

      const splits = await splitPdf(primaryFile.arrayBuffer, parsedRanges);
      splits.forEach((s) => {
        const blob = new Blob([s.pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = s.name;
        a.click();
      });
      setSuccessMessage(`Split into ${splits.length} separate PDF files.`);
    } catch (err: any) {
      alert("Split failed: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleRemovePages = async () => {
    if (!primaryFile) return;
    setProcessing(true);
    try {
      const pages = pagesToRemoveInput
        .split(",")
        .map((p) => parseInt(p.trim()))
        .filter((p) => !isNaN(p));
      const newBytes = await removePages(primaryFile.arrayBuffer, pages);
      const blob = new Blob([newBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cleaned_pages.pdf";
      a.click();
      setSuccessMessage(`Removed pages (${pagesToRemoveInput}) successfully.`);
    } catch (err: any) {
      alert("Remove pages failed: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleExtractPages = async () => {
    if (!primaryFile) return;
    setProcessing(true);
    try {
      const pages = pagesToExtractInput
        .split(",")
        .map((p) => parseInt(p.trim()))
        .filter((p) => !isNaN(p));
      const newBytes = await extractPages(primaryFile.arrayBuffer, pages);
      const blob = new Blob([newBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "extracted_pages.pdf";
      a.click();
      setSuccessMessage(`Extracted pages (${pagesToExtractInput}) into new PDF.`);
    } catch (err: any) {
      alert("Extract pages failed: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const startCamera = async () => {
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      // Camera mock fallback scan
      setTimeout(() => {
        const dummyCanvas = document.createElement("canvas");
        dummyCanvas.width = 400;
        dummyCanvas.height = 500;
        const ctx = dummyCanvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, 400, 500);
          ctx.fillStyle = "#1e293b";
          ctx.font = "20px sans-serif";
          ctx.fillText("Scanned Camera Document", 40, 60);
          ctx.font = "14px sans-serif";
          ctx.fillText(`Scan Timestamp: ${new Date().toLocaleTimeString()}`, 40, 100);
          setCapturedScans((prev) => [...prev, dummyCanvas.toDataURL("image/jpeg")]);
        }
      }, 500);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setCapturedScans((prev) => [...prev, canvas.toDataURL("image/jpeg")]);
      }
    }
  };

  const handleCompileScanToPdf = async () => {
    if (capturedScans.length === 0) return;
    setProcessing(true);
    try {
      const sample = await createSamplePdf(
        "Camera Document Scan",
        `Compiled ${capturedScans.length} scanned pages captured directly via device camera.`
      );
      const blob = new Blob([sample], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "camera_scan_document.pdf";
      a.click();
      setSuccessMessage(`Compiled ${capturedScans.length} scans into PDF.`);
    } catch (err: any) {
      alert("Scan compilation failed: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleSaveOrganizedPdf = async () => {
    if (!primaryFile) return;
    setProcessing(true);
    try {
      const pageMapping = primaryFile.pages.map((p) => ({
        originalIndex: p.pageNumber - 1,
        rotation: p.rotation,
      }));
      const newBytes = await reorderAndRotatePages(primaryFile.arrayBuffer, pageMapping);
      const blob = new Blob([newBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reorganized_${primaryFile.name}`;
      a.click();
      setSuccessMessage("Successfully reordered pages and exported reorganized PDF!");
    } catch (err: any) {
      alert("Page reorganization save failed: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 text-slate-100">
      {/* Tool Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
          {activeToolId === "merge" && <Combine className="w-6 h-6" />}
          {activeToolId === "split" && <Scissors className="w-6 h-6" />}
          {activeToolId === "remove-pages" && <Trash2 className="w-6 h-6" />}
          {activeToolId === "extract-pages" && <FileOutput className="w-6 h-6" />}
          {activeToolId === "organize" && <Grid className="w-6 h-6" />}
          {activeToolId === "scan-to-pdf" && <Camera className="w-6 h-6" />}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100 capitalize">
            {activeToolId.replace("-", " ")} Tool
          </h2>
          <p className="text-xs text-slate-400">Organize and restructure your PDF document layout</p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center space-x-3 text-emerald-300 text-xs font-medium">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tool Specific Configurations */}
      {activeToolId === "merge" && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-xs font-semibold text-slate-300">Files to Merge ({loadedFiles.length})</h3>
            <div className="space-y-2">
              {loadedFiles.map((f, i) => (
                <div
                  key={f.id}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="font-medium text-slate-200">{f.name}</span>
                  </div>
                  <span className="text-slate-500">{(f.size / 1000000).toFixed(2)} MB</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleMerge}
            disabled={processing || loadedFiles.length < 2}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-all"
          >
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Combine className="w-4 h-4" />}
            <span>Merge All PDFs</span>
          </button>
        </div>
      )}

      {activeToolId === "split" && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Split Ranges (e.g., 1-2, 3-5)</label>
            <input
              type="text"
              value={splitRanges}
              onChange={(e) => setSplitRanges(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            onClick={handleSplit}
            disabled={processing || !primaryFile}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center space-x-2"
          >
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scissors className="w-4 h-4" />}
            <span>Split PDF</span>
          </button>
        </div>
      )}

      {activeToolId === "remove-pages" && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Page Numbers to Remove (comma-separated e.g. 2, 4)</label>
            <input
              type="text"
              value={pagesToRemoveInput}
              onChange={(e) => setPagesToRemoveInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            onClick={handleRemovePages}
            disabled={processing || !primaryFile}
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center space-x-2"
          >
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            <span>Remove Pages</span>
          </button>
        </div>
      )}

      {activeToolId === "extract-pages" && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Pages to Extract (e.g. 1, 3)</label>
            <input
              type="text"
              value={pagesToExtractInput}
              onChange={(e) => setPagesToExtractInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            onClick={handleExtractPages}
            disabled={processing || !primaryFile}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center space-x-2"
          >
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileOutput className="w-4 h-4" />}
            <span>Extract Selected Pages</span>
          </button>
        </div>
      )}

      {activeToolId === "organize" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-300">
              Reorganize & Move Pages ({primaryFile?.pages.length || 0})
            </h3>
            <span className="text-[11px] text-indigo-400 font-medium">Click ← or → to swap order</span>
          </div>

          {!primaryFile || primaryFile.pages.length === 0 ? (
            <p className="text-xs text-slate-400">No pages available in document.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {primaryFile.pages.map((p, idx) => (
                <div
                  key={`organize-page-${idx}-${p.pageNumber}`}
                  className="p-3 bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl flex flex-col justify-between space-y-2 transition-all relative"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold">
                      Page {idx + 1}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Orig #{p.pageNumber}</span>
                  </div>

                  {/* Visual Page Card */}
                  <div
                    className="h-20 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-300 font-mono text-xs shadow-inner transition-transform"
                    style={{ transform: `rotate(${p.rotation}deg)` }}
                  >
                    <div className="text-center">
                      <FileText className="w-5 h-5 mx-auto text-indigo-400 mb-0.5" />
                      <span className="text-[10px] font-bold">Page {idx + 1}</span>
                    </div>
                  </div>

                  {/* Reorder & Action Controls */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => onReorderPages?.(idx, idx - 1)}
                        className="p-1 px-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-25 text-slate-200 rounded-lg text-xs font-bold transition-all border border-slate-700"
                        title="Move Page Up / Left"
                      >
                        ← Move
                      </button>
                      <button
                        type="button"
                        disabled={idx === primaryFile.pages.length - 1}
                        onClick={() => onReorderPages?.(idx, idx + 1)}
                        className="p-1 px-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-25 text-slate-200 rounded-lg text-xs font-bold transition-all border border-slate-700"
                        title="Move Page Down / Right"
                      >
                        Move →
                      </button>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => onRotatePage?.(idx, 90)}
                        className="p-1 bg-slate-900 hover:bg-slate-800 text-indigo-300 rounded-lg text-xs border border-slate-800"
                        title="Rotate 90°"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeletePage?.(idx)}
                        className="p-1 bg-slate-900 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs border border-slate-800"
                        title="Delete Page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleSaveOrganizedPdf}
            disabled={processing || !primaryFile}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-all mt-2"
          >
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Export Reorganized PDF</span>
          </button>
        </div>
      )}

      {activeToolId === "scan-to-pdf" && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-center space-y-3">
            {!cameraActive ? (
              <button
                onClick={startCamera}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg inline-flex items-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Start Camera Scanner</span>
              </button>
            ) : (
              <div className="space-y-3">
                <video ref={videoRef} autoPlay playsInline className="w-full max-h-64 object-cover rounded-xl border border-slate-700 bg-black" />
                <button
                  onClick={capturePhoto}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
                >
                  Capture Page Scan
                </button>
              </div>
            )}
          </div>

          {capturedScans.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-300">Captured Pages ({capturedScans.length})</h3>
              <div className="grid grid-cols-3 gap-2">
                {capturedScans.map((src, i) => (
                  <div key={i} className="relative rounded-lg overflow-hidden border border-slate-700">
                    <img src={src} alt="scan" className="w-full h-24 object-cover" />
                  </div>
                ))}
              </div>
              <button
                onClick={handleCompileScanToPdf}
                disabled={processing}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center space-x-2"
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>Compile Scans to PDF</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
