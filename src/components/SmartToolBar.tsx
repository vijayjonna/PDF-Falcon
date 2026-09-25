import React, { useState, useEffect } from "react";
import { LoadedPdfFile, ToolId, ToolCategory } from "../types";
import { analyzeLoadedFiles } from "../utils/fileAnalyzer";
import { CATEGORY_LABELS } from "../data/tools";
import { Sparkles, CheckCircle2, SlidersHorizontal, Info } from "lucide-react";

interface Props {
  loadedFiles: LoadedPdfFile[];
  activeToolId: ToolId;
  onSelectTool: (toolId: ToolId) => void;
}

export const SmartToolBar: React.FC<Props> = ({
  loadedFiles,
  activeToolId,
  onSelectTool,
}) => {
  const analysis = analyzeLoadedFiles(loadedFiles);
  const { fileTypeLabel, description, availableTools, availableCategories } = analysis;

  // Determine current active category based on activeToolId
  const currentToolObj = availableTools.find((t) => t.id === activeToolId);
  const [activeCategory, setActiveCategory] = useState<ToolCategory>(
    currentToolObj?.category || availableCategories[0] || "organize"
  );

  // Auto-switch category if activeToolId changes or if activeCategory is no longer available
  useEffect(() => {
    if (currentToolObj) {
      setActiveCategory(currentToolObj.category);
    } else if (availableTools.length > 0) {
      // If current tool is not available in the filtered list, switch to first available tool!
      onSelectTool(availableTools[0].id);
      setActiveCategory(availableTools[0].category);
    }
  }, [loadedFiles, activeToolId]);

  // Tools belonging to the selected category
  const categoryTools = availableTools.filter((t) => t.category === activeCategory);

  if (loadedFiles.length === 0) return null;

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 md:p-5 shadow-xl space-y-4 backdrop-blur-md">
      {/* File Type Analysis Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold text-white">{fileTypeLabel}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Filtered Tools
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
              {description}
            </p>
          </div>
        </div>

        <div className="text-right text-[11px] text-slate-400 font-mono hidden md:block">
          {availableTools.length} {availableTools.length === 1 ? "tool" : "tools"} available
        </div>
      </div>

      {/* Available Category Tabs */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
          {availableCategories.map((catKey) => {
            const catInfo = CATEGORY_LABELS[catKey];
            const isActive = activeCategory === catKey;
            const countInCat = availableTools.filter((t) => t.category === catKey).length;

            return (
              <button
                key={catKey}
                onClick={() => {
                  setActiveCategory(catKey);
                  // Select first tool in this category
                  const firstTool = availableTools.find((t) => t.category === catKey);
                  if (firstTool) {
                    onSelectTool(firstTool.id);
                  }
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <span>{catInfo?.title || catKey}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold ${
                    isActive ? "bg-indigo-500/40 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {countInCat}
                </span>
              </button>
            );
          })}
        </div>

        {/* Specific Tool Selector Chips for Active Category */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1">
          {categoryTools.map((tool) => {
            const isSelected = activeToolId === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => onSelectTool(tool.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border flex items-center space-x-2 ${
                  isSelected
                    ? "bg-slate-800 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/30 shadow"
                    : "bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                <span>{tool.title}</span>
                {tool.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 bg-purple-500/20 text-purple-300 rounded font-bold">
                    {tool.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
