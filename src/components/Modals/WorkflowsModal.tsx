import React, { useState } from "react";
import { WorkflowRecipe } from "../../types";
import { X, Cpu, Play, Plus, Check, Trash2, ArrowRight } from "lucide-react";

interface Props {
  workflows: WorkflowRecipe[];
  onToggleWorkflow: (id: string) => void;
  onClose: () => void;
}

export const WorkflowsModal: React.FC<Props> = ({
  workflows,
  onToggleWorkflow,
  onClose,
}) => {
  const [createdList, setCreatedList] = useState<WorkflowRecipe[]>(workflows);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Automated PDF Workflows</h2>
              <p className="text-xs text-slate-400">Configure multi-step automated batch pipelines for document processing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {createdList.map((wf) => (
            <div
              key={wf.id}
              className="p-4 bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl space-y-3 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">{wf.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{wf.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onToggleWorkflow(wf.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                      wf.active
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {wf.active ? <Check className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{wf.active ? "Enabled" : "Disabled"}</span>
                  </button>
                </div>
              </div>

              {/* Step Sequence */}
              <div className="flex items-center space-x-2 overflow-x-auto pt-2">
                {wf.steps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-indigo-300 font-mono flex items-center space-x-1.5 whitespace-nowrap">
                      <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span className="capitalize">{step.toolId.replace("-", " ")}</span>
                    </div>
                    {idx < wf.steps.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
