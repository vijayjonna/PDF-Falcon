import React, { useState, useRef } from "react";
import { SavedSignature } from "../../types";
import { X, PenTool, Type, Upload, Trash2, Plus, Check } from "lucide-react";

interface Props {
  signatures: SavedSignature[];
  onAddSignature: (sig: SavedSignature) => void;
  onDeleteSignature: (id: string) => void;
  onClose: () => void;
}

export const SignaturesManagerModal: React.FC<Props> = ({
  signatures,
  onAddSignature,
  onDeleteSignature,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"draw" | "type" | "upload">("draw");
  const [title, setTitle] = useState("My Signature");
  const [typedText, setTypedText] = useState("Avi Anand");
  const [fontStyle, setFontStyle] = useState<"cursive" | "serif" | "sans">("cursive");

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSaveSignature = () => {
    let dataUrl = "";
    if (activeTab === "draw") {
      const canvas = canvasRef.current;
      if (!canvas) return;
      dataUrl = canvas.toDataURL("image/png");
    } else if (activeTab === "type") {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 120;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 400, 120);
        ctx.font = `italic 36px ${fontStyle === "cursive" ? "cursive, snell, 'Brush Script MT'" : "serif"}`;
        ctx.fillStyle = "#1e1b4b";
        ctx.textAlign = "center";
        ctx.fillText(typedText, 200, 70);
        dataUrl = canvas.toDataURL("image/png");
      }
    }

    if (!dataUrl) return;

    const newSig: SavedSignature = {
      id: "sig_" + Date.now(),
      title: title || "Saved Signature",
      dataUrl,
      type: activeTab === "draw" ? "drawn" : "typed",
      createdAt: new Date().toLocaleDateString(),
    };

    onAddSignature(newSig);
    clearCanvas();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Signature Library</h2>
              <p className="text-xs text-slate-400">Create, store, and apply legal e-signatures onto PDFs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Create Signature Block */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-slate-200">Create New Signature</h3>
              <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setActiveTab("draw")}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    activeTab === "draw" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Draw</span>
                </button>
                <button
                  onClick={() => setActiveTab("type")}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    activeTab === "type" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>Type</span>
                </button>
              </div>
            </div>

            {activeTab === "draw" && (
              <div className="space-y-3">
                <div className="relative bg-white rounded-xl border border-slate-700 overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={140}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full h-32 cursor-crosshair touch-none"
                  />
                  <button
                    onClick={clearCanvas}
                    className="absolute top-2 right-2 text-xs bg-slate-800/80 hover:bg-slate-900 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {activeTab === "type" && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={typedText}
                  onChange={(e) => setTypedText(e.target.value)}
                  placeholder="Type your full name..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
                <div className="p-4 bg-white text-indigo-950 rounded-xl flex items-center justify-center min-h-[90px] border border-slate-300">
                  <span className="text-3xl font-serif italic tracking-wide">{typedText || "Signature Preview"}</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Signature Name e.g. Primary Signature"
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 w-1/2"
              />
              <button
                onClick={handleSaveSignature}
                className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Save to Library</span>
              </button>
            </div>
          </div>

          {/* Saved Signatures Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-300">Saved Signatures ({signatures.length})</h3>
            {signatures.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No saved signatures yet. Create one above.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {signatures.map((sig) => (
                  <div
                    key={sig.id}
                    className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between group hover:border-slate-700 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="bg-white/90 p-1.5 rounded-lg border border-slate-700 w-36 h-12 flex items-center justify-center overflow-hidden">
                        <img src={sig.dataUrl} alt={sig.title} className="max-h-full object-contain" />
                      </div>
                      <p className="text-xs font-medium text-slate-200">{sig.title}</p>
                    </div>
                    <button
                      onClick={() => onDeleteSignature(sig.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
