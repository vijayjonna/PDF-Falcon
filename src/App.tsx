import React, { useState, useEffect } from "react";
import {
  ToolCategory,
  ToolId,
  LoadedPdfFile,
  Annotation,
  SavedSignature,
  WorkflowRecipe,
  UserProfile,
} from "./types";
import { SUPPORTED_LANGUAGES, LanguageOption } from "./data/languages";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ToolGrid } from "./components/ToolGrid";
import { PdfViewerCanvas } from "./components/PdfViewerCanvas";
import { SmartToolBar } from "./components/SmartToolBar";
import { analyzeLoadedFiles } from "./utils/fileAnalyzer";

// Category Executor Panels
import { OrganizeTools } from "./components/ToolExecutors/OrganizeTools";
import { OptimizeTools } from "./components/ToolExecutors/OptimizeTools";
import { ConvertTools } from "./components/ToolExecutors/ConvertTools";
import { EditTools } from "./components/ToolExecutors/EditTools";
import { SecurityTools } from "./components/ToolExecutors/SecurityTools";
import { AiTools } from "./components/ToolExecutors/AiTools";

// Modals
import { AccountSettingsModal } from "./components/Modals/AccountSettingsModal";
import { SignaturesManagerModal } from "./components/Modals/SignaturesManagerModal";
import { WorkflowsModal } from "./components/Modals/WorkflowsModal";
import { PricingModal } from "./components/Modals/PricingModal";
import { SecurityModal } from "./components/Modals/SecurityModal";
import { AboutAndHelpModal } from "./components/Modals/AboutAndHelpModal";
import { CloudStorageModal } from "./components/Modals/CloudStorageModal";

import { createSamplePdf } from "./utils/pdfEngine";
import { ALL_TOOLS } from "./data/tools";

export default function App() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">("all");
  const [activeToolId, setActiveToolId] = useState<ToolId>("merge");
  const [darkMode, setDarkMode] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(SUPPORTED_LANGUAGES[0]);

  // Initial user profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Avi Anand",
    email: "avijayanandbe@gmail.com",
    plan: "Pro Studio",
    avatar: "",
    googleDriveConnected: true,
    dropboxConnected: false,
    vaultEncrypted: true,
    storageUsedMB: 142,
    storageLimitMB: 5000,
  });

  // Files state
  const [loadedFiles, setLoadedFiles] = useState<LoadedPdfFile[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  // Saved Signatures state
  const [signatures, setSignatures] = useState<SavedSignature[]>([
    {
      id: "sig_1",
      title: "Primary Executive E-Signature",
      dataUrl:
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='60'><text x='20' y='40' font-family='cursive' font-size='28' fill='%234f46e5'>Avi Anand</text></svg>",
      type: "drawn",
      createdAt: "2026-08-11",
    },
  ]);

  // Workflows state
  const [workflows, setWorkflows] = useState<WorkflowRecipe[]>([
    {
      id: "wf_1",
      name: "Scan & Auto-OCR Pipeline",
      description: "Capture document scan, run OCR text extraction, add watermark, and compress.",
      steps: [
        { toolId: "scan-to-pdf" },
        { toolId: "ocr" },
        { toolId: "watermark" },
        { toolId: "compress" },
      ],
      active: true,
    },
    {
      id: "wf_2",
      name: "E-Sign & Encrypt Workflow",
      description: "Merge incoming PDF contracts, append e-signature stamp, and apply 256-bit password encryption.",
      steps: [{ toolId: "merge" }, { toolId: "sign" }, { toolId: "protect" }],
      active: false,
    },
  ]);

  // Modal visibility state
  const [activeModal, setActiveModal] = useState<
    "account" | "signatures" | "workflows" | "pricing" | "security" | "about" | "help" | "cloud" | null
  >(null);

  const handleAddFiles = (newFiles: LoadedPdfFile[]) => {
    const updated = [...newFiles, ...loadedFiles];
    setLoadedFiles(updated);
    const analysis = analyzeLoadedFiles(updated);
    if (!analysis.availableTools.some((t) => t.id === activeToolId)) {
      if (analysis.availableTools.length > 0) {
        setActiveToolId(analysis.availableTools[0].id);
      }
    }
    setTimeout(() => {
      document.getElementById("editor-workspace")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleReorderPages = (fromIndex: number, toIndex: number) => {
    if (loadedFiles.length === 0) return;
    const first = { ...loadedFiles[0] };
    if (fromIndex < 0 || fromIndex >= first.pages.length || toIndex < 0 || toIndex >= first.pages.length) return;
    const updatedPages = [...first.pages];
    const [movedPage] = updatedPages.splice(fromIndex, 1);
    updatedPages.splice(toIndex, 0, movedPage);
    first.pages = updatedPages;
    setLoadedFiles([first, ...loadedFiles.slice(1)]);
  };

  const handleRotatePage = (pageIndex: number, deltaAngle: number) => {
    if (loadedFiles.length === 0) return;
    const first = { ...loadedFiles[0] };
    if (first.pages[pageIndex]) {
      first.pages[pageIndex].rotation = (first.pages[pageIndex].rotation + deltaAngle) % 360;
      setLoadedFiles([first, ...loadedFiles.slice(1)]);
    }
  };

  const handleDeletePage = (pageIndex: number) => {
    if (loadedFiles.length === 0) return;
    const first = { ...loadedFiles[0] };
    if (first.pages.length <= 1) {
      alert("Cannot delete the last page of a document.");
      return;
    }
    first.pages = first.pages.filter((_, idx) => idx !== pageIndex);
    setLoadedFiles([first, ...loadedFiles.slice(1)]);
  };

  const handleSaveExportPdf = () => {
    if (loadedFiles.length === 0) return;
    const file = loadedFiles[0];
    const blob = new Blob([file.arrayBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `edited_${file.name}`;
    a.click();
  };

  const selectedToolObj = ALL_TOOLS.find((t) => t.id === activeToolId);
  const activeCategoryType = selectedToolObj?.category || "organize";

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"} font-sans antialiased flex flex-col justify-between`}>
      {/* Header Bar */}
      <Header
        userProfile={userProfile}
        currentLanguage={currentLanguage}
        darkMode={darkMode}
        loadedFiles={loadedFiles}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onSelectLanguage={setCurrentLanguage}
        onSelectTool={setActiveToolId}
        onOpenModal={setActiveModal}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        {loadedFiles.length === 0 ? (
          /* Home / Input Landing Page */
          <ToolGrid
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onSelectTool={setActiveToolId}
            onAddFiles={handleAddFiles}
            onOpenCloudModal={() => setActiveModal("cloud")}
            userProfile={userProfile}
          />
        ) : (
          /* Dedicated Document Edit Page Workspace */
          <div className="space-y-6">
            {/* Edit Page Navigation & Context Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-xl flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
              <div className="flex items-center space-x-3 min-w-0">
                <button
                  onClick={() => setLoadedFiles([])}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center space-x-2 shrink-0"
                  title="Return to home tool grid"
                >
                  <span>← Back to All Tools</span>
                </button>

                <div className="h-5 w-px bg-slate-800 shrink-0 hidden sm:block" />

                {/* File Badge */}
                <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                  <span className="text-xs font-bold text-indigo-200 truncate max-w-[200px] sm:max-w-[300px]">
                    {loadedFiles[0].name}
                  </span>
                  <span className="text-[10px] text-indigo-300/70 font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 shrink-0">
                    {loadedFiles[0].pageCount} {loadedFiles[0].pageCount === 1 ? "page" : "pages"}
                  </span>
                </div>
              </div>

              {/* Actions & Add Files */}
              <div className="flex items-center space-x-2 shrink-0">
                <label className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md transition-all cursor-pointer flex items-center space-x-1.5">
                  <span>+ Add Files</span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.docx,.pptx,.xlsx"
                    onChange={(e) => {
                      if (!e.target.files) return;
                      const fileList: File[] = Array.from(e.target.files);
                      const loadedList: LoadedPdfFile[] = fileList.map((f, i) => ({
                        id: "file_" + Date.now() + "_" + i,
                        name: f.name,
                        size: f.size,
                        pageCount: 1,
                        arrayBuffer: new ArrayBuffer(0),
                        pages: [{ pageNumber: 1, rotation: 0, selected: true }],
                        extractedText: "",
                        createdAt: new Date().toLocaleDateString(),
                      }));
                      handleAddFiles(loadedList);
                    }}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => setLoadedFiles([])}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-rose-500/20 hover:border-rose-500/30 border border-slate-800 text-slate-400 hover:text-rose-300 transition-all text-xs font-medium"
                  title="Clear file and return home"
                >
                  ✕ Close Document
                </button>
              </div>
            </div>

            {/* Smart Tool & Category Selector Bar based on Input Analysis */}
            <SmartToolBar
              loadedFiles={loadedFiles}
              activeToolId={activeToolId}
              onSelectTool={setActiveToolId}
            />

            {/* Selected Tool Executor & Interactive Viewport Workspace */}
            <section id="editor-workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
              {/* Tool Control Panel */}
              <div className="lg:col-span-5">
                {activeCategoryType === "organize" && (
                  <OrganizeTools
                    activeToolId={activeToolId}
                    loadedFiles={loadedFiles}
                    onAddFiles={handleAddFiles}
                    onUpdateFile={(updated) => setLoadedFiles([updated, ...loadedFiles.slice(1)])}
                    onReorderPages={handleReorderPages}
                    onRotatePage={handleRotatePage}
                    onDeletePage={handleDeletePage}
                  />
                )}

                {activeCategoryType === "optimize" && (
                  <OptimizeTools activeToolId={activeToolId} loadedFiles={loadedFiles} />
                )}

                {(activeCategoryType === "convert-to" || activeCategoryType === "convert-from") && (
                  <ConvertTools activeToolId={activeToolId} loadedFiles={loadedFiles} />
                )}

                {activeCategoryType === "edit" && (
                  <EditTools activeToolId={activeToolId} loadedFiles={loadedFiles} />
                )}

                {activeCategoryType === "security" && (
                  <SecurityTools
                    activeToolId={activeToolId}
                    loadedFiles={loadedFiles}
                    signatures={signatures}
                    onOpenSignaturesModal={() => setActiveModal("signatures")}
                  />
                )}

                {activeCategoryType === "intelligence" && (
                  <AiTools activeToolId={activeToolId} loadedFiles={loadedFiles} />
                )}
              </div>

              {/* Interactive Live PDF Canvas Preview */}
              <div className="lg:col-span-7">
                <PdfViewerCanvas
                  pdfFile={loadedFiles[0] || null}
                  annotations={annotations}
                  signatures={signatures}
                  onAddAnnotation={(ann) => setAnnotations((prev) => [...prev, ann])}
                  onRemoveAnnotation={(id) => setAnnotations((prev) => prev.filter((a) => a.id !== id))}
                  onRotatePage={handleRotatePage}
                  onDeletePage={handleDeletePage}
                  onReorderPages={handleReorderPages}
                  onSavePdf={handleSaveExportPdf}
                />
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer Bar */}
      <Footer onSelectTool={setActiveToolId} onOpenModal={setActiveModal} />

      {/* Render Modals */}
      {activeModal === "account" && (
        <AccountSettingsModal
          profile={userProfile}
          onUpdateProfile={(up) => setUserProfile((prev) => ({ ...prev, ...up }))}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "signatures" && (
        <SignaturesManagerModal
          signatures={signatures}
          onAddSignature={(sig) => setSignatures((prev) => [sig, ...prev])}
          onDeleteSignature={(id) => setSignatures((prev) => prev.filter((s) => s.id !== id))}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "workflows" && (
        <WorkflowsModal
          workflows={workflows}
          onToggleWorkflow={(id) =>
            setWorkflows((prev) =>
              prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w))
            )
          }
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "pricing" && (
        <PricingModal
          onClose={() => setActiveModal(null)}
          onSelectPlan={(plan) => setUserProfile((prev) => ({ ...prev, plan: plan as any }))}
        />
      )}

      {activeModal === "security" && <SecurityModal onClose={() => setActiveModal(null)} />}

      {activeModal === "about" && (
        <AboutAndHelpModal type="about" onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "help" && (
        <AboutAndHelpModal type="help" onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "cloud" && (
        <CloudStorageModal
          profile={userProfile}
          onUpdateProfile={(up) => setUserProfile((prev) => ({ ...prev, ...up }))}
          onImportCloudFile={(f) => {
            const imported: LoadedPdfFile = {
              id: "cloud_file_" + Date.now(),
              name: f.name,
              size: f.size,
              pageCount: 3,
              arrayBuffer: new ArrayBuffer(0),
              pages: [
                { pageNumber: 1, rotation: 0, selected: true },
                { pageNumber: 2, rotation: 0, selected: true },
                { pageNumber: 3, rotation: 0, selected: true },
              ],
              extractedText: f.content,
              createdAt: new Date().toLocaleDateString(),
            };
            setLoadedFiles([imported, ...loadedFiles]);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
