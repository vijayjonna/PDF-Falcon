export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español (Spanish)", flag: "🇪🇸" },
  { code: "fr", name: "Français (French)", flag: "🇫🇷" },
  { code: "de", name: "Deutsch (German)", flag: "🇩🇪" },
  { code: "it", name: "Italiano (Italian)", flag: "🇮🇹" },
  { code: "pt", name: "Português (Portuguese)", flag: "🇧🇷" },
  { code: "ja", name: "日本語 (Japanese)", flag: "🇯🇵" },
  { code: "zh", name: "中文 (Chinese)", flag: "🇨🇳" },
  { code: "ko", name: "한국어 (Korean)", flag: "🇰🇷" },
  { code: "hi", name: "हिन्दी (Hindi)", flag: "🇮🇳" },
  { code: "ar", name: "العربية (Arabic)", flag: "🇸🇦" },
  { code: "nl", name: "Nederlands (Dutch)", flag: "🇳🇱" },
  { code: "pl", name: "Polski (Polish)", flag: "🇵🇱" },
  { code: "ru", name: "Русский (Russian)", flag: "🇷🇺" },
  { code: "tr", name: "Türkçe (Turkish)", flag: "🇹🇷" },
  { code: "sv", name: "Svenska (Swedish)", flag: "🇸🇪" },
];
