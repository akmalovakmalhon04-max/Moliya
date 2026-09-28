export type Language = 'uz' | 'ru' | 'en';

export type TransactionType = 'income' | 'expense' | 'transfer';

export type PaymentMethod = 'card' | 'cash' | 'bank_transfer' | 'crypto';

export type CategoryKey =
  | 'food'
  | 'transport'
  | 'housing'
  | 'utilities'
  | 'healthcare'
  | 'entertainment'
  | 'shopping'
  | 'education'
  | 'salary'
  | 'freelance'
  | 'investments'
  | 'gifts'
  | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: CategoryKey;
  date: string; // YYYY-MM-DD
  description: string;
  paymentMethod: PaymentMethod;
  goalId?: string;
}

export interface Budget {
  id: string;
  category: CategoryKey;
  monthlyLimit: number;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // YYYY-MM-DD
  category?: CategoryKey;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  language: Language;
  monthlyIncomeTarget: number;
  currencyPreference: 'standard' | 'compact';
  notifications: boolean;
}

export interface AiInsightData {
  summary: string;
  status: 'healthy' | 'warning' | 'optimal';
  keyObservations: string[];
  recommendations: Array<{
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  budgetAlert: string;
}
