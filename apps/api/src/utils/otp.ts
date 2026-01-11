/**
 * OTP (One-Time Password) Utilities
 * 
 * WHAT: Generate and validate verification codes
 * WHY:
 *   1. Verify email/phone ownership
 *   2. Two-factor authentication
 *   3. Password reset verification
 * 
 * SECURITY:
 *   1. OTPs expire after 10 minutes
 *   2. Limited attempts (3 max)
 *   3. One-time use (marked verified after use)
 */

import config from '../config/index.js';

/**
 * Generate a random OTP code
 * @returns 6-digit numeric code
 */
export const generateOtp = (): string => {
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < config.otp.length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }

  return otp;
};

/**
 * Get OTP expiration date
 * @returns Date object for expiration
 */
export const getOtpExpiry = (): Date => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + config.otp.expiryMinutes);
  return expiry;
};

/**
 * Check if OTP has expired
 * @param expiryDate Expiration date to check
 * @returns True if expired
 */
export const isOtpExpired = (expiryDate: string | Date): boolean => {
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  return new Date() > expiry;
};

/**
 * Mask email for display (user@example.com → u***@example.com)
 */
export const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  return `${localPart[0]}${'*'.repeat(localPart.length - 2)}${localPart[localPart.length - 1]}@${domain}`;
};

/**
 * Mask phone for display (9876543210 → 98******10)
 */
export const maskPhone = (phone: string): string => {
  if (phone.length <= 4) return phone;
  return `${phone.slice(0, 2)}${'*'.repeat(phone.length - 4)}${phone.slice(-2)}`;
};

export default {
  generateOtp,
  getOtpExpiry,
  isOtpExpired,
  maskEmail,
  maskPhone,
};