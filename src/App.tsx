import React, { useState } from 'react';
import { I18nProvider, useI18n } from './context/I18nContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { BudgetsView } from './components/BudgetsView';
import { GoalsView } from './components/GoalsView';
import { AnalyticsView } from './components/AnalyticsView';
import { AiInsightsView } from './components/AiInsightsView';
import { SettingsView } from './components/SettingsView';
import { TransactionModal } from './components/TransactionModal';
import { AuthModal } from './components/AuthModal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Toast } from './components/Toast';
import { Transaction } from './types/finance';

const MainApp: React.FC = () => {
  const { t, language } = useI18n();
  const { addTransaction, updateTransaction, deleteTransaction, resetDemoData } = useFinance();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal states
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; desc: string } | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleOpenAddTransaction = () => {
    setEditingTransaction(null);
    setTransactionModalOpen(true);
  };

  const handleOpenEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setTransactionModalOpen(true);
  };

  const handleSaveTransaction = (txData: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, txData);
      setToastMessage(t('notifications.transactionUpdated'));
    } else {
      addTransaction(txData);
      setToastMessage(t('notifications.transactionAdded'));
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      deleteTransaction(deleteConfirm.id);
      setToastMessage(t('notifications.transactionDeleted'));
      setDeleteConfirm(null);
    }
  };

  const handleConfirmReset = () => {
    resetDemoData();
    setToastMessage(t('notifications.dataResetSuccess'));
    setResetConfirmOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddTransaction={handleOpenAddTransaction}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            onOpenAddTransaction={handleOpenAddTransaction}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsView
            onOpenAddTransaction={handleOpenAddTransaction}
            onOpenEditTransaction={handleOpenEditTransaction}
            onOpenDeleteConfirm={(id, desc) => setDeleteConfirm({ id, desc })}
          />
        )}

        {activeTab === 'budgets' && <BudgetsView />}

        {activeTab === 'goals' && <GoalsView />}

        {activeTab === 'analytics' && <AnalyticsView />}

        {activeTab === 'ai' && <AiInsightsView />}

        {activeTab === 'settings' && (
          <SettingsView
            onShowToast={(msg) => setToastMessage(msg)}
            onOpenResetConfirm={() => setResetConfirmOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">{t('app.name')}</span>
            <span>·</span>
            <span>{t('app.tagline')}</span>
          </div>

          <div className="flex items-center gap-3">
            <span>© 2026 {t('app.allRightsReserved')}</span>
            <span>·</span>
            <span className="font-medium text-slate-700">
              {language === 'uz' ? "🇺🇿 O'zbekcha" : language === 'ru' ? '🇷🇺 Русский' : '🇬🇧 English'}
            </span>
          </div>
        </div>
      </footer>

      {/* Transaction Modal (Add / Edit) */}
      <TransactionModal
        isOpen={transactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        onSave={handleSaveTransaction}
        initialTransaction={editingTransaction}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onShowToast={(msg) => setToastMessage(msg)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title={t('transactions.deleteConfirmTitle')}
        description={`${deleteConfirm?.desc}: ${t('transactions.deleteConfirmDesc')}`}
        confirmLabel={t('buttons.delete')}
        cancelLabel={t('buttons.cancel')}
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />

      {/* Reset Data Confirmation Dialog */}
      <ConfirmDialog
        isOpen={resetConfirmOpen}
        title={t('buttons.resetDemoData')}
        description={t('settings.resetDataConfirm')}
        confirmLabel={t('buttons.confirm')}
        cancelLabel={t('buttons.cancel')}
        isDestructive={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setResetConfirmOpen(false)}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
};

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <FinanceProvider>
          <MainApp />
        </FinanceProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
