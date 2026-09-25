import React from "react";
import { X, ShieldCheck, Lock, EyeOff, Key, FileCheck } from "lucide-react";

interface Props {
  onClose: () => void;
}

export const SecurityModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Bank-Grade Security Architecture</h2>
              <p className="text-xs text-slate-400">Zero-knowledge encryption, client-side processing, and strict compliance</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
                <Lock className="w-4 h-4" />
                <span>256-bit AES Encryption</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                All document transformations, encryptions, and password protections utilize industry-standard 256-bit AES ciphers.
              </p>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm">
                <Key className="w-4 h-4" />
                <span>Zero Storage Retention</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Processed PDF files stay entirely in your browser memory or temporary encrypted sandbox, never stored permanently without your consent.
              </p>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-purple-400 font-semibold text-sm">
                <EyeOff className="w-4 h-4" />
                <span>Irreversible Permanent Redaction</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Redaction strips raw vector content and rasterizes blacked-out zones so sensitive text can never be copied or uncovered.
              </p>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-sky-400 font-semibold text-sm">
                <FileCheck className="w-4 h-4" />
                <span>ISO 27001 & GDPR Compliant</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full adherence to global data privacy laws, document signature validation standards, and regulatory compliance guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
