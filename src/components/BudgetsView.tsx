import React, { useState } from 'react';
import {
  PieChart,
  Plus,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Edit2,
  ShoppingBag,
  Car,
  Home,
  HeartPulse,
  Film,
  GraduationCap,
  Briefcase,
  Gift,
  HelpCircle,
  X,
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { useFinance } from '../context/FinanceContext';
import { CategoryKey } from '../types/finance';

export const BudgetsView: React.FC = () => {
  const { t, formatCurrency, getCategoryName } = useI18n();
  const { budgets, categorySpending, setBudgetLimit } = useFinance();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('food');
  const [limitInput, setLimitInput] = useState<string>('');

  const totalBudgetLimit = budgets.reduce((acc, b) => acc + b.monthlyLimit, 0);
  const totalBudgetSpent = budgets.reduce(
    (acc, b) => acc + (categorySpending[b.category] || 0),
    0
  );
  const totalBudgetRemaining = totalBudgetLimit - totalBudgetSpent;
  const overallPercentage =
    totalBudgetLimit > 0 ? Math.round((totalBudgetSpent / totalBudgetLimit) * 100) : 0;

  const categoriesList: CategoryKey[] = [
    'food',
    'transport',
    'housing',
    'utilities',
    'healthcare',
    'entertainment',
    'shopping',
    'education',
    'other',
  ];

  const handleOpenModal = (cat?: CategoryKey, currentLimit?: number) => {
    setSelectedCategory(cat || 'food');
    setLimitInput(currentLimit ? currentLimit.toString() : '');
    setModalOpen(true);
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const limitNum = parseFloat(limitInput.replace(/\s+/g, ''));
    if (!isNaN(limitNum) && limitNum > 0) {
      setBudgetLimit(selectedCategory, limitNum);
      setModalOpen(false);
    }
  };

  const getCategoryIcon = (cat: CategoryKey) => {
    switch (cat) {
      case 'food':
        return ShoppingBag;
      case 'transport':
        return Car;
      case 'housing':
      case 'utilities':
        return Home;
      case 'healthcare':
        return HeartPulse;
      case 'entertainment':
        return Film;
      case 'shopping':
        return ShoppingBag;
      case 'education':
        return GraduationCap;
      case 'salary':
      case 'freelance':
      case 'investments':
        return Briefcase;
      case 'gifts':
        return Gift;
      default:
        return HelpCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t('budgets.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('budgets.subtitle')}
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t('buttons.addBudget')}</span>
        </button>
      </div>

      {/* Overall Budget Progress Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('budgets.overallBudget')}
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {formatCurrency(totalBudgetLimit)}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <span className="text-xs text-slate-400 block">{t('budgets.overallSpent')}</span>
              <span className="text-base font-bold text-slate-900">
                {formatCurrency(totalBudgetSpent)}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div>
              <span className="text-xs text-slate-400 block">{t('budgets.overallRemaining')}</span>
              <span
                className={`text-base font-bold ${
                  totalBudgetRemaining < 0 ? 'text-rose-600' : 'text-emerald-700'
                }`}
              >
                {formatCurrency(totalBudgetRemaining)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-600">
              {overallPercentage}% {t('financialTerms.spent').toLowerCase()}
            </span>
            <span
              className={
                overallPercentage > 100
                  ? 'text-rose-600'
                  : overallPercentage >= 80
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }
            >
              {overallPercentage > 100
                ? t('budgets.overBudget')
                : overallPercentage >= 80
                ? t('budgets.nearLimit')
                : t('budgets.onTrack')}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                overallPercentage > 100
                  ? 'bg-rose-500'
                  : overallPercentage >= 80
                  ? 'bg-amber-500'
                  : 'bg-emerald-600'
              }`}
              style={{ width: `${Math.min(100, overallPercentage)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((b) => {
          const CatIcon = getCategoryIcon(b.category);
          const spent = categorySpending[b.category] || 0;
          const remaining = b.monthlyLimit - spent;
          const ratio = b.monthlyLimit > 0 ? (spent / b.monthlyLimit) * 100 : 0;
          const isOver = ratio > 100;
          const isNear = ratio >= 80 && ratio <= 100;

          return (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-sm transition-shadow group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                      <CatIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        {getCategoryName(b.category)}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {t('financialTerms.limit')}: {formatCurrency(b.monthlyLimit)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenModal(b.category, b.monthlyLimit)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    title={t('buttons.edit')}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">{t('financialTerms.spent')}:</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(spent)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">{t('financialTerms.remaining')}:</span>
                    <span
                      className={`font-semibold ${
                        isOver ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {formatCurrency(remaining)}
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isOver
                          ? 'bg-rose-500'
                          : isNear
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, ratio)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">{Math.round(ratio)}%</span>
                <span
                  className={`font-medium flex items-center gap-1 ${
                    isOver
                      ? 'text-rose-600'
                      : isNear
                      ? 'text-amber-600'
                      : 'text-emerald-700'
                  }`}
                >
                  {isOver ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{t('budgets.overBudget')}</span>
                    </>
                  ) : isNear ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{t('budgets.nearLimit')}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('budgets.onTrack')}</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Set/Edit Budget Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {t('budgets.setLimitModal')}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('forms.category')}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as CategoryKey)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {getCategoryName(cat)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('forms.monthlyLimit')}
                </label>
                <input
                  type="number"
                  step="1000"
                  required
                  value={limitInput}
                  onChange={(e) => setLimitInput(e.target.value)}
                  placeholder={t('forms.monthlyLimitPlaceholder')}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  {t('buttons.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm"
                >
                  {t('buttons.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
