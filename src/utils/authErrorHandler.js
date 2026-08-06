/**
 * Supabase Authentication Error Message Formatter
 * Translates Supabase Auth errors and codes into clean, actionable, user-friendly messages.
 */
export const getFriendlyAuthErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred during authentication.';
  
  const code = error.code || error.status || '';
  const message = (error.message || '').toLowerCase();

  // Handle common Supabase Auth error messages and codes
  if (
    message.includes('invalid login credentials') ||
    message.includes('invalid credentials') ||
    code === 'invalid_credentials' ||
    code === 400 && message.includes('credentials')
  ) {
    return 'Incorrect email or password. Please verify your credentials.';
  }

  if (
    message.includes('user already registered') ||
    message.includes('already exists') ||
    message.includes('email already in use') ||
    code === 'user_already_exists'
  ) {
    return 'This email address is already registered. Please sign in instead.';
  }

  if (
    message.includes('email not confirmed') ||
    code === 'email_not_confirmed'
  ) {
    return 'Your email has not been confirmed yet. Please check your inbox for the confirmation link or sign in.';
  }

  if (
    message.includes('password should be at least') ||
    message.includes('weak password') ||
    code === 'weak_password'
  ) {
    return 'Password must be at least 6 characters long.';
  }

  if (
    message.includes('invalid email') ||
    message.includes('unable to validate email address')
  ) {
    return 'Please enter a valid email address.';
  }

  if (
    message.includes('rate limit') ||
    message.includes('too many requests') ||
    code === 'over_email_send_rate_limit' ||
    code === 429
  ) {
    return 'Too many attempts. Please wait a few moments before trying again.';
  }

  if (
    message.includes('network') ||
    message.includes('failed to fetch')
  ) {
    return 'Network connection error. Please check your internet connection.';
  }

  if (message.includes('jwt') || message.includes('token expired') || message.includes('session expired')) {
    return 'Your session has expired. Please sign in again.';
  }

  return error.message || 'Authentication failed. Please verify your credentials and try again.';
};

