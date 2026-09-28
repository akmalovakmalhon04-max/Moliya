import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  DollarSign,
  PieChart as PieIcon,
  BarChart2,
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { useFinance } from '../context/FinanceContext';
import { CategoryKey } from '../types/finance';

export const AnalyticsView: React.FC = () => {
  const { t, formatCurrency, getCategoryName } = useI18n();
  const {
    transactions,
    monthlyIncome,
    monthlyExpense,
    totalBalance,
    netSavingsRate,
    categorySpending,
  } = useFinance();

  const [period, setPeriod] = useState<'30days' | '3months' | 'year'>('3months');

  // Compute daily average and max expense
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const maxExpense = expenseTransactions.length > 0
    ? Math.max(...expenseTransactions.map((t) => t.amount))
    : 0;
  const dailyAverage = Math.round(monthlyExpense / 30);

  // Sample monthly mock trends for the bar chart
  const monthsTrend = [
    { labelUz: 'Iyul', labelRu: 'Июль', labelEn: 'July', income: 16500000, expense: 9800000 },
    { labelUz: 'Avgust', labelRu: 'Август', labelEn: 'August', income: 19000000, expense: 11200000 },
    { labelUz: 'Sentabr', labelRu: 'Сентябрь', labelEn: 'September', income: monthlyIncome, expense: monthlyExpense },
  ];

  const maxBarValue = Math.max(
    ...monthsTrend.map((m) => Math.max(m.income, m.expense)),
    20000000
  );

  return (
    <div className="space-y-6">
      {/* Header & Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t('analytics.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('analytics.subtitle')}
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setPeriod('30days')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              period === '30days'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('analytics.last30Days')}
          </button>
          <button
            onClick={() => setPeriod('3months')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              period === '3months'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('analytics.last3Months')}
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              period === 'year'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('analytics.thisYear')}
          </button>
        </div>
      </div>

      {/* Analytics KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('financialTerms.income')}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-700 mt-2">
            +{formatCurrency(monthlyIncome)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{t('dashboard.monthlyIncomeSub')}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('financialTerms.expense')}
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-rose-700 mt-2">
            -{formatCurrency(monthlyExpense)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{t('dashboard.monthlyExpenseSub')}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('analytics.dailyAverage')}
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">
            {formatCurrency(dailyAverage)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">/ 24h</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('analytics.maxExpense')}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-amber-700 mt-2">
            {formatCurrency(maxExpense)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{t('financialTerms.category')}</p>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expense Monthly Trend (2 cols on lg) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t('analytics.cashFlowTrend')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('analytics.incomeVsExpense')}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-600"></span>
                <span className="text-slate-600">{t('financialTerms.income')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-rose-500"></span>
                <span className="text-slate-600">{t('financialTerms.expense')}</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-64 flex items-end justify-around gap-6 pt-6 pb-2 border-b border-slate-100">
            {monthsTrend.map((m, idx) => {
              const incomeHeight = Math.round((m.income / maxBarValue) * 100);
              const expenseHeight = Math.round((m.expense / maxBarValue) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-2 h-48">
                    {/* Income bar */}
                    <div className="relative group w-8 sm:w-12 flex flex-col items-center">
                      <div
                        className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-t-lg transition-all duration-500"
                        style={{ height: `${incomeHeight}%` }}
                      ></div>
                      {/* Tooltip */}
                      <div className="absolute -top-8 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {formatCurrency(m.income)}
                      </div>
                    </div>

                    {/* Expense bar */}
                    <div className="relative group w-8 sm:w-12 flex flex-col items-center">
                      <div
                        className="w-full bg-rose-500 hover:bg-rose-600 rounded-t-lg transition-all duration-500"
                        style={{ height: `${expenseHeight}%` }}
                      ></div>
                      {/* Tooltip */}
                      <div className="absolute -top-8 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {formatCurrency(m.expense)}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-slate-700 mt-2">
                    {m.labelUz}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{t('dashboard.savingsRate')}: {netSavingsRate}%</span>
            <span>{t('dashboard.netCashFlow')}: {formatCurrency(totalBalance)}</span>
          </div>
        </div>

        {/* Category Breakdown (1 col on lg) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {t('analytics.categoryBreakdown')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('analytics.topSpendingCategories')}
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {Object.entries(categorySpending)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, amount]) => {
                const percent =
                  monthlyExpense > 0 ? Math.round((amount / monthlyExpense) * 100) : 0;

                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">
                        {getCategoryName(cat)}
                      </span>
                      <span className="font-bold text-slate-900">
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
      </div>
    </div>
  );
};
