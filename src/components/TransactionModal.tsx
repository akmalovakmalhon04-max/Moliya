import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { Transaction, TransactionType, CategoryKey, PaymentMethod } from '../types/finance';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id'>) => void;
  initialTransaction?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTransaction,
}) => {
  const { t, getCategoryName, getPaymentMethodName } = useI18n();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryKey>('food');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  useEffect(() => {
    if (initialTransaction) {
      setType(initialTransaction.type);
      setAmount(initialTransaction.amount.toString());
      setCategory(initialTransaction.category);
      setDate(initialTransaction.date);
      setDescription(initialTransaction.description);
      setPaymentMethod(initialTransaction.paymentMethod);
    } else {
      setType('expense');
      setAmount('');
      setCategory('food');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setPaymentMethod('card');
    }
  }, [initialTransaction, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmount = parseFloat(amount.replace(/\s+/g, ''));
    if (isNaN(cleanAmount) || cleanAmount <= 0) return;

    onSave({
      type,
      amount: cleanAmount,
      category,
      date,
      description: description.trim(),
      paymentMethod,
    });
    onClose();
  };

  const categories: CategoryKey[] = [
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

  const paymentMethods: PaymentMethod[] = ['card', 'cash', 'bank_transfer', 'crypto'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {initialTransaction ? t('transactions.editTitle') : t('transactions.addNew')}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Transaction Type Segmented Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('forms.type')}
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-colors ${
                  type === 'expense'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>{t('financialTerms.expense')}</span>
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-colors ${
                  type === 'income'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{t('financialTerms.income')}</span>
              </button>
              <button
                type="button"
                onClick={() => setType('transfer')}
                className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-colors ${
                  type === 'transfer'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>{t('financialTerms.transfer')}</span>
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('forms.amount')}
            </label>
            <input
              type="number"
              step="100"
              required
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t('forms.amountPlaceholder')}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* Category & Payment Method Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t('forms.category')}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryKey)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {getCategoryName(cat)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t('forms.paymentMethod')}
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {getPaymentMethodName(method)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('forms.date')}
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('forms.description')}
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('forms.descriptionPlaceholder')}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {t('buttons.cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm transition-all"
            >
              {t('buttons.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
