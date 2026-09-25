import React, { useState } from "react";
import { UserProfile } from "../../types";
import { X, User, Shield, HardDrive, Key, Check } from "lucide-react";

interface Props {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onClose: () => void;
}

export const AccountSettingsModal: React.FC<Props> = ({
  profile,
  onUpdateProfile,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "storage" | "api">("profile");
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Account Settings</h2>
              <p className="text-xs text-slate-400">Manage your profile, security preferences, and storage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 min-h-[380px]">
          {/* Sidebar Nav */}
          <div className="p-4 border-r border-slate-800 bg-slate-950/30 space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                activeTab === "profile"
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <User className="w-4 h-4" />
              <span>User Profile</span>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                activeTab === "security"
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Security</span>
            </button>
            <button
              onClick={() => setActiveTab("storage")}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                activeTab === "storage"
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span>Storage</span>
            </button>
            <button
              onClick={() => setActiveTab("api")}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                activeTab === "api"
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Key className="w-4 h-4" />
              <span>API Keys</span>
            </button>
          </div>

          {/* Main Tab Panels */}
          <div className="md:col-span-3 p-6 space-y-6">
            {activeTab === "profile" && (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold border-2 border-indigo-400/30">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs text-indigo-400 font-semibold">{profile.plan}</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-600/20"
                  >
                    {saved ? <Check className="w-4 h-4" /> : null}
                    <span>{saved ? "Saved Changes" : "Save Profile"}</span>
                  </button>
                </div>
              </form>
            )}

            {activeTab === "security" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-200">Security & Authentication</h3>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-slate-200">Encrypted Cloud Vault</h4>
                      <p className="text-xs text-slate-400">256-bit client-side AES document encryption</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-slate-200">Two-Factor Authentication (2FA)</h4>
                      <p className="text-xs text-slate-400">Protect account with authenticator app</p>
                    </div>
                    <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors">
                      Configure
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "storage" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-200">Cloud Storage Usage</h3>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex justify-between text-xs text-slate-300 font-medium">
                    <span>Used Storage</span>
                    <span>{profile.storageUsedMB} MB of {profile.storageLimitMB} MB</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(profile.storageUsedMB / profile.storageLimitMB) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "api" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-200">API Credentials & SDK Access</h3>
                <p className="text-xs text-slate-400">
                  Use your PDF Master Studio API key for automated server-side batch document processing.
                </p>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono text-indigo-300">
                  <span>pdf_studio_live_983f2a1b920a4b7e8d</span>
                  <button className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg">
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
