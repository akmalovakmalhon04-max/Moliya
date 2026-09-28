import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  BrainCircuit,
  ArrowUpRight,
  Flame,
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { useFinance } from '../context/FinanceContext';

export const AiInsightsView: React.FC = () => {
  const { t, language } = useI18n();
  const { aiInsights, isAiLoading, fetchAiInsights } = useFinance();

  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'alerts'>('overview');

  const getLanguageLead = () => {
    switch (language) {
      case 'uz':
        return "Sizning oxirgi 3 oydagi xarajatlaringiz tahlili...";
      case 'ru':
        return "Анализ ваших расходов за последние 3 месяца...";
      case 'en':
      default:
        return "Here is an analysis of your spending over the last 3 months...";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{t('ai.modelPowered')}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t('ai.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('ai.subtitle')}
          </p>
        </div>

        <button
          onClick={() => fetchAiInsights(true)}
          disabled={isAiLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <RefreshCw className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
          <span>{isAiLoading ? t('ai.loading') : t('ai.regenerate')}</span>
        </button>
      </div>

      {/* Main Analysis Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        {/* Intro Highlight Quote */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-emerald-50/60 to-slate-50 border border-emerald-100/80">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
            <BrainCircuit className="w-4 h-4 text-emerald-600" />
            <span>{getLanguageLead()}</span>
          </div>
          <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
            {aiInsights?.summary || getLanguageLead()}
          </p>
        </div>

        {/* Budget Alert Banner */}
        {aiInsights?.budgetAlert && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                {t('ai.budgetAlert')}
              </h4>
              <p className="text-xs sm:text-sm text-amber-900 mt-0.5">
                {aiInsights.budgetAlert}
              </p>
            </div>
          </div>
        )}

        {/* Observations & Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Key Observations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                {t('ai.keyObservations')}
              </h3>
            </div>

            <div className="space-y-2.5">
              {(aiInsights?.keyObservations || []).map((obs, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {obs}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900">
                {t('ai.recommendations')}
              </h3>
            </div>

            <div className="space-y-3">
              {(aiInsights?.recommendations || []).map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      {rec.title}
                    </h4>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        rec.impact === 'high'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rec.impact === 'medium'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {rec.impact === 'high'
                        ? t('ai.impactHigh')
                        : rec.impact === 'medium'
                        ? t('ai.impactMedium')
                        : t('ai.impactLow')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
