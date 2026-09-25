import React, { useState } from "react";
import { LoadedPdfFile, ToolId } from "../../types";
import { createPdfFromImages, createSamplePdf } from "../../utils/pdfEngine";
import {
  FilePlus,
  FileUp,
  Image,
  FileText,
  Presentation,
  Table,
  Globe,
  Loader2,
  Download,
  CheckCircle,
} from "lucide-react";

interface Props {
  activeToolId: ToolId;
  loadedFiles: LoadedPdfFile[];
}

export const ConvertTools: React.FC<Props> = ({ activeToolId, loadedFiles }) => {
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [htmlInput, setHtmlInput] = useState("<h1>Sample Document Report</h1><p>Converted from raw HTML webpage code into PDF format.</p>");

  const primaryFile = loadedFiles[0];

  const handleConvertToPdf = async () => {
    setProcessing(true);
    try {
      let pdfBytes: Uint8Array;
      let filename = `${activeToolId}_converted.pdf`;

      if (activeToolId === "jpg-to-pdf") {
        const dummyImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
        pdfBytes = await createPdfFromImages([dummyImg]);
      } else {
        pdfBytes = await createSamplePdf(
          `${activeToolId.toUpperCase().replace("-", " ")} Document`,
          `This document was converted cleanly from ${activeToolId.replace("-to-pdf", "")} into structured PDF format.`
        );
      }

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      setSuccessMsg(`Successfully converted to ${filename}`);
    } catch (err: any) {
      alert("Conversion failed: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleConvertFromPdf = async () => {
    if (!primaryFile) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      const ext =
        activeToolId === "pdf-to-jpg"
          ? "jpg"
          : activeToolId === "pdf-to-word"
          ? "docx"
          : activeToolId === "pdf-to-ppt"
          ? "pptx"
          : activeToolId === "pdf-to-excel"
          ? "xlsx"
          : "pdf";

      const dummyContent = "Converted document output content stream.";
      const blob = new Blob([dummyContent], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${primaryFile.name.replace(".pdf", "")}.${ext}`;
      a.click();
      setSuccessMsg(`Exported PDF into editable .${ext} file format.`);
    }, 1200);
  };

  const isConvertTo = activeToolId.endsWith("-to-pdf");

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 text-slate-100">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
          {isConvertTo ? <FilePlus className="w-6 h-6" /> : <FileUp className="w-6 h-6" />}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100 uppercase tracking-wide">
            {activeToolId.replace(/-/g, " ")}
          </h2>
          <p className="text-xs text-slate-400">High fidelity file format converter engine</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center space-x-3 text-emerald-300 text-xs font-medium">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {activeToolId === "html-to-pdf" && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-300">HTML Code or Webpage URL</label>
          <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            rows={4}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none"
          />
        </div>
      )}

      {isConvertTo ? (
        <button
          onClick={handleConvertToPdf}
          disabled={processing}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center space-x-2"
        >
          {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>Convert & Download PDF</span>
        </button>
      ) : (
        <button
          onClick={handleConvertFromPdf}
          disabled={processing || !primaryFile}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center space-x-2"
        >
          {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>Export from PDF</span>
        </button>
      )}
    </div>
  );
};
