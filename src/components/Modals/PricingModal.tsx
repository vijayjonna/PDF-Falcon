import React, { useState, useEffect } from "react";
import { X, Check, Sparkles, Globe, MapPin } from "lucide-react";
import { CURRENCIES, CurrencyInfo, detectUserCurrency } from "../../data/currencies";

interface Props {
  onClose: () => void;
  onSelectPlan?: (planName: string) => void;
}

export const PricingModal: React.FC<Props> = ({ onClose, onSelectPlan }) => {
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>("USD");
  const [userLocationName, setUserLocationName] = useState<string>("");
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);

  useEffect(() => {
    // 1. Initial detection using locale / timeZone
    const { currency, detectedCountry } = detectUserCurrency();
    setSelectedCurrencyCode(currency.code);
    setUserLocationName(detectedCountry);

    // 2. Async IP-based geo detection for precision
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    fetch("https://ipapi.co/json/", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.currency && CURRENCIES[data.currency]) {
          setSelectedCurrencyCode(data.currency);
          setUserLocationName(data.country_name || detectedCountry);
        }
      })
      .catch(() => {
        // Fallback to timezone detection silently
      })
      .finally(() => {
        clearTimeout(timeoutId);
        setLoadingLocation(false);
      });
  }, []);

  const activeCurrency: CurrencyInfo = CURRENCIES[selectedCurrencyCode] || CURRENCIES.USD;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden text-slate-100">
        <div className="px-6 py-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/60">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Transparent Localized Pricing
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mt-1">Upgrade Your PDF Falcon Experience</h2>
          </div>

          <div className="flex items-center space-x-3 self-end sm:self-auto">
            {/* Currency Selector */}
            <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
              <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <select
                value={selectedCurrencyCode}
                onChange={(e) => setSelectedCurrencyCode(e.target.value)}
                className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
              >
                {Object.values(CURRENCIES).map((curr) => (
                  <option key={curr.code} value={curr.code} className="bg-slate-900 text-slate-200">
                    {curr.flag} {curr.code} ({curr.symbol.trim()})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Location Detection Banner */}
        <div className="px-6 py-2.5 bg-indigo-950/40 border-b border-indigo-500/20 flex items-center justify-between text-xs text-indigo-200">
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 animate-bounce" />
            <span>
              {loadingLocation ? (
                "Detecting regional currency..."
              ) : (
                <>
                  Prices localized for <strong className="text-white">{userLocationName}</strong> ({activeCurrency.flag} {activeCurrency.code})
                </>
              )}
            </span>
          </div>
          <span className="hidden sm:inline text-[11px] text-indigo-300/70">
            Automated regional currency conversion applied
          </span>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto">
          {/* Free Tier */}
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-200">Free Tier</h3>
                <p className="text-xs text-slate-400 mt-1">Essential tools for individual quick tasks</p>
              </div>
              <div className="text-3xl font-extrabold text-slate-100">
                {activeCurrency.freePrice}{" "}
                <span className="text-xs font-normal text-slate-400">/ forever</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Merge, Split & Rotate PDFs</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Standard Compression</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Up to 15MB file size limit</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                onSelectPlan?.("Free Tier");
                onClose();
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
            >
              Current Plan
            </button>
          </div>

          {/* Pro Studio (Popular) */}
          <div className="relative p-6 rounded-2xl bg-gradient-to-b from-indigo-950/80 to-slate-950 border-2 border-indigo-500 shadow-xl shadow-indigo-600/10 flex flex-col justify-between space-y-6">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-[11px] font-extrabold rounded-full tracking-wide shadow-md flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>MOST POPULAR</span>
            </div>
            <div className="space-y-4 pt-2">
              <div>
                <h3 className="text-lg font-semibold text-indigo-200">Pro Studio</h3>
                <p className="text-xs text-indigo-300/80 mt-1">For power users & professionals</p>
              </div>
              <div className="text-3xl font-extrabold text-white">
                {activeCurrency.proPrice}{" "}
                <span className="text-xs font-normal text-indigo-300">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Unlimited Gemini AI Summaries & Chat</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>High Precision OCR Recognition</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Unlimited E-Signatures & Vault</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Google Drive & Dropbox Integration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>2GB max file upload</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                onSelectPlan?.("Pro Studio");
                onClose();
              }}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-colors"
            >
              Upgrade to Pro Studio
            </button>
          </div>

          {/* Enterprise AI */}
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-purple-300">Enterprise AI</h3>
                <p className="text-xs text-slate-400 mt-1">Automated team workflows & compliance</p>
              </div>
              <div className="text-3xl font-extrabold text-slate-100">
                {activeCurrency.enterprisePrice}{" "}
                <span className="text-xs font-normal text-slate-400">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Everything in Pro Studio</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Automated Batch Pipelines</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Audit Logging & Redaction Engine</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Dedicated SLA Support</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                onSelectPlan?.("Enterprise AI");
                onClose();
              }}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Get Enterprise AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

