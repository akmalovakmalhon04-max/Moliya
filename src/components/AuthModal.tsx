import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, CheckCircle2, ArrowRight } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const { t } = useI18n();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('akmalovakmalhon04@gmail.com');
  const [name, setName] = useState('Akmalxon Akmalov');
  const [password, setPassword] = useState('123456');
  const [confirmPassword, setConfirmPassword] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const success = await login(email, password);
        if (success) {
          onShowToast(t('notifications.loginSuccess'));
          onClose();
        }
      } else if (mode === 'register') {
        if (password !== confirmPassword) {
          alert(t('validations.passwordMatch'));
          setIsLoading(false);
          return;
        }
        const success = await register(name, email, password);
        if (success) {
          onShowToast(t('notifications.registeredSuccess'));
          onClose();
        }
      } else {
        // Forgot password
        onShowToast(t('notifications.passwordResetSent'));
        setMode('login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {mode === 'login'
                ? t('auth.loginTitle')
                : mode === 'register'
                ? t('auth.registerTitle')
                : t('auth.forgotPasswordTitle')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {mode === 'login'
                ? t('auth.loginSubtitle')
                : mode === 'register'
                ? t('auth.registerSubtitle')
                : t('auth.forgotPasswordSubtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t('forms.fullName')}
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('forms.fullNamePlaceholder')}
                  className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('forms.email')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('forms.emailPlaceholder')}
                className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  {t('forms.password')}
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-emerald-600 hover:text-emerald-700"
                  >
                    {t('auth.forgotPassword')}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('forms.passwordPlaceholder')}
                  className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t('forms.confirmPassword')}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('forms.confirmPasswordPlaceholder')}
                  className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Demo account hint */}
          {mode === 'login' && (
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500">
              <span className="font-semibold text-slate-700 block mb-0.5">{t('auth.demoUserNotice')}</span>
              <span>akmalovakmalhon04@gmail.com / 123456</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>
              {mode === 'login'
                ? t('buttons.login')
                : mode === 'register'
                ? t('buttons.register')
                : t('auth.sendResetLink')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
            {mode === 'login' ? (
              <p>
                {t('auth.noAccount')}{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  {t('auth.registerTitle')}
                </button>
              </p>
            ) : (
              <p>
                {t('auth.haveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  {t('auth.backToLogin')}
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
