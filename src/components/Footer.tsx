import React from "react";
import { ToolId } from "../types";
import { FileText, ShieldCheck, HardDrive, Lock, Heart } from "lucide-react";

interface Props {
  onSelectTool: (toolId: ToolId) => void;
  onOpenModal: (modalName: "account" | "signatures" | "workflows" | "pricing" | "security" | "about" | "help" | "cloud") => void;
}

export const Footer: React.FC<Props> = ({ onSelectTool, onOpenModal }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">PDF Falcon</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              All-in-one web platform for PDF organization, document conversion, e-signatures, bank-grade encryption, and Gemini AI document intelligence.
            </p>
            <div className="flex items-center space-x-3 pt-2 text-[11px] text-slate-500 font-mono">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-bit AES Encrypted</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>GDPR Compliant</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-200 text-xs">Organize & Convert</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onSelectTool("merge")} className="hover:text-indigo-400 transition-colors">
                  Merge PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool("split")} className="hover:text-indigo-400 transition-colors">
                  Split PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool("jpg-to-pdf")} className="hover:text-indigo-400 transition-colors">
                  JPG to PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool("word-to-pdf")} className="hover:text-indigo-400 transition-colors">
                  Word to PDF
                </button>
              </li>
            </ul>
          </div>

          {/* Security & Intelligence */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-200 text-xs">Security & AI</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onSelectTool("protect")} className="hover:text-indigo-400 transition-colors">
                  Protect PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool("sign")} className="hover:text-indigo-400 transition-colors">
                  Sign PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool("ai-summarizer")} className="hover:text-indigo-400 transition-colors">
                  AI Summarizer
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool("translate")} className="hover:text-indigo-400 transition-colors">
                  AI Translate
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-200 text-xs">Navigation</h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onOpenModal("pricing")} className="hover:text-indigo-400 transition-colors">
                  Pricing
                </button>
              </li>
              <li>
                <button onClick={() => onOpenModal("security")} className="hover:text-indigo-400 transition-colors">
                  Security
                </button>
              </li>
              <li>
                <button onClick={() => onOpenModal("about")} className="hover:text-indigo-400 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onOpenModal("help")} className="hover:text-indigo-400 transition-colors">
                  Help & FAQs
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} PDF Falcon. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <button onClick={() => onOpenModal("security")} className="hover:underline">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => onOpenModal("security")} className="hover:underline">
              Terms of Service
            </button>
            <span>•</span>
            <button onClick={() => onOpenModal("cloud")} className="hover:underline">
              Cloud Sync Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
