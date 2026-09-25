import React, { useState, useRef, useEffect } from "react";
import { UserProfile, ToolCategory, ToolId, LoadedPdfFile } from "../types";
import { ALL_TOOLS, CATEGORY_LABELS } from "../data/tools";
import { analyzeLoadedFiles } from "../utils/fileAnalyzer";
import { SUPPORTED_LANGUAGES, LanguageOption } from "../data/languages";
import {
  FileText,
  Search,
  ChevronDown,
  User,
  Settings,
  PenTool,
  Cpu,
  Sparkles,
  LogOut,
  Moon,
  Sun,
  Globe,
  HardDrive,
  Shield,
  HelpCircle,
  Info,
  DollarSign,
  Grid,
} from "lucide-react";

interface HeaderProps {
  userProfile: UserProfile;
  currentLanguage: LanguageOption;
  darkMode: boolean;
  loadedFiles?: LoadedPdfFile[];
  onToggleDarkMode: () => void;
  onSelectLanguage: (lang: LanguageOption) => void;
  onSelectTool: (toolId: ToolId) => void;
  onOpenModal: (modalName: "account" | "signatures" | "workflows" | "pricing" | "security" | "about" | "help" | "cloud") => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  currentLanguage,
  darkMode,
  loadedFiles = [],
  onToggleDarkMode,
  onSelectLanguage,
  onSelectTool,
  onOpenModal,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [toolsMegaOpen, setToolsMegaOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const analysis = analyzeLoadedFiles(loadedFiles);
  const activeAvailableTools = analysis.availableTools;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
        setToolsMegaOpen(false);
        setLangMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTools = searchQuery.trim()
    ? activeAvailableTools.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 border-b-2 border-indigo-500/30 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl text-slate-100">
      <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => onSelectTool("merge")}
            className="flex items-center space-x-3 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  PDF Falcon
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-none hidden sm:block">
                All-In-One Document Suite
              </p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" ref={menuRef}>
            {/* Mega Menu Toggle */}
            <div className="relative">
              <button
                onClick={() => {
                  setToolsMegaOpen(!toolsMegaOpen);
                  setLangMenuOpen(false);
                  setUserMenuOpen(false);
                }}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  toolsMegaOpen
                    ? "bg-slate-800 text-indigo-400"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Grid className="w-4 h-4 text-indigo-400" />
                <span>All Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsMegaOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Mega Menu Panel */}
              {toolsMegaOpen && (
                <div className="absolute top-full left-0 mt-2 w-[720px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 grid grid-cols-3 gap-6 text-slate-100 animate-in fade-in zoom-in-95 duration-150">
                  {analysis.availableCategories.map((catKey) => {
                    const categoryTools = activeAvailableTools.filter((t) => t.category === catKey);
                    const catInfo = CATEGORY_LABELS[catKey];
                    if (categoryTools.length === 0) return null;
                    return (
                      <div key={catKey} className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5 border-b border-slate-800/80 pb-1">
                          <span>{catInfo?.title || catKey}</span>
                        </h4>
                        <div className="space-y-1">
                          {categoryTools.slice(0, 6).map((tool) => (
                            <button
                              key={tool.id}
                              onClick={() => {
                                onSelectTool(tool.id);
                                setToolsMegaOpen(false);
                              }}
                              className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 flex items-center justify-between transition-colors"
                            >
                              <span>{tool.title}</span>
                              {tool.badge && (
                                <span className="text-[9px] px-1.5 py-0.2 bg-purple-500/20 text-purple-300 rounded">
                                  {tool.badge}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => onOpenModal("pricing")}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pricing</span>
            </button>

            <button
              onClick={() => onOpenModal("security")}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-sky-400" />
              <span>Security</span>
            </button>

            <button
              onClick={() => onOpenModal("about")}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>About Us</span>
            </button>

            <button
              onClick={() => onOpenModal("help")}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>Help</span>
            </button>
          </nav>
        </div>

        {/* Right Search, Cloud & Account Controls */}
        <div className="flex items-center space-x-3">
          {/* Quick Tool Search Bar */}
          <div className="relative hidden md:block">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search 25+ PDF tools..."
                className="w-48 xl:w-60 bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-500"
              />
            </div>

            {searchOpen && filteredTools.length > 0 && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                {filteredTools.slice(0, 5).map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      onSelectTool(tool.id);
                      setSearchQuery("");
                      setSearchOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-100">{tool.title}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{tool.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setLangMenuOpen(!langMenuOpen);
                setUserMenuOpen(false);
                setToolsMegaOpen(false);
              }}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 flex items-center space-x-1 transition-colors"
              title="Change Language"
            >
              <Globe className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">{currentLanguage.flag}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 max-h-60 overflow-y-auto space-y-1">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onSelectLanguage(lang);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                      currentLanguage.code === lang.code
                        ? "bg-indigo-600/20 text-indigo-300 font-bold"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <span>{lang.name}</span>
                    <span>{lang.flag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Account Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setToolsMegaOpen(false);
                setLangMenuOpen(false);
              }}
              className="p-1 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-2xl transition-all focus:outline-none flex items-center justify-center"
              title="Account Menu"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-extrabold shadow-sm border border-indigo-400/30">
                {userProfile.name.charAt(0)}
              </div>
            </button>

            {/* Account Dropdown Options as explicitly requested */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-slate-100 animate-in fade-in zoom-in-95 duration-150">
                {/* User Profile Header */}
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 mb-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                      {userProfile.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">{userProfile.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{userProfile.email}</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-indigo-400 font-semibold">{userProfile.plan}</span>
                    <span className="text-slate-400">
                      {userProfile.storageUsedMB}MB / {userProfile.storageLimitMB}MB
                    </span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      onOpenModal("account");
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 flex items-center space-x-2.5 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-indigo-400" />
                    <span>Account Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenModal("signatures");
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 flex items-center space-x-2.5 transition-colors"
                  >
                    <PenTool className="w-4 h-4 text-emerald-400" />
                    <span>Signatures</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenModal("workflows");
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 flex items-center space-x-2.5 transition-colors"
                  >
                    <Cpu className="w-4 h-4 text-purple-400" />
                    <span>Workflows</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenModal("pricing");
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 flex items-center space-x-2.5 transition-colors my-1"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Upgrade to Premium</span>
                  </button>

                  <div className="border-t border-slate-800 my-1"></div>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      alert("You have logged out of your session.");
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2.5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
