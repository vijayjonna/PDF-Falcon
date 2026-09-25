import React, { useState } from "react";
import { X, HardDrive, Check, Loader2, RefreshCw } from "lucide-react";
import { UserProfile } from "../../types";

interface Props {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onImportCloudFile?: (file: { name: string; size: number; content: string }) => void;
  onClose: () => void;
}

export const CloudStorageModal: React.FC<Props> = ({
  profile,
  onUpdateProfile,
  onImportCloudFile,
  onClose,
}) => {
  const [connectingDrive, setConnectingDrive] = useState(false);
  const [connectingDropbox, setConnectingDropbox] = useState(false);
  const [selectedCloudFolder, setSelectedCloudFolder] = useState<string | null>(null);

  const sampleCloudFiles = [
    { name: "Quarterly_Financial_Report_Q3.pdf", size: 2450000, provider: "Google Drive" },
    { name: "Legal_Contract_Vendor_Agreement.pdf", size: 1200000, provider: "Dropbox" },
    { name: "Product_Roadmap_2026_Presentation.pdf", size: 4800000, provider: "Google Drive" },
    { name: "Scanned_Invoice_Inv_2026_098.pdf", size: 980000, provider: "Dropbox" },
  ];

  const toggleDrive = () => {
    setConnectingDrive(true);
    setTimeout(() => {
      setConnectingDrive(false);
      onUpdateProfile({ googleDriveConnected: !profile.googleDriveConnected });
    }, 1000);
  };

  const toggleDropbox = () => {
    setConnectingDropbox(true);
    setTimeout(() => {
      setConnectingDropbox(false);
      onUpdateProfile({ dropboxConnected: !profile.dropboxConnected });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Cloud Storage Integrations</h2>
              <p className="text-xs text-slate-400">Sync, import, and auto-export files directly with Google Drive & Dropbox</p>
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
          {/* Service Connections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Google Drive */}
            <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2">
                  <svg className="w-6 h-6 shrink-0" viewBox="0 0 87.3 78">
                    <path fill="#0066DA" d="M6.6 66.85l12.1-21 21.15 36.65H15.8L6.6 66.85z" />
                    <path fill="#00AC47" d="M43.65 25.05L24.55 58.15l-12.1-21L31.55 4.05h24.2L43.65 25.05z" />
                    <path fill="#EA4335" d="M73.55 66.85H31.55l12.1-21h42.05l-12.15 21z" />
                    <path fill="#FFBA00" d="M43.65 25.05l12.1-21L80.7 47.1l-12.15 21L43.65 25.05z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Google Drive</h3>
                  <p className="text-xs text-slate-400">
                    {profile.googleDriveConnected ? "Connected & Synced" : "Not connected"}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleDrive}
                disabled={connectingDrive}
                className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                  profile.googleDriveConnected
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20"
                }`}
              >
                {connectingDrive ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : profile.googleDriveConnected ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Connected (Disconnect)</span>
                  </>
                ) : (
                  <span>Connect Google Drive</span>
                )}
              </button>
            </div>

            {/* Dropbox */}
            <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2">
                  <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="#0061FF">
                    <path d="M6 2l6 3.917L6 9.833 0 5.917 6 2zm12 0l6 3.917-6 3.916-6-3.916L18 2zM0 13.75l6-3.917 6 3.917-6 3.917-6-3.917zm18-3.917l6 3.917-6 3.917-6-3.917 6-3.917zM6 19.167l6-3.917 6 3.917-6 3.916-6-3.916z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Dropbox</h3>
                  <p className="text-xs text-slate-400">
                    {profile.dropboxConnected ? "Connected & Synced" : "Not connected"}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleDropbox}
                disabled={connectingDropbox}
                className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                  profile.dropboxConnected
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                    : "bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20"
                }`}
              >
                {connectingDropbox ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : profile.dropboxConnected ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Connected (Disconnect)</span>
                  </>
                ) : (
                  <span>Connect Dropbox</span>
                )}
              </button>
            </div>
          </div>

          {/* Cloud Picker File Browser */}
          {(profile.googleDriveConnected || profile.dropboxConnected) && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-200">Select Cloud Document to Import</h3>
                <span className="text-xs text-slate-400 font-mono">Live Sync Ready</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl divide-y divide-slate-800/80 overflow-hidden">
                {sampleCloudFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 flex items-center justify-between hover:bg-slate-900/60 transition-colors cursor-pointer group"
                    onClick={() => {
                      if (onImportCloudFile) {
                        onImportCloudFile({
                          name: file.name,
                          size: file.size,
                          content: `Sample cloud PDF document imported from ${file.provider}. Title: ${file.name}`,
                        });
                        onClose();
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <HardDrive className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">
                          {file.name}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {(file.size / 1000000).toFixed(2)} MB • {file.provider}
                        </p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-slate-800 group-hover:bg-indigo-600 group-hover:text-white text-slate-300 rounded-lg text-xs font-medium transition-all">
                      Import
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
