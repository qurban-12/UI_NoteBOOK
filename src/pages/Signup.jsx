import { useState } from 'react';
import { Check, Eye, EyeOff } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { getPasswordRequirements, validateSignupForm } from '../utils/validation';

export function Signup() {
  const { isAuthenticated, signup } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const passwordRequirements = getPasswordRequirements(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateSignupForm({
      fullName,
      email,
      password,
      confirmPassword,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await signup({ fullName, email, password, confirmPassword });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to create account.';
      toast.error(message);
      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:grid lg:grid-cols-12">
      {/* Editorial Left Column */}
      <div className="hidden lg:flex lg:col-span-5 bg-white border-r border-slate-200 p-12 flex-col justify-between">
        <div>
          <Logo size="lg" />
          <div className="mt-16 max-w-md">
            <h1 className="font-display text-3xl font-bold tracking-tight text-[#1E293B] text-balance leading-tight">
              Start building your personal knowledge library in seconds.
            </h1>
            <p className="mt-4 text-base text-[#64748B] leading-relaxed">
              Every account starts with structured starter templates so you can explore rich formatting, instant search, and workspace organization right away.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 space-y-4 text-sm text-[#64748B]">
          <p className="font-medium text-[#1E293B]">Included in your workspace</p>
          <ul className="space-y-2">
            <li>Unlimited rich-text notes and category views</li>
            <li>Instant search across titles and note content</li>
            <li>Dedicated Favorites and Recently Deleted recovery</li>
          </ul>
        </div>
      </div>

      {/* Right Sign Up Form Column */}
      <div className="flex-1 lg:col-span-7 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo size="lg" />
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
            <h2 className="font-display text-2xl font-bold text-[#1E293B]">
              Create your account
            </h2>
            <p className="mt-1 text-sm text-[#64748B]">
              Set up your FolioNote workspace profile.
            </p>

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
                  htmlFor="signup-name"
                  className="block text-sm font-medium text-[#1E293B] mb-1.5"
                >
                  Full name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName)
                      setErrors((prev) => ({ ...prev, fullName: '' }));
                  }}
                  placeholder="Alex Morgan"
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                    errors.fullName
                      ? 'border-[#EF4444] focus:ring-red-100'
                      : 'border-slate-200 focus:border-[#6366F1] focus:ring-[#6366F1]/15'
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-[#EF4444]">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-sm font-medium text-[#1E293B] mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="signup-email"
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
                <label
                  htmlFor="signup-password"
                  className="block text-sm font-medium text-[#1E293B] mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: '' }));
                    }}
                    placeholder="Create a strong password"
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

                <ul className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1">
                  {passwordRequirements.map((req) => (
                    <li
                      key={req.id}
                      className={`flex items-center gap-1.5 text-xs ${
                        req.met ? 'text-emerald-600' : 'text-[#64748B]'
                      }`}
                    >
                      <Check
                        className={`w-3.5 h-3.5 shrink-0 ${
                          req.met ? 'opacity-100' : 'opacity-30'
                        }`}
                      />
                      <span>{req.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <label
                  htmlFor="signup-confirm-password"
                  className="block text-sm font-medium text-[#1E293B] mb-1.5"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword)
                        setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                    }}
                    placeholder="Re-enter your password"
                    className={`w-full pl-3.5 pr-10 py-2.5 text-sm bg-white border rounded-lg text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                      errors.confirmPassword
                        ? 'border-[#EF4444] focus:ring-red-100'
                        : 'border-slate-200 focus:border-[#6366F1] focus:ring-[#6366F1]/15'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword
                        ? 'Hide confirm password'
                        : 'Show confirm password'
                    }
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#64748B] hover:text-[#1E293B] rounded-md transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-[#EF4444]">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 text-sm font-medium text-white bg-[#6366F1] hover:bg-indigo-600 disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
              >
                {isSubmitting ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#64748B]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-[#6366F1] hover:text-indigo-700 transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
