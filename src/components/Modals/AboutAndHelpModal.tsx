import React from "react";
import { X, Info, HelpCircle, CheckCircle, MessageSquare } from "lucide-react";

interface Props {
  onClose: () => void;
  type: "about" | "help";
}

export const AboutAndHelpModal: React.FC<Props> = ({ onClose, type }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              {type === "about" ? <Info className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                {type === "about" ? "About PDF Master Studio" : "Help & Documentation Center"}
              </h2>
              <p className="text-xs text-slate-400">
                {type === "about"
                  ? "Next-generation PDF productivity engine powered by Gemini AI"
                  : "Guides, tutorials, FAQs, and technical support"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {type === "about" ? (
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                <strong className="text-white">PDF Master Studio</strong> is built to be the ultimate document management workstation, merging traditional PDF tools (organize, convert, edit, protect, e-sign) with cutting-edge Gemini AI Intelligence.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">Version</span>
                  <p className="font-mono text-sm font-semibold text-indigo-400">v3.8.0 Studio AI Edition</p>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">AI Model</span>
                  <p className="font-mono text-sm font-semibold text-indigo-400">Gemini 3.6 Flash</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>How do I merge multiple PDFs?</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Select "Merge PDF" from the Organize menu or top search bar. Drag and drop your PDF files, reorder them visually in the thumbnail view, and click "Merge & Download".
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>How does Gemini AI Document Chat work?</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Upload any document into the "AI Summarizer & Chat" tool. Gemini processes the text content securely server-side and allows you to ask questions, request executive summaries, or translate into 30+ languages.
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>Need direct support?</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Contact our 24/7 support engineering desk at <span className="text-indigo-300 underline font-mono">support@pdfmasterstudio.com</span>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
