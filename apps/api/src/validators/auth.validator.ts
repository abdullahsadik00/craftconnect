/**
 * Authentication Validation Schemas
 */

import { z } from 'zod';
import { phoneSchema, emailSchema, passwordSchema, otpSchema } from './common.validator.js';

/**
 * Register with email
 */
export const registerEmailSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  }),
});

/**
 * Register with phone (send OTP)
 */
export const registerPhoneSchema = z.object({
  body: z.object({
    phone: phoneSchema,
  }),
});

/**
 * Verify OTP
 */
export const verifyOtpSchema = z.object({
  body: z.object({
    phone: phoneSchema.optional(),
    email: emailSchema.optional(),
    otp: otpSchema,
  }).refine(
    (data) => data.phone || data.email,
    'Either phone or email is required'
  ),
});

/**
 * Login with email/password
 */
export const loginEmailSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
  }),
});

/**
 * Login with phone (send OTP)
 */
export const loginPhoneSchema = z.object({
  body: z.object({
    phone: phoneSchema,
  }),
});

/**
 * Refresh token
 */
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

/**
 * Request password reset
 */
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

/**
 * Reset password
 */
export const resetPasswordSchema = z.object({
  body: z.object({
    email: emailSchema,
    otp: otpSchema,
    newPassword: passwordSchema,
  }),
});

// Export types
export type RegisterEmailInput = z.infer<typeof registerEmailSchema>['body'];
export type RegisterPhoneInput = z.infer<typeof registerPhoneSchema>['body'];
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>['body'];
export type LoginEmailInput = z.infer<typeof loginEmailSchema>['body'];
export type LoginPhoneInput = z.infer<typeof loginPhoneSchema>['body'];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>['body'];