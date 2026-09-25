export interface CurrencyInfo {
  code: string;
  symbol: string;
  countryName: string;
  flag: string;
  freePrice: string;
  proPrice: string;
  enterprisePrice: string;
}

export const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: {
    code: "USD",
    symbol: "$",
    countryName: "United States",
    flag: "🇺🇸",
    freePrice: "$0",
    proPrice: "$9.99",
    enterprisePrice: "$29.99",
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    countryName: "European Union",
    flag: "🇪🇺",
    freePrice: "€0",
    proPrice: "€8.99",
    enterprisePrice: "€26.99",
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    countryName: "United Kingdom",
    flag: "🇬🇧",
    freePrice: "£0",
    proPrice: "£7.99",
    enterprisePrice: "£23.99",
  },
  INR: {
    code: "INR",
    symbol: "₹",
    countryName: "India",
    flag: "🇮🇳",
    freePrice: "₹0",
    proPrice: "₹799",
    enterprisePrice: "₹2,399",
  },
  CAD: {
    code: "CAD",
    symbol: "CA$",
    countryName: "Canada",
    flag: "🇨🇦",
    freePrice: "CA$0",
    proPrice: "CA$13.49",
    enterprisePrice: "CA$39.99",
  },
  AUD: {
    code: "AUD",
    symbol: "A$",
    countryName: "Australia",
    flag: "🇦🇺",
    freePrice: "A$0",
    proPrice: "A$14.99",
    enterprisePrice: "A$44.99",
  },
  JPY: {
    code: "JPY",
    symbol: "¥",
    countryName: "Japan",
    flag: "🇯🇵",
    freePrice: "¥0",
    proPrice: "¥1,480",
    enterprisePrice: "¥4,480",
  },
  BRL: {
    code: "BRL",
    symbol: "R$",
    countryName: "Brazil",
    flag: "🇧🇷",
    freePrice: "R$0",
    proPrice: "R$49.90",
    enterprisePrice: "R$149.90",
  },
  CNY: {
    code: "CNY",
    symbol: "¥",
    countryName: "China",
    flag: "🇨🇳",
    freePrice: "¥0",
    proPrice: "¥69.00",
    enterprisePrice: "¥209.00",
  },
  SGD: {
    code: "SGD",
    symbol: "S$",
    countryName: "Singapore",
    flag: "🇸🇬",
    freePrice: "S$0",
    proPrice: "S$13.50",
    enterprisePrice: "S$39.90",
  },
  AED: {
    code: "AED",
    symbol: "AED ",
    countryName: "United Arab Emirates",
    flag: "🇦🇪",
    freePrice: "AED 0",
    proPrice: "AED 36.99",
    enterprisePrice: "AED 109.99",
  },
  MXN: {
    code: "MXN",
    symbol: "MX$",
    countryName: "Mexico",
    flag: "🇲🇽",
    freePrice: "MX$0",
    proPrice: "MX$179",
    enterprisePrice: "MX$529",
  },
  CHF: {
    code: "CHF",
    symbol: "CHF ",
    countryName: "Switzerland",
    flag: "🇨🇭",
    freePrice: "CHF 0",
    proPrice: "CHF 8.90",
    enterprisePrice: "CHF 26.90",
  },
  SEK: {
    code: "SEK",
    symbol: "kr ",
    countryName: "Sweden",
    flag: "🇸🇪",
    freePrice: "0 kr",
    proPrice: "99 kr",
    enterprisePrice: "299 kr",
  },
  PLN: {
    code: "PLN",
    symbol: "zł ",
    countryName: "Poland",
    flag: "🇵🇱",
    freePrice: "0 zł",
    proPrice: "39.99 zł",
    enterprisePrice: "119.99 zł",
  },
};

export function detectUserCurrency(): { currency: CurrencyInfo; detectedCountry: string } {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const lang = navigator.language || "";

    if (tz.includes("Kolkata") || tz.includes("Calcutta") || lang.endsWith("-IN")) {
      return { currency: CURRENCIES.INR, detectedCountry: "India" };
    }
    if (tz.includes("London") || lang.endsWith("-GB")) {
      return { currency: CURRENCIES.GBP, detectedCountry: "United Kingdom" };
    }
    if (tz.includes("Paris") || tz.includes("Berlin") || tz.includes("Madrid") || tz.includes("Rome") || tz.includes("Amsterdam") || tz.includes("Brussels") || tz.includes("Vienna") || tz.includes("Europe/")) {
      return { currency: CURRENCIES.EUR, detectedCountry: "European Union" };
    }
    if (tz.includes("Toronto") || tz.includes("Vancouver") || tz.includes("Edmonton") || lang.endsWith("-CA")) {
      return { currency: CURRENCIES.CAD, detectedCountry: "Canada" };
    }
    if (tz.includes("Australia/") || tz.includes("Sydney") || tz.includes("Melbourne") || lang.endsWith("-AU")) {
      return { currency: CURRENCIES.AUD, detectedCountry: "Australia" };
    }
    if (tz.includes("Tokyo") || lang.endsWith("-JP")) {
      return { currency: CURRENCIES.JPY, detectedCountry: "Japan" };
    }
    if (tz.includes("Sao_Paulo") || lang.endsWith("-BR")) {
      return { currency: CURRENCIES.BRL, detectedCountry: "Brazil" };
    }
    if (tz.includes("Shanghai") || tz.includes("Chongqing") || lang.endsWith("-CN")) {
      return { currency: CURRENCIES.CNY, detectedCountry: "China" };
    }
    if (tz.includes("Singapore") || lang.endsWith("-SG")) {
      return { currency: CURRENCIES.SGD, detectedCountry: "Singapore" };
    }
    if (tz.includes("Dubai") || tz.includes("Abu_Dhabi") || lang.endsWith("-AE")) {
      return { currency: CURRENCIES.AED, detectedCountry: "United Arab Emirates" };
    }
    if (tz.includes("Mexico") || lang.endsWith("-MX")) {
      return { currency: CURRENCIES.MXN, detectedCountry: "Mexico" };
    }
    if (tz.includes("Zurich") || lang.endsWith("-CH")) {
      return { currency: CURRENCIES.CHF, detectedCountry: "Switzerland" };
    }
    if (tz.includes("Stockholm") || lang.endsWith("-SE")) {
      return { currency: CURRENCIES.SEK, detectedCountry: "Sweden" };
    }
    if (tz.includes("Warsaw") || lang.endsWith("-PL")) {
      return { currency: CURRENCIES.PLN, detectedCountry: "Poland" };
    }
  } catch (e) {
    console.warn("Timezone/Locale detection fallback to USD", e);
  }

  return { currency: CURRENCIES.USD, detectedCountry: "United States" };
}
