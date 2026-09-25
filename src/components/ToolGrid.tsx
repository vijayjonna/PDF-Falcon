import React, { useRef } from "react";
import { ToolCategory, ToolId, LoadedPdfFile, UserProfile } from "../types";
import { ALL_TOOLS, CATEGORY_LABELS } from "../data/tools";
import {
  Upload,
  Combine,
  Sparkles,
  ArrowRight,
  HardDrive,
  CheckCircle2,
  Cloud,
} from "lucide-react";

interface Props {
  activeCategory: ToolCategory | "all";
  onSelectCategory: (cat: ToolCategory | "all") => void;
  onSelectTool: (toolId: ToolId) => void;
  onAddFiles: (files: LoadedPdfFile[]) => void;
  onOpenCloudModal?: () => void;
  userProfile?: UserProfile;
}

export const ToolGrid: React.FC<Props> = ({
  activeCategory,
  onSelectCategory,
  onSelectTool,
  onAddFiles,
  onOpenCloudModal,
  userProfile,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileList: File[] = Array.from(e.target.files);

    const loadedList: LoadedPdfFile[] = fileList.map((f, i) => ({
      id: "file_" + Date.now() + "_" + i,
      name: f.name,
      size: f.size,
      pageCount: 3,
      arrayBuffer: new ArrayBuffer(0),
      pages: [
        { pageNumber: 1, rotation: 0, selected: true },
        { pageNumber: 2, rotation: 0, selected: true },
        { pageNumber: 3, rotation: 0, selected: true },
      ],
      createdAt: new Date().toLocaleDateString(),
    }));

    onAddFiles(loadedList);
  };

  const displayedTools =
    activeCategory === "all"
      ? ALL_TOOLS
      : ALL_TOOLS.filter((t) => t.category === activeCategory);

  return (
    <div className="space-y-10">
      {/* Hero Drag & Drop Banner - Elevated Luxury Dark Aesthetic */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 border border-slate-800/80 p-8 md:p-12 text-center space-y-8 overflow-hidden shadow-2xl backdrop-blur-xl">
        {/* Subtle background ambient radial lighting */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-300 border border-indigo-500/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Next-Gen Intelligent Document Workstation</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Professional PDF Tools & Cloud Workflows
          </h1>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-normal max-w-xl mx-auto">
            Process, merge, convert, e-sign, and encrypt your documents with total privacy and instant cloud sync.
          </p>
        </div>

        {/* Drag & Drop Target with Cloud Icons inside */}
        <div className="max-w-xl mx-auto relative z-10">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-8 rounded-2xl border-2 border-dashed border-indigo-500/30 hover:border-indigo-400/80 bg-slate-950/70 hover:bg-slate-900/90 cursor-pointer transition-all duration-300 group space-y-4 shadow-xl hover:shadow-indigo-500/10"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.docx,.pptx,.xlsx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center group-hover:scale-105 group-hover:bg-indigo-600/25 transition-all shadow-inner">
              <Upload className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-center space-x-3 flex-wrap gap-y-2">
                <span className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                  Drop PDF file here or click to browse
                </span>

                {/* Google Drive and Dropbox Icons on the right side of the drop PDF text */}
                <div className="inline-flex items-center space-x-2 pl-1">
                  {/* Google Drive Icon */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCloudModal?.();
                    }}
                    className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 transition-all shadow-sm group/btn"
                    title="Import from Google Drive"
                  >
                    <svg className="w-5 h-5 shrink-0 group-hover/btn:scale-110 transition-transform" viewBox="0 0 87.3 78">
                      <path fill="#0066DA" d="M6.6 66.85l12.1-21 21.15 36.65H15.8L6.6 66.85z" />
                      <path fill="#00AC47" d="M43.65 25.05L24.55 58.15l-12.1-21L31.55 4.05h24.2L43.65 25.05z" />
                      <path fill="#EA4335" d="M73.55 66.85H31.55l12.1-21h42.05l-12.15 21z" />
                      <path fill="#FFBA00" d="M43.65 25.05l12.1-21L80.7 47.1l-12.15 21L43.65 25.05z" />
                    </svg>
                  </button>

                  {/* Dropbox Icon */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCloudModal?.();
                    }}
                    className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-500/50 transition-all shadow-sm group/btn"
                    title="Import from Dropbox"
                  >
                    <svg className="w-5 h-5 shrink-0 group-hover/btn:scale-110 transition-transform" viewBox="0 0 24 24" fill="#0061FF">
                      <path d="M6 2l6 3.917L6 9.833 0 5.917 6 2zm12 0l6 3.917-6 3.916-6-3.916L18 2zM0 13.75l6-3.917 6 3.917-6 3.917-6-3.917zm18-3.917l6 3.917-6 3.917-6-3.917 6-3.917zM6 19.167l6-3.917 6 3.917-6 3.916-6-3.916z" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Supports PDF, Images, Word, Excel, PowerPoint up to 2GB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => onSelectCategory("all")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeCategory === "all"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          All Tools ({ALL_TOOLS.length})
        </button>

        {(["organize", "optimize", "convert-to", "convert-from", "edit", "security", "intelligence"] as ToolCategory[]).map(
          (cat) => {
            const label = CATEGORY_LABELS[cat]?.title || cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {label}
              </button>
            );
          }
        )}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/60 cursor-pointer transition-all duration-200 group flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform">
                  <Combine className="w-5 h-5" />
                </div>
                {tool.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {tool.badge}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                {tool.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{tool.description}</p>
            </div>

            <div className="flex items-center text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Launch Tool</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

