export function sanitizeEmail(email) {
    return email.replace(/\./g, ',');
  }
  