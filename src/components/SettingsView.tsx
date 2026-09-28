import React, { useState } from 'react';
import {
  Globe,
  User,
  Shield,
  RotateCcw,
  Check,
  Save,
  CreditCard,
  Bell,
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { Language } from '../types/finance';

interface SettingsViewProps {
  onShowToast: (message: string) => void;
  onOpenResetConfirm: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onShowToast,
  onOpenResetConfirm,
}) => {
  const { language, setLanguage, t, languageOptions, formatCurrency } = useI18n();
  const { user, updateProfile } = useAuth();
  const { totalBalance } = useFinance();

  const [name, setName] = useState(user?.name || 'Akmalxon Akmalov');
  const [email, setEmail] = useState(user?.email || 'akmalovakmalhon04@gmail.com');
  const [monthlyTarget, setMonthlyTarget] = useState(
    user?.monthlyIncomeTarget ? user.monthlyIncomeTarget.toString() : '18000000'
  );
  const [notifications, setNotifications] = useState(user?.notifications ?? true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const targetNum = parseFloat(monthlyTarget.replace(/\s+/g, '')) || 0;
    updateProfile({
      name,
      email,
      monthlyIncomeTarget: targetNum,
      notifications,
    });
    onShowToast(t('settings.savedSuccess'));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {t('settings.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* 1. Language Selector Card (MANDATORY REQUIREMENT) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {t('settings.languageSection')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('settings.languageDesc')}
            </p>
          </div>
        </div>

        {/* Language Options Grid: 🇺🇿 O'zbekcha, 🇷🇺 Русский, 🇬🇧 English */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {languageOptions.map((opt) => {
            const isSelected = language === opt.code;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => {
                  setLanguage(opt.code as Language);
                  if (user) {
                    updateProfile({ language: opt.code as Language });
                  }
                  onShowToast(t('notifications.languageChanged'));
                }}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{opt.flag}</span>
                  <div>
                    <span className="block text-sm font-bold text-slate-900">
                      {opt.label}
                    </span>
                    <span className="text-xs text-slate-500">
                      {opt.nativeName}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Currency Presentation Style */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {t('settings.currencySection')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('settings.currencyDesc')}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-500 block">UZS — so'm:</span>
            <span className="text-lg font-bold text-slate-900">
              {formatCurrency(1500000)}
            </span>
          </div>
          <div className="text-xs text-slate-500">
            {t('dashboard.totalBalance')}: <span className="font-semibold text-slate-900">{formatCurrency(totalBalance)}</span>
          </div>
        </div>
      </div>

      {/* 3. User Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {t('settings.profileSection')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('settings.profileDesc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('forms.fullName')}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('forms.email')}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('forms.monthlyIncomeTarget')}
            </label>
            <input
              type="number"
              step="10000"
              value={monthlyTarget}
              onChange={(e) => setMonthlyTarget(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <span>{t('forms.notificationsEnabled')}</span>
          </label>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{t('buttons.saveChanges')}</span>
          </button>
        </div>
      </form>

      {/* 4. Data Management & Reset */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {t('settings.dataSection')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('settings.dataDesc')}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs text-slate-600">
            {t('settings.resetDataConfirm')}
          </div>
          <button
            type="button"
            onClick={onOpenResetConfirm}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('buttons.resetDemoData')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
