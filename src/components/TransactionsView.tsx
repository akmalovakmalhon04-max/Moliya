import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  Download,
  ArrowUpDown,
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
import { Transaction, TransactionType, CategoryKey, PaymentMethod } from '../types/finance';

interface TransactionsViewProps {
  onOpenAddTransaction: () => void;
  onOpenEditTransaction: (tx: Transaction) => void;
  onOpenDeleteConfirm: (id: string, description: string) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  onOpenAddTransaction,
  onOpenEditTransaction,
  onOpenDeleteConfirm,
}) => {
  const { t, formatCurrency, formatDate, getCategoryName, getPaymentMethodName } = useI18n();
  const { transactions } = useFinance();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  const categoriesList: CategoryKey[] = [
    'food',
    'transport',
    'housing',
    'utilities',
    'healthcare',
    'entertainment',
    'shopping',
    'education',
    'salary',
    'freelance',
    'investments',
    'gifts',
    'other',
  ];

  const paymentMethodsList: PaymentMethod[] = ['card', 'cash', 'bank_transfer', 'crypto'];

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // search filter
        if (
          searchTerm.trim() &&
          !tx.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !tx.amount.toString().includes(searchTerm)
        ) {
          return false;
        }
        // type filter
        if (selectedType !== 'all' && tx.type !== selectedType) {
          return false;
        }
        // category filter
        if (selectedCategory !== 'all' && tx.category !== selectedCategory) {
          return false;
        }
        // method filter
        if (selectedMethod !== 'all' && tx.paymentMethod !== selectedMethod) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === 'highest') return b.amount - a.amount;
        if (sortBy === 'lowest') return a.amount - b.amount;
        return 0;
      });
  }, [transactions, searchTerm, selectedType, selectedCategory, selectedMethod, sortBy]);

  const exportCsv = () => {
    const headers = [
      t('financialTerms.date'),
      t('financialTerms.notes'),
      t('financialTerms.category'),
      t('financialTerms.status'),
      t('financialTerms.paymentMethod'),
      t('financialTerms.amount'),
    ];

    const rows = filteredTransactions.map((tx) => [
      tx.date,
      `"${tx.description.replace(/"/g, '""')}"`,
      `"${getCategoryName(tx.category)}"`,
      tx.type,
      `"${getPaymentMethodName(tx.paymentMethod)}"`,
      tx.amount,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `moliya_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            {t('transactions.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('transactions.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>{t('buttons.export')}</span>
          </button>

          <button
            onClick={onOpenAddTransaction}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t('buttons.addTransaction')}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('transactions.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label={t('forms.type')}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">{t('transactions.allTypes')}</option>
              <option value="income">{t('financialTerms.income')}</option>
              <option value="expense">{t('financialTerms.expense')}</option>
              <option value="transfer">{t('financialTerms.transfer')}</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label={t('forms.category')}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">{t('transactions.allCategories')}</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {getCategoryName(cat)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label={t('transactions.sortBy')}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="newest">{t('transactions.newestFirst')}</option>
              <option value="oldest">{t('transactions.oldestFirst')}</option>
              <option value="highest">{t('transactions.highestAmount')}</option>
              <option value="lowest">{t('transactions.lowestAmount')}</option>
            </select>
          </div>
        </div>

        {/* Active Filter Clear */}
        {(searchTerm || selectedType !== 'all' || selectedCategory !== 'all' || selectedMethod !== 'all') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>{filteredTransactions.length} {t('transactions.title').toLowerCase()}</span>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedCategory('all');
                setSelectedMethod('all');
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              {t('buttons.reset')}
            </button>
          </div>
        )}
      </div>

      {/* Transactions List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {t('transactions.noTransactionsFound')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              {t('transactions.noTransactionsDesc')}
            </p>
            <button
              onClick={onOpenAddTransaction}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{t('buttons.addTransaction')}</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">{t('transactions.tableDate')}</th>
                  <th className="px-6 py-3.5">{t('transactions.tableDescription')}</th>
                  <th className="px-6 py-3.5">{t('transactions.tableCategory')}</th>
                  <th className="px-6 py-3.5">{t('transactions.tableMethod')}</th>
                  <th className="px-6 py-3.5 text-right">{t('transactions.tableAmount')}</th>
                  <th className="px-6 py-3.5 text-center">{t('transactions.tableActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => {
                  const CatIcon = getCategoryIcon(tx.category);
                  const isExpense = tx.type === 'expense';
                  const isIncome = tx.type === 'income';

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">
                        {formatDate(tx.date)}
                      </td>

                      {/* Description */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isIncome
                                ? 'bg-emerald-100 text-emerald-700'
                                : isExpense
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            <CatIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 line-clamp-1">
                              {tx.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        {getCategoryName(tx.category)}
                      </td>

                      {/* Payment Method */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs">
                        {getPaymentMethodName(tx.paymentMethod)}
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-sm">
                        <span
                          className={
                            isIncome
                              ? 'text-emerald-700'
                              : isExpense
                              ? 'text-slate-900'
                              : 'text-blue-700'
                          }
                        >
                          {isIncome ? '+' : isExpense ? '-' : ''}
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onOpenEditTransaction(tx)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                            title={t('buttons.edit')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onOpenDeleteConfirm(tx.id, tx.description)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title={t('buttons.delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
