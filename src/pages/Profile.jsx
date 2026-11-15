import { useEffect, useState } from 'react';
import { Check, Edit3, LogOut, Mail, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { DEFAULT_AVATAR_URL } from '../services/authService';
import { formatDate, getInitials, validateProfileForm } from '../utils/validation';

export function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const { stats } = useNotes();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.role || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [avatarError, setAvatarError] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
      setRole(user.role);
      setBio(user.bio);
      setAvatar(user.avatar);
      setAvatarError(false);
    }
  }, [user]);

  if (!user) return null;

  const initials = getInitials(user.fullName);
  const showAvatarImg = Boolean(avatar) && !avatarError;

  const handleSave = async (e) => {
    e.preventDefault();
    const validation = validateProfileForm({ fullName, email, role, bio, avatar });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSaving(true);
    try {
      await updateProfile({ fullName, email, role, bio, avatar });
      setIsEditing(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to update profile.';
      toast.error(msg);
      setErrors({ form: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(user.fullName);
    setEmail(user.email);
    setRole(user.role);
    setBio(user.bio);
    setAvatar(user.avatar);
    setErrors({});
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <WorkspaceLayout title="User Profile">
      <div className="max-w-3xl space-y-6">
        {/* Profile Header Card */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5 min-w-0">
              {showAvatarImg ? (
                <img
                  src={avatar}
                  alt={user.fullName}
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarError(true)}
                  className="w-20 h-20 rounded-full object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-indigo-50 border border-indigo-100 text-[#6366F1] font-display text-2xl font-bold flex items-center justify-center shrink-0">
                  {initials}
                </div>
              )}

              <div className="min-w-0">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1E293B] truncate">
                  {user.fullName}
                </h2>
                <p className="mt-0.5 text-sm text-[#64748B] truncate">
                  {user.role || 'Workspace Member'}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-[#64748B]">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#1E293B] bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#EF4444] bg-white border border-red-200 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {!isEditing && user.bio && (
            <p className="mt-6 pt-5 border-t border-slate-100 text-sm text-[#64748B] leading-relaxed">
              {user.bio}
            </p>
          )}

          {isEditing && (
            <form
              onSubmit={handleSave}
              className="mt-6 pt-6 border-t border-slate-100 space-y-4"
              noValidate
            >
              {errors.form && (
                <div
                  role="alert"
                  className="px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-[#EF4444]"
                >
                  {errors.form}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="profile-fullname"
                    className="block text-sm font-medium text-[#1E293B] mb-1.5"
                  >
                    Full name
                  </label>
                  <input
                    id="profile-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName)
                        setErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                    className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
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
                    htmlFor="profile-email"
                    className="block text-sm font-medium text-[#1E293B] mb-1.5"
                  >
                    Email address
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-[#EF4444] focus:ring-red-100'
                        : 'border-slate-200 focus:border-[#6366F1] focus:ring-[#6366F1]/15'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-[#EF4444]">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="profile-role"
                    className="block text-sm font-medium text-[#1E293B] mb-1.5"
                  >
                    Role or title
                  </label>
                  <input
                    id="profile-role"
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                    Avatar style
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAvatar(DEFAULT_AVATAR_URL);
                        setAvatarError(false);
                      }}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                        avatar === DEFAULT_AVATAR_URL
                          ? 'border-[#6366F1] bg-indigo-50 text-[#6366F1]'
                          : 'border-slate-200 text-[#64748B] hover:text-[#1E293B]'
                      }`}
                    >
                      Portrait Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatar('')}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                        !avatar
                          ? 'border-[#6366F1] bg-indigo-50 text-[#6366F1]'
                          : 'border-slate-200 text-[#64748B] hover:text-[#1E293B]'
                      }`}
                    >
                      Monogram Initials
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="profile-bio"
                  className="block text-sm font-medium text-[#1E293B] mb-1.5"
                >
                  Bio
                </label>
                <textarea
                  id="profile-bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a short note about how you use this workspace..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/15"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-[#1E293B] bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#6366F1] hover:bg-indigo-600 disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Account Information */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
          <h3 className="font-display text-base font-semibold text-[#1E293B]">
            Account Information
          </h3>
          <p className="mt-1 text-sm text-[#64748B]">
            Workspace summary and local persistence details.
          </p>

          <dl className="mt-5 divide-y divide-slate-100 border-t border-slate-100 text-sm">
            <div className="py-3.5 flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2 text-[#64748B]">
                <UserIcon className="w-4 h-4" />
                <span>Account ID</span>
              </dt>
              <dd className="font-mono text-xs text-[#1E293B]">{user.id}</dd>
            </div>
            <div className="py-3.5 flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2 text-[#64748B]">
                <ShieldCheck className="w-4 h-4" />
                <span>Member since</span>
              </dt>
              <dd className="tabular-nums text-[#1E293B]">
                {formatDate(user.createdAt)}
              </dd>
            </div>
            <div className="py-3.5 flex items-center justify-between gap-4">
              <dt className="text-[#64748B]">Active notes</dt>
              <dd className="font-mono tabular-nums font-medium text-[#1E293B]">
                {stats.total}
              </dd>
            </div>
            <div className="py-3.5 flex items-center justify-between gap-4">
              <dt className="text-[#64748B]">Favorite notes</dt>
              <dd className="font-mono tabular-nums font-medium text-[#1E293B]">
                {stats.favorites}
              </dd>
            </div>
            <div className="py-3.5 flex items-center justify-between gap-4">
              <dt className="text-[#64748B]">Storage mode</dt>
              <dd className="text-[#1E293B]">Browser LocalStorage</dd>
            </div>
          </dl>
        </section>
      </div>
    </WorkspaceLayout>
  );
}
