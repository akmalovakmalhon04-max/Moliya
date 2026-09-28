import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Plus,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CreditCard,
  Banknote,
  Building,
  Coins,
  ShoppingBag,
  Car,
  Home,
  HeartPulse,
  Film,
  GraduationCap,
  Briefcase,
  Gift,
  HelpCircle,
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { useFinance } from '../context/FinanceContext';
import { CategoryKey, PaymentMethod } from '../types/finance';

interface DashboardViewProps {
  onOpenAddTransaction: () => void;
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenAddTransaction,
  onNavigate,
}) => {
  const { t, formatCurrency, formatDate, getCategoryName, getPaymentMethodName } = useI18n();
  const {
    totalBalance,
    monthlyIncome,
    monthlyExpense,
    netSavingsRate,
    transactions,
    categorySpending,
    budgets,
    aiInsights,
    isAiLoading,
    fetchAiInsights,
  } = useFinance();

  const recentTransactions = transactions.slice(0, 5);

  // Category Icon Resolver
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

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'card':
        return CreditCard;
      case 'cash':
        return Banknote;
      case 'bank_transfer':
        return Building;
      case 'crypto':
        return Coins;
    }
  };

  // Sorted spending categories
  const sortedCategories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Greeting & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {t('dashboard.greeting')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('ai')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{t('dashboard.runAiAnalysis')}</span>
          </button>
          <button
            onClick={onOpenAddTransaction}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t('dashboard.quickAdd')}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('dashboard.totalBalance')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              {formatCurrency(totalBalance)}
            </div>
            <p className="text-xs text-slate-400 mt-1">{t('dashboard.totalBalanceSub')}</p>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('dashboard.monthlyIncome')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-emerald-700">
              +{formatCurrency(monthlyIncome)}
            </div>
            <p className="text-xs text-slate-400 mt-1">{t('dashboard.monthlyIncomeSub')}</p>
          </div>
        </div>

        {/* Monthly Expense */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('dashboard.monthlyExpense')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-rose-700">
              -{formatCurrency(monthlyExpense)}
            </div>
            <p className="text-xs text-slate-400 mt-1">{t('dashboard.monthlyExpenseSub')}</p>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('dashboard.savings')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-sky-700">
              {netSavingsRate}%
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-sky-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, netSavingsRate))}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">{t('dashboard.savingsRate')}</p>
          </div>
        </div>
      </div>

      {/* AI Financial Insights Highlight Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm border border-emerald-800/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-300 uppercase">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{t('dashboard.aiHighlightTitle')}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300 font-normal">{t('ai.modelPowered')}</span>
            </div>

            <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
              {isAiLoading ? (
                <span className="animate-pulse">{t('ai.generatingInsights')}</span>
              ) : (
                aiInsights?.summary || t('ai.intro')
              )}
            </p>

            {aiInsights?.budgetAlert && (
              <div className="flex items-center gap-2 text-xs text-amber-200 bg-amber-950/40 border border-amber-500/30 px-3 py-1.5 rounded-lg w-fit mt-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{aiInsights.budgetAlert}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('ai')}
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-all shadow-sm"
          >
            <span>{t('ai.askAdvice')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Grid: Recent Transactions & Category Spending */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions List (2 columns on lg) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {t('dashboard.recentTransactions')}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('transactions.subtitle')}
                </p>
              </div>
              <button
                onClick={() => onNavigate('transactions')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 p-1 rounded transition-colors"
              >
                <span>{t('dashboard.viewAll')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentTransactions.map((tx) => {
                const CatIcon = getCategoryIcon(tx.category);
                const MethodIcon = getMethodIcon(tx.paymentMethod);
                const isExpense = tx.type === 'expense';
                const isIncome = tx.type === 'income';

                return (
                  <div
                    key={tx.id}
                    className="py-3.5 flex items-center justify-between gap-3 group hover:bg-slate-50/60 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isIncome
                            ? 'bg-emerald-100 text-emerald-700'
                            : isExpense
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        <CatIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {tx.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>{getCategoryName(tx.category)}</span>
                          <span aria-hidden="true">·</span>
                          <span>{formatDate(tx.date)}</span>
                          <span aria-hidden="true" className="hidden sm:inline">·</span>
                          <span className="hidden sm:flex items-center gap-1">
                            <MethodIcon className="w-3 h-3 text-slate-400" />
                            <span>{getPaymentMethodName(tx.paymentMethod)}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`text-sm font-bold ${
                          isIncome
                            ? 'text-emerald-700'
                            : isExpense
                            ? 'text-slate-900'
                            : 'text-blue-700'
                        }`}
                      >
                        {isIncome ? '+' : isExpense ? '-' : ''}
                        {formatCurrency(tx.amount)}
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {isIncome
                          ? t('financialTerms.income')
                          : isExpense
                          ? t('financialTerms.expense')
                          : t('financialTerms.transfer')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {transactions.length} {t('financialTerms.analytics').toLowerCase()}
            </span>
            <button
              onClick={() => onNavigate('transactions')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900"
            >
              {t('buttons.viewAll')} →
            </button>
          </div>
        </div>

        {/* Category Breakdown & Budget Highlights (1 column on lg) */}
        <div className="space-y-6">
          {/* Spending by category */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {t('dashboard.spendingByCategory')}
              </h2>
              <button
                onClick={() => onNavigate('analytics')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                {t('dashboard.viewAll')}
              </button>
            </div>

            <div className="space-y-4">
              {sortedCategories.map(([cat, amount]) => {
                const CatIcon = getCategoryIcon(cat as CategoryKey);
                const percent =
                  monthlyExpense > 0 ? Math.round((amount / monthlyExpense) * 100) : 0;

                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <CatIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{getCategoryName(cat)}</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(amount)} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Budget Quick Peek */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {t('dashboard.budgetOverview')}
              </h2>
              <button
                onClick={() => onNavigate('budgets')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                {t('dashboard.viewAll')}
              </button>
            </div>

            <div className="space-y-3">
              {budgets.slice(0, 3).map((b) => {
                const spent = categorySpending[b.category] || 0;
                const ratio = b.monthlyLimit > 0 ? (spent / b.monthlyLimit) * 100 : 0;
                const isOver = ratio > 100;
                const isNear = ratio >= 80 && ratio <= 100;

                return (
                  <div key={b.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-900 mb-1">
                      <span>{getCategoryName(b.category)}</span>
                      <span
                        className={
                          isOver ? 'text-rose-600' : isNear ? 'text-amber-600' : 'text-slate-600'
                        }
                      >
                        {formatCurrency(spent)} / {formatCurrency(b.monthlyLimit)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${
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
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
