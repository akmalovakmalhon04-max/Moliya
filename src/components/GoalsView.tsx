import React, { useState } from 'react';
import {
  Target,
  Plus,
  PiggyBank,
  Calendar,
  Sparkles,
  Trash2,
  X,
  CheckCircle,
  Coins,
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { useFinance } from '../context/FinanceContext';
import { SavingsGoal } from '../types/finance';

export const GoalsView: React.FC = () => {
  const { t, formatCurrency, formatDate } = useI18n();
  const { goals, addGoal, depositToGoal, deleteGoal } = useFinance();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newCurrent, setNewCurrent] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  const [depositAmount, setDepositAmount] = useState('');

  const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(newTarget.replace(/\s+/g, ''));
    const current = parseFloat(newCurrent.replace(/\s+/g, '')) || 0;
    if (!newTitle.trim() || isNaN(target) || target <= 0) return;

    addGoal({
      title: newTitle.trim(),
      targetAmount: target,
      currentAmount: current,
      deadline: newDeadline || '2027-12-31',
    });

    setNewTitle('');
    setNewTarget('');
    setNewCurrent('');
    setNewDeadline('');
    setAddModalOpen(false);
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;
    const amount = parseFloat(depositAmount.replace(/\s+/g, ''));
    if (!isNaN(amount) && amount > 0) {
      depositToGoal(selectedGoal.id, amount);
      setDepositAmount('');
      setDepositModalOpen(false);
      setSelectedGoal(null);
    }
  };

  const calculateDaysLeft = (deadlineStr: string) => {
    const today = new Date();
    const target = new Date(deadlineStr);
    const diffTime = target.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t('goals.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('goals.subtitle')}
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t('goals.addNewGoal')}</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {t('goals.totalSaved')}
          </span>
          <div className="text-2xl font-bold text-emerald-700 mt-2">
            {formatCurrency(totalSaved)}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {t('goals.totalTarget')}
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {formatCurrency(totalTarget)}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {t('goals.activeGoalsCount')}
          </span>
          <div className="text-2xl font-bold text-sky-700 mt-2">
            {goals.length}
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">{t('goals.noGoals')}</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">{t('goals.noGoalsDesc')}</p>
          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{t('goals.addNewGoal')}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((goal) => {
            const percent =
              goal.targetAmount > 0
                ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
                : 0;
            const isCompleted = percent >= 100;
            const daysLeft = calculateDaysLeft(goal.deadline);

            return (
              <div
                key={goal.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-sm transition-all relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 line-clamp-1">
                          {goal.title}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(goal.deadline)}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-slate-300 hover:text-rose-500 p-1 rounded-lg transition-colors"
                      title={t('buttons.delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress section */}
                  <div className="mt-5 space-y-2">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="text-slate-500">{t('financialTerms.current')}:</span>
                      <span className="text-sm font-bold text-slate-900">
                        {formatCurrency(goal.currentAmount)}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-emerald-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
                      <span>{t('goals.progress', { percent })}</span>
                      <span>
                        {t('financialTerms.target')}: {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs">
                    {isCompleted ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {t('goals.reached')}
                      </span>
                    ) : (
                      <span className="text-slate-500">
                        {t('goals.daysLeft', { days: daysLeft })}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedGoal(goal);
                      setDepositModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>{t('buttons.deposit')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Goal Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {t('goals.addNewGoal')}
              </h2>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('forms.goalTitle')}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={t('forms.goalTitlePlaceholder')}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('forms.targetAmount')}
                </label>
                <input
                  type="number"
                  step="1000"
                  required
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  placeholder={t('forms.targetAmountPlaceholder')}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('forms.currentAmount')}
                </label>
                <input
                  type="number"
                  step="1000"
                  value={newCurrent}
                  onChange={(e) => setNewCurrent(e.target.value)}
                  placeholder={t('forms.currentAmountPlaceholder')}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('forms.deadline')}
                </label>
                <input
                  type="date"
                  required
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
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

      {/* Deposit to Goal Modal */}
      {depositModalOpen && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {t('goals.depositTitle')}
                </h2>
                <p className="text-xs text-slate-500">{selectedGoal.title}</p>
              </div>
              <button
                onClick={() => setDepositModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeposit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t('forms.depositAmount')}
                </label>
                <input
                  type="number"
                  step="1000"
                  required
                  autoFocus
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder={t('forms.depositPlaceholder')}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDepositModalOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  {t('buttons.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm"
                >
                  {t('buttons.deposit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
