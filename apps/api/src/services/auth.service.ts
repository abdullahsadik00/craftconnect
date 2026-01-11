/**
 * Authentication Service
 * 
 * WHAT: Handles all authentication logic
 * WHY: Separates business logic from HTTP handling
 * 
 * FEATURES:
 *   1. Email + Password registration/login
 *   2. Phone OTP registration/login
 *   3. Token management (access + refresh)
 *   4. Password reset
 */

import db from './database.service.js';
import { generateId } from '../utils/id.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt.js';
import { generateOtp, getOtpExpiry, isOtpExpired } from '../utils/otp.js';
import { 
  UnauthorizedError, 
  NotFoundError, 
  ConflictError,
  BadRequestError 
} from '../errors/index.js';
import { User, Otp, Session, Role, OtpType, Provider } from '../types/index.js';
import { AuthResponse, TokenPair } from '../types/auth.types.js';
import logger from '../utils/logger.js';
import config from '../config/index.js';

export class AuthService {
  /**
   * Register with email and password
   */
  async registerWithEmail(
    email: string,
    password: string
  ): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await db.findOne<User>(
      'users',
      (u) => u.email === email
    );

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const now = new Date().toISOString();
    const user: User = {
      id: generateId(),
      email,
      phoneNumber: null,
      passwordHash,
      role: Role.PROVIDER,
      isVerified: false, // Will verify via OTP
      lastLoginAt: now,
      createdAt: now,
      updatedAt: now,
    };

    await db.create('users', user);

    // Generate tokens
    const tokens = generateTokenPair(user.id, user.role);

    // Create session
    await this.createSession(user.id, tokens.refreshToken);

    // Send verification OTP (in dev, just log it)
    await this.sendEmailOtp(user.id, email, OtpType.REGISTER);

    // Check if has provider profile
    const provider = await db.findOne<Provider>(
      'providers',
      (p) => p.userId === user.id
    );

    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isVerified: user.isVerified,
      },
      hasProvider: !!provider,
    };
  }

  /**
   * Login with email and password
   */
  async loginWithEmail(email: string, password: string): Promise<AuthResponse> {
    // Find user
    const user = await db.findOne<User>('users', (u) => u.email === email);

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.passwordHash) {
      throw new UnauthorizedError('Please login with phone OTP');
    }

    // Verify password
    const isValid = await comparePassword(password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Update last login
    await db.update<User>('users', user.id, {
      lastLoginAt: new Date().toISOString(),
    });

    // Generate tokens
    const tokens = generateTokenPair(user.id, user.role);

    // Create session
    await this.createSession(user.id, tokens.refreshToken);

    // Check if has provider profile
    const provider = await db.findOne<Provider>(
      'providers',
      (p) => p.userId === user.id
    );

    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isVerified: user.isVerified,
      },
      hasProvider: !!provider,
    };
  }

  /**
   * Send OTP to phone for login/register
   */
  async sendPhoneOtp(phoneNumber: string): Promise<{ message: string; otpId: string }> {
    // Find or create user
    let user = await db.findOne<User>('users', (u) => u.phoneNumber === phoneNumber);

    if (!user) {
      // Create new user
      const now = new Date().toISOString();
      user = {
        id: generateId(),
        email: null,
        phoneNumber,
        passwordHash: null,
        role: Role.PROVIDER,
        isVerified: false,
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now,
      };

      await db.create('users', user);
    }

    // Generate OTP
    const otp = generateOtp();
    const expiry = getOtpExpiry();

    const otpRecord: Otp = {
      id: generateId(),
      userId: user.id,
      code: otp,
      type: OtpType.LOGIN,
      expiresAt: expiry.toISOString(),
      verified: false,
      attempts: 0,
      createdAt: new Date().toISOString(),
    };

    await db.create('otps', otpRecord);

    // In development, log OTP
    // In production, send via SMS (need paid service)
    if (config.isDev) {
      logger.info(`📱 OTP for ${phoneNumber}: ${otp}`);
    } else {
      // TODO: Send via SMS service
      logger.info(`SMS OTP would be sent to ${phoneNumber}`);
    }

    return {
      message: 'OTP sent successfully',
      otpId: otpRecord.id,
    };
  }

  /**
   * Send OTP to email
   */
  async sendEmailOtp(
    userId: string,
    email: string,
    type: OtpType
  ): Promise<{ message: string; otpId: string }> {
    // Generate OTP
    const otp = generateOtp();
    const expiry = getOtpExpiry();

    const otpRecord: Otp = {
      id: generateId(),
      userId,
      code: otp,
      type,
      expiresAt: expiry.toISOString(),
      verified: false,
      attempts: 0,
      createdAt: new Date().toISOString(),
    };

    await db.create('otps', otpRecord);

    // In development, log OTP
    if (config.isDev) {
      logger.info(`📧 OTP for ${email}: ${otp}`);
    } else {
      // TODO: Send via email service (Resend free tier)
      logger.info(`Email OTP would be sent to ${email}`);
    }

    return {
      message: 'OTP sent to email',
      otpId: otpRecord.id,
    };
  }

  /**
   * Verify OTP and login
   */
  async verifyOtp(
    identifier: { phone?: string; email?: string },
    otpCode: string
  ): Promise<AuthResponse> {
    // Find user
    let user: User | null = null;

    if (identifier.phone) {
      user = await db.findOne<User>('users', (u) => u.phoneNumber === identifier.phone);
    } else if (identifier.email) {
      user = await db.findOne<User>('users', (u) => u.email === identifier.email);
    }

    if (!user) {
      throw new NotFoundError('User');
    }

    // Find latest OTP
    const otpRecords = await db.findWhere<Otp>(
      'otps',
      (o) => o.userId === user!.id && !o.verified
    );

    // Sort by created date, get latest
    const latestOtp = otpRecords.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    if (!latestOtp) {
      throw new BadRequestError('No OTP found. Please request a new one.');
    }

    // Check if expired
    if (isOtpExpired(latestOtp.expiresAt)) {
      throw new BadRequestError('OTP has expired. Please request a new one.');
    }

    // Check attempts
    if (latestOtp.attempts >= 3) {
      throw new BadRequestError('Too many failed attempts. Please request a new OTP.');
    }

    // Verify OTP
    if (latestOtp.code !== otpCode) {
      // Increment attempts
      await db.update<Otp>('otps', latestOtp.id, {
        attempts: latestOtp.attempts + 1,
      });

      throw new BadRequestError('Invalid OTP');
    }

    // Mark OTP as verified
    await db.update<Otp>('otps', latestOtp.id, { verified: true });

    // Update user
    await db.update<User>('users', user.id, {
      isVerified: true,
      lastLoginAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Generate tokens
    const tokens = generateTokenPair(user.id, user.role);

    // Create session
    await this.createSession(user.id, tokens.refreshToken);

    // Check if has provider profile
    const provider = await db.findOne<Provider>(
      'providers',
      (p) => p.userId === user!.id
    );

    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isVerified: true,
      },
      hasProvider: !!provider,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<TokenPair> {
    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Find session
    const session = await db.findOne<Session>(
      'sessions',
      (s) => s.refreshToken === refreshToken
    );

    if (!session) {
      throw new UnauthorizedError('Session not found');
    }

    // Check if expired
    if (new Date(session.expiresAt) < new Date()) {
      await db.delete('sessions', session.id);
      throw new UnauthorizedError('Session expired. Please login again.');
    }

    // Find user
    const user = await db.findById<User>('users', decoded.userId);

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Generate new tokens
    const tokens = generateTokenPair(user.id, user.role);

    // Update session with new refresh token
    await db.update<Session>('sessions', session.id, {
      refreshToken: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return tokens;
  }

  /**
   * Logout - Invalidate session
   */
  async logout(refreshToken: string): Promise<void> {
    await db.deleteWhere<Session>(
      'sessions',
      (s) => s.refreshToken === refreshToken
    );
  }

  /**
   * Logout from all devices
   */
  async logoutAll(userId: string): Promise<void> {
    await db.deleteWhere<Session>('sessions', (s) => s.userId === userId);
  }

  /**
   * Create a new session
   */
  private async createSession(
    userId: string,
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<Session> {
    const session: Session = {
      id: generateId(),
      userId,
      refreshToken,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    await db.create('sessions', session);

    return session;
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    return db.findById<User>('users', userId);
  }

  /**
   * Delete old/expired OTPs (cleanup job)
   */
  async cleanupExpiredOtps(): Promise<number> {
    const now = new Date().toISOString();
    return db.deleteWhere<Otp>('otps', (o) => o.expiresAt < now);
  }

  /**
   * Delete expired sessions (cleanup job)
   */
  async cleanupExpiredSessions(): Promise<number> {
    const now = new Date().toISOString();
    return db.deleteWhere<Session>('sessions', (s) => s.expiresAt < now);
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;