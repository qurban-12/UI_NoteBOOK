import { useState } from 'react';
import { Menu, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/validation';

export function Navbar({ title, onOpenMenu }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [avatarError, setAvatarError] = useState(false);

  const initials = getInitials(user?.fullName || 'User');
  const showImage = Boolean(user?.avatar) && !avatarError;

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 -ml-1 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100 transition-colors shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="font-display text-base sm:text-lg font-semibold text-[#1E293B] truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={() => navigate('/notes/new')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-[#6366F1] hover:bg-indigo-600 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>

        <Link
          to="/profile"
          title="User Profile"
          aria-label="Go to user profile"
          className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
        >
          {showImage ? (
            <img
              src={user?.avatar}
              alt={user?.fullName || 'User avatar'}
              referrerPolicy="no-referrer"
              onError={() => setAvatarError(true)}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <span className="w-8 h-8 rounded-full bg-indigo-50 text-[#6366F1] font-display text-xs font-semibold flex items-center justify-center border border-indigo-100">
              {initials}
            </span>
          )}
          <span className="hidden md:inline text-sm font-medium text-[#1E293B] max-w-[140px] truncate">
            {user?.fullName}
          </span>
        </Link>
      </div>
    </header>
  );
}
