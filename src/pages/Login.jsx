import { useState } from 'react';
import { Eye, EyeOff, KeyRound, Mail, X } from 'lucide-react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { DEMO_CREDENTIALS } from '../services/authService';
import { validateLoginForm } from '../utils/validation';

export function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateLoginForm({ email, password });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await login({ email, password, rememberMe });
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to sign in. Please try again.';
      toast.error(message);
      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setErrors({});
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      toast.error('Please enter your email address.');
      return;
    }
    toast.info(
      `Password reset instructions would be sent to ${resetEmail.trim()} in production.`
    );
    setResetEmail('');
    setShowForgotModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:grid lg:grid-cols-12">
      {/* Editorial Left Column */}
      <div className="hidden lg:flex lg:col-span-5 bg-white border-r border-slate-200 p-12 flex-col justify-between">
        <div>
          <Logo size="lg" />
          <div className="mt-16 max-w-md">
            <h1 className="font-display text-3xl font-bold tracking-tight text-[#1E293B] text-balance leading-tight">
              A calm, structured workspace for everything you write.
            </h1>
            <p className="mt-4 text-base text-[#64748B] leading-relaxed">
              Capture technical notes, organize project plans by category, star key references, and recover deleted drafts anytime.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 space-y-4">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium text-[#1E293B]">Rich Text Authoring</span>
            <span className="text-xs text-[#64748B]">Headings, lists, code</span>
          </div>
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium text-[#1E293B]">Instant Client Search</span>
            <span className="text-xs text-[#64748B]">Title, body &amp; category</span>
          </div>
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium text-[#1E293B]">Trash Recovery</span>
            <span className="text-xs text-[#64748B]">Restore deleted notes</span>
          </div>
        </div>
      </div>

      {/* Right Auth Form Column */}
      <div className="flex-1 lg:col-span-7 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo size="lg" />
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#1E293B]">
                  Sign in to FolioNote
                </h2>
                <p className="mt-1 text-sm text-[#64748B]">
                  Enter your credentials to access your notes workspace.
                </p>
              </div>
            </div>

            {errors.form && (
              <div
                role="alert"
                className="mt-5 px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-[#EF4444]"
              >
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-sm font-medium text-[#1E293B] mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="you@company.com"
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                    errors.email
                      ? 'border-[#EF4444] focus:ring-red-100'
                      : 'border-slate-200 focus:border-[#6366F1] focus:ring-[#6366F1]/15'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-[#EF4444]">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-medium text-[#1E293B]"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-medium text-[#6366F1] hover:text-indigo-700 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: '' }));
                    }}
                    placeholder="Enter your password"
                    className={`w-full pl-3.5 pr-10 py-2.5 text-sm bg-white border rounded-lg text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                      errors.password
                        ? 'border-[#EF4444] focus:ring-red-100'
                        : 'border-slate-200 focus:border-[#6366F1] focus:ring-[#6366F1]/15'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#64748B] hover:text-[#1E293B] rounded-md transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-[#EF4444]">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="inline-flex items-center gap-2 text-sm text-[#64748B] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#6366F1] focus:ring-[#6366F1]"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={handleUseDemo}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#6366F1] transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Use demo account</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 text-sm font-medium text-white bg-[#6366F1] hover:bg-indigo-600 disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
              >
                {isSubmitting ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#64748B]">
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-[#6366F1] hover:text-indigo-700 transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal (UI Only) */}
      {showForgotModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-password-title"
        >
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3
                  id="forgot-password-title"
                  className="font-display text-base font-semibold text-[#1E293B]"
                >
                  Reset your password
                </h3>
                <p className="mt-1 text-sm text-[#64748B]">
                  Enter your account email and we&apos;ll simulate sending a recovery link.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleForgotSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="reset-email"
                  className="block text-sm font-medium text-[#1E293B] mb-1.5"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 text-sm font-medium text-[#1E293B] bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#6366F1] hover:bg-indigo-600 rounded-lg"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
