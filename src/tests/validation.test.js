import {
  getInitials,
  isStrongPassword,
  isValidEmail,
  stripHtml,
  validateLoginForm,
  validateSignupForm,
} from '../utils/validation';

describe('Validation & Formatting Utilities', () => {
  test('validates email formats accurately', () => {
    expect(isValidEmail('alex@folionote.app')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('missing@domain')).toBe(false);
  });

  test('enforces password security requirements', () => {
    expect(isStrongPassword('short1A')).toBe(false);
    expect(isStrongPassword('alllowercase1')).toBe(false);
    expect(isStrongPassword('NoNumbersHere')).toBe(false);
    expect(isStrongPassword('ValidPass123')).toBe(true);
  });

  test('validates signup form fields and password confirmation', () => {
    const invalid = validateSignupForm({
      fullName: 'A',
      email: 'bad-email',
      password: 'weak',
      confirmPassword: 'different',
    });

    expect(invalid.isValid).toBe(false);
    expect(invalid.errors.fullName).toBeDefined();
    expect(invalid.errors.email).toBeDefined();
    expect(invalid.errors.password).toBeDefined();
    expect(invalid.errors.confirmPassword).toBe('Passwords do not match.');

    const valid = validateSignupForm({
      fullName: 'Alex Morgan',
      email: 'alex@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    });
    expect(valid.isValid).toBe(true);
  });

  test('validates login form fields', () => {
    const emptyResult = validateLoginForm({ email: '', password: '' });
    expect(emptyResult.isValid).toBe(false);
    expect(emptyResult.errors.email).toBeDefined();
    expect(emptyResult.errors.password).toBeDefined();
  });

  test('strips HTML tags cleanly for plain-text previews', () => {
    const html = '<h2>Heading</h2><p>Hello <strong>FolioNote</strong>!</p>';
    expect(stripHtml(html)).toBe('Heading Hello FolioNote!');
  });

  test('computes user initials cleanly', () => {
    expect(getInitials('Alex Morgan')).toBe('AM');
    expect(getInitials('Maya')).toBe('MA');
  });
});
