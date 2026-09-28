import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { Transaction, Budget, SavingsGoal, AiInsightData, CategoryKey } from '../types/finance';
import { useI18n } from './I18nContext';

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  netSavingsRate: number;
  categorySpending: Record<CategoryKey, number>;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setBudgetLimit: (category: CategoryKey, monthlyLimit: number) => void;
  addGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  depositToGoal: (goalId: string, amount: number) => void;
  deleteGoal: (id: string) => void;
  aiInsights: AiInsightData | null;
  isAiLoading: boolean;
  fetchAiInsights: (force?: boolean) => Promise<void>;
  resetDemoData: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const TX_STORAGE_KEY = 'moliya_transactions';
const BUDGETS_STORAGE_KEY = 'moliya_budgets';
const GOALS_STORAGE_KEY = 'moliya_goals';

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1',
    type: 'income',
    amount: 18000000,
    category: 'salary',
    date: '2026-09-05',
    description: 'IT Kompaniya oylik ish haqi',
    paymentMethod: 'card',
  },
  {
    id: 'tx_2',
    type: 'income',
    amount: 4500000,
    category: 'freelance',
    date: '2026-09-12',
    description: 'Veb-sayt dizayni va dasturlash',
    paymentMethod: 'bank_transfer',
  },
  {
    id: 'tx_3',
    type: 'expense',
    amount: 2850000,
    category: 'food',
    date: '2026-09-15',
    description: 'Korzinka & Makro oziq-ovqat xaridlari',
    paymentMethod: 'card',
  },
  {
    id: 'tx_4',
    type: 'expense',
    amount: 1200000,
    category: 'transport',
    date: '2026-09-18',
    description: 'Yoqilg\'i quyish va Yandex Go',
    paymentMethod: 'card',
  },
  {
    id: 'tx_5',
    type: 'expense',
    amount: 850000,
    category: 'utilities',
    date: '2026-09-20',
    description: 'Elektr energiyasi va tabiiy gaz to\'lovi',
    paymentMethod: 'card',
  },
  {
    id: 'tx_6',
    type: 'expense',
    amount: 1450000,
    category: 'entertainment',
    date: '2026-09-22',
    description: 'Oilaviy kechki ovqat va kinoteatr',
    paymentMethod: 'card',
  },
  {
    id: 'tx_7',
    type: 'expense',
    amount: 720000,
    category: 'healthcare',
    date: '2026-09-24',
    description: 'Dorixona va stomatolog ko\'rigi',
    paymentMethod: 'card',
  },
  {
    id: 'tx_8',
    type: 'expense',
    amount: 1600000,
    category: 'shopping',
    date: '2026-09-26',
    description: 'Kuzgi mavsum kiyimlari',
    paymentMethod: 'card',
  },
  {
    id: 'tx_9',
    type: 'transfer',
    amount: 3000000,
    category: 'other',
    date: '2026-09-27',
    description: 'Favqulodda zaxira jamg\'armasiga o\'tkazma',
    paymentMethod: 'card',
    goalId: 'goal_1',
  },
];

const INITIAL_BUDGETS: Budget[] = [
  { id: 'b_1', category: 'food', monthlyLimit: 4000000 },
  { id: 'b_2', category: 'transport', monthlyLimit: 1800000 },
  { id: 'b_3', category: 'entertainment', monthlyLimit: 1800000 },
  { id: 'b_4', category: 'utilities', monthlyLimit: 1200000 },
  { id: 'b_5', category: 'shopping', monthlyLimit: 2500000 },
  { id: 'b_6', category: 'healthcare', monthlyLimit: 1500000 },
];

const INITIAL_GOALS: SavingsGoal[] = [
  {
    id: 'goal_1',
    title: 'Favqulodda jamg\'arma (6 oylik xarajat)',
    targetAmount: 50000000,
    currentAmount: 24000000,
    deadline: '2027-03-31',
    category: 'other',
  },
  {
    id: 'goal_2',
    title: 'Yangi elektromobil boshlang\'ich to\'lovi',
    targetAmount: 120000000,
    currentAmount: 48000000,
    deadline: '2027-09-30',
    category: 'transport',
  },
  {
    id: 'goal_3',
    title: 'Dubay oilaviy sayohati',
    targetAmount: 25000000,
    currentAmount: 16500000,
    deadline: '2026-12-25',
    category: 'entertainment',
  },
];

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { language } = useI18n();

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(TX_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    try {
      const saved = localStorage.getItem(BUDGETS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
    } catch {
      return INITIAL_BUDGETS;
    }
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    try {
      const saved = localStorage.getItem(GOALS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_GOALS;
    } catch {
      return INITIAL_GOALS;
    }
  });

  const [aiInsights, setAiInsights] = useState<AiInsightData | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(BUDGETS_STORAGE_KEY, JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  // Derived financial metrics
  const { totalBalance, monthlyIncome, monthlyExpense, netSavingsRate, categorySpending } = useMemo(() => {
    let income = 0;
    let expense = 0;
    const catSpend: Record<string, number> = {};

    transactions.forEach((tx) => {
      if (tx.type === 'income') {
        income += tx.amount;
      } else if (tx.type === 'expense') {
        expense += tx.amount;
        catSpend[tx.category] = (catSpend[tx.category] || 0) + tx.amount;
      }
    });

    const balance = income - expense;
    const savingsRate = income > 0 ? Math.max(0, Math.round(((income - expense) / income) * 100)) : 0;

    return {
      totalBalance: balance,
      monthlyIncome: income,
      monthlyExpense: expense,
      netSavingsRate: savingsRate,
      categorySpending: catSpend as Record<CategoryKey, number>,
    };
  }, [transactions]);

  const addTransaction = useCallback((newTx: Omit<Transaction, 'id'>) => {
    const tx: Transaction = {
      ...newTx,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };
    setTransactions((prev) => [tx, ...prev]);

    // If linked to goal deposit
    if (tx.goalId && tx.type === 'transfer') {
      setGoals((prev) =>
        prev.map((g) => (g.id === tx.goalId ? { ...g, currentAmount: g.currentAmount + tx.amount } : g))
      );
    }
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx)));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }, []);

  const setBudgetLimit = useCallback((category: CategoryKey, monthlyLimit: number) => {
    setBudgets((prev) => {
      const idx = prev.findIndex((b) => b.category === category);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], monthlyLimit };
        return next;
      } else {
        return [...prev, { id: `b_${Date.now()}`, category, monthlyLimit }];
      }
    });
  }, []);

  const addGoal = useCallback((goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
    };
    setGoals((prev) => [...prev, newGoal]);
  }, []);

  const depositToGoal = useCallback((goalId: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g))
    );
    // Also record transaction
    const targetGoal = goals.find((g) => g.id === goalId);
    const desc = targetGoal ? `Jamg'arma to'ldirildi: ${targetGoal.title}` : 'Jamg\'armaga mablag\' qo\'shildi';
    setTransactions((prev) => [
      {
        id: `tx_${Date.now()}`,
        type: 'transfer',
        amount,
        category: targetGoal?.category || 'other',
        date: new Date().toISOString().split('T')[0],
        description: desc,
        paymentMethod: 'card',
        goalId,
      },
      ...prev,
    ]);
  }, [goals]);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const resetDemoData = useCallback(() => {
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    setGoals(INITIAL_GOALS);
    setAiInsights(null);
    localStorage.removeItem(TX_STORAGE_KEY);
    localStorage.removeItem(BUDGETS_STORAGE_KEY);
    localStorage.removeItem(GOALS_STORAGE_KEY);
  }, []);

  const fetchAiInsights = useCallback(
    async (force = false) => {
      if (aiInsights && !force) return;
      setIsAiLoading(true);
      try {
        const topExpenses = transactions
          .filter((t) => t.type === 'expense')
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5)
          .map((t) => ({ description: t.description, amount: t.amount, category: t.category }));

        const budgetStatus = budgets.map((b) => ({
          category: b.category,
          limit: b.monthlyLimit,
          spent: categorySpending[b.category] || 0,
        }));

        const res = await fetch('/api/ai/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language,
            type: 'monthly_overview',
            financialData: {
              totalBalance,
              monthlyIncome,
              monthlyExpense,
              savingsRate: netSavingsRate,
              categorySpending,
              topExpenses,
              budgets: budgetStatus,
              goals: goals.map((g) => ({ title: g.title, current: g.currentAmount, target: g.targetAmount })),
            },
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setAiInsights(json.data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch AI insights:', err);
      } finally {
        setIsAiLoading(false);
      }
    },
    [language, totalBalance, monthlyIncome, monthlyExpense, netSavingsRate, categorySpending, budgets, goals, transactions, aiInsights]
  );

  // Automatically refresh AI insights when language changes so user always sees the selected language!
  useEffect(() => {
    fetchAiInsights(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budgets,
        goals,
        totalBalance,
        monthlyIncome,
        monthlyExpense,
        netSavingsRate,
        categorySpending,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        setBudgetLimit,
        addGoal,
        depositToGoal,
        deleteGoal,
        aiInsights,
        isAiLoading,
        fetchAiInsights,
        resetDemoData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
