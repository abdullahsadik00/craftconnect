/**
 * Password Hashing Utilities
 * 
 * WHAT: Securely hash and verify passwords
 * WHY:
 *   1. Never store plain text passwords
 *   2. bcrypt is slow by design (prevents brute force)
 *   3. Each password has unique salt (same password = different hash)
 * 
 * HOW IT WORKS:
 *   1. User registers with password
 *   2. We hash the password with bcrypt
 *   3. Store the hash in database
 *   4. On login, hash the input and compare
 * 
 * SALT ROUNDS:
 *   - Higher = more secure but slower
 *   - 10-12 is standard (each round doubles time)
 *   - 12 rounds ≈ 300ms on modern hardware
 */

import bcrypt from 'bcryptjs';

// Number of salt rounds (10-12 is recommended)
const SALT_ROUNDS = 12;

/**
 * Hash a password
 * @param password Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare password with hash
 * @param password Plain text password to check
 * @param hash Stored password hash
 * @returns True if password matches
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Check if a password meets requirements
 */
export const isValidPassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export default {
  hashPassword,
  comparePassword,
  isValidPassword,
};