import {
  FileText,
  LayoutDashboard,
  LogOut,
  Star,
  Trash2,
  User as UserIcon,
  X,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { Logo } from './Logo';

export function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const { stats } = useNotes();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      count: null,
    },
    {
      to: '/notes',
      label: 'All Notes',
      icon: FileText,
      count: stats.total,
    },
    {
      to: '/favorites',
      label: 'Favorites',
      icon: Star,
      count: stats.favorites,
    },
    {
      to: '/trash',
      label: 'Recently Deleted',
      icon: Trash2,
      count: stats.deleted,
    },
    {
      to: '/profile',
      label: 'User Profile',
      icon: UserIcon,
      count: null,
    },
  ];

  const renderNavContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between shrink-0">
        <NavLink to="/dashboard" onClick={onClose} className="focus:outline-none">
          <Logo size="md" />
        </NavLink>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="lg:hidden p-1.5 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto" aria-label="Workspace navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              end={item.to === '/notes'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-50 text-[#6366F1]'
                    : 'text-[#64748B] hover:text-[#1E293B] hover:bg-slate-50'
                }`
              }
            >
              <span className="flex items-center gap-3 min-w-0">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </span>
              {item.count !== null && (
                <span className="text-xs font-mono tabular-nums text-slate-400">
                  {item.count}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-100 shrink-0">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#64748B] hover:text-[#EF4444] hover:bg-red-50 transition-colors whitespace-nowrap cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block lg:w-64 lg:fixed lg:inset-y-0 lg:left-0 z-30">
        {renderNavContent()}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="relative w-64 max-w-[80vw] h-full z-50">
            {renderNavContent()}
          </aside>
        </div>
      )}
    </>
  );
}
