const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return EMAIL_REGEX.test((email || '').trim());
}

export function getPasswordRequirements(password = '') {
  return [
    {
      id: 'length',
      label: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      id: 'uppercase',
      label: 'One uppercase letter',
      met: /[A-Z]/.test(password),
    },
    {
      id: 'lowercase',
      label: 'One lowercase letter',
      met: /[a-z]/.test(password),
    },
    {
      id: 'number',
      label: 'One number',
      met: /\d/.test(password),
    },
  ];
}

export function isStrongPassword(password) {
  return getPasswordRequirements(password).every((req) => req.met);
}

export function validateSignupForm(payload) {
  const errors = {};

  if (!payload.fullName || !payload.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (payload.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  if (!payload.email || !payload.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!isValidEmail(payload.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!payload.password) {
    errors.password = 'Password is required.';
  } else if (!isStrongPassword(payload.password)) {
    errors.password =
      'Password must be at least 8 characters and include uppercase, lowercase, and a number.';
  }

  if (!payload.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (payload.password !== payload.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateLoginForm(payload) {
  const errors = {};

  if (!payload.email || !payload.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!isValidEmail(payload.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!payload.password) {
    errors.password = 'Password is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateProfileForm(payload) {
  const errors = {};

  if (!payload.fullName || !payload.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (payload.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  if (!payload.email || !payload.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!isValidEmail(payload.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Strips HTML tags from rich text content to produce clean plain-text card previews.
 */
export function stripHtml(html) {
  if (!html) return '';
  const withBlockSpacing = html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|div|h[1-6]|li|blockquote|pre|tr)>/gi, '</$1> ');
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    const doc = new DOMParser().parseFromString(withBlockSpacing, 'text/html');
    return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
  }
  return withBlockSpacing.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function formatDate(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function getInitials(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
