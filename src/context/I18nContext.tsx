import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Language, CategoryKey, TransactionType, PaymentMethod } from '../types/finance';
import uzLocale from '../locales/uz.json';
import ruLocale from '../locales/ru.json';
import enLocale from '../locales/en.json';

const locales: Record<Language, typeof uzLocale> = {
  uz: uzLocale,
  ru: ruLocale,
  en: enLocale,
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (dateInput: string | Date) => string;
  formatMonthYear: (year: number, monthIndex: number) => string;
  getCategoryName: (key: CategoryKey | string) => string;
  getTransactionTypeName: (key: TransactionType) => string;
  getPaymentMethodName: (key: PaymentMethod) => string;
  languageOptions: Array<{ code: Language; label: string; flag: string; nativeName: string }>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = 'moliya_language';

export const languageOptions: Array<{ code: Language; label: string; flag: string; nativeName: string }> = [
  { code: 'uz', label: "🇺🇿 O'zbekcha", flag: '🇺🇿', nativeName: "O'zbekcha" },
  { code: 'ru', label: '🇷🇺 Русский', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'en', label: '🇬🇧 English', flag: '🇬🇧', nativeName: 'English' },
];

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check localStorage, default to 'uz' (Uzbek 🇺🇿 for new users)
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'uz' || saved === 'ru' || saved === 'en') {
      return saved;
    }
    return 'uz';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Nested key resolver
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const currentDict = locales[language] || locales.uz;
      const keys = key.split('.');
      let result: any = currentDict;

      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          // Fallback to uz then key itself
          let fallback: any = locales.uz;
          for (const fbK of keys) {
            if (fallback && typeof fallback === 'object' && fbK in fallback) {
              fallback = fallback[fbK];
            } else {
              fallback = null;
              break;
            }
          }
          result = fallback || key;
          break;
        }
      }

      if (typeof result !== 'string') {
        return key;
      }

      let text = result;
      if (params) {
        Object.entries(params).forEach(([paramKey, paramVal]) => {
          text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
        });
      }

      return text;
    },
    [language]
  );

  // Currency formatting strictly complying with user requirement:
  // 🇺🇿 Uzbek: 1 500 000 so'm
  // 🇷🇺 Russian: 1 500 000 сум
  // 🇬🇧 English: 1,500,000 UZS
  const formatCurrency = useCallback(
    (amount: number): string => {
      const rounded = Math.round(amount);
      const isNegative = rounded < 0;
      const absoluteVal = Math.abs(rounded);

      if (language === 'uz') {
        const formatted = absoluteVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        return `${isNegative ? '-' : ''}${formatted} so'm`;
      } else if (language === 'ru') {
        const formatted = absoluteVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        return `${isNegative ? '-' : ''}${formatted} сум`;
      } else {
        const formatted = absoluteVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `${isNegative ? '-' : ''}${formatted} UZS`;
      }
    },
    [language]
  );

  // Date formatting complying with requirement:
  // Uzbek: "28-sentabr, 2026"
  // Russian: "28 сентября 2026 г."
  // English: "September 28, 2026"
  const formatDate = useCallback(
    (dateInput: string | Date): string => {
      const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
      if (isNaN(d.getTime())) return String(dateInput);

      const day = d.getDate();
      const monthIdx = d.getMonth();
      const year = d.getFullYear();

      const currentDict = locales[language] || locales.uz;
      const monthName = currentDict.dates?.months?.[monthIdx] || '';

      if (language === 'uz') {
        return `${day}-${monthName}, ${year}`;
      } else if (language === 'ru') {
        return `${day} ${monthName} ${year} г.`;
      } else {
        return `${monthName} ${day}, ${year}`;
      }
    },
    [language]
  );

  const formatMonthYear = useCallback(
    (year: number, monthIndex: number): string => {
      const currentDict = locales[language] || locales.uz;
      const monthName = currentDict.dates?.months?.[monthIndex] || '';
      // Capitalize first letter
      const capitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);
      if (language === 'ru') {
        // In Russian, nominative for header is e.g. Сентябрь
        const nominativeRu = [
          'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
          'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        return `${nominativeRu[monthIndex] || capitalized} ${year}`;
      }
      return `${capitalized} ${year}`;
    },
    [language]
  );

  const getCategoryName = useCallback(
    (catKey: CategoryKey | string): string => {
      const transKey = `categories.${catKey}`;
      const translated = t(transKey);
      return translated !== transKey ? translated : catKey;
    },
    [t]
  );

  const getTransactionTypeName = useCallback(
    (typeKey: TransactionType): string => {
      if (typeKey === 'income') return t('financialTerms.income');
      if (typeKey === 'expense') return t('financialTerms.expense');
      if (typeKey === 'transfer') return t('financialTerms.transfer');
      return typeKey;
    },
    [t]
  );

  const getPaymentMethodName = useCallback(
    (methodKey: PaymentMethod): string => {
      const transKey = `paymentMethods.${methodKey}`;
      const translated = t(transKey);
      return translated !== transKey ? translated : methodKey;
    },
    [t]
  );

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatCurrency,
        formatDate,
        formatMonthYear,
        getCategoryName,
        getTransactionTypeName,
        getPaymentMethodName,
        languageOptions,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
