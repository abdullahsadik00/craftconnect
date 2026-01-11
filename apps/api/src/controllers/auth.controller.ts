/**
 * Auth Controller
 * 
 * WHAT: Handles HTTP requests for authentication
 * WHY: Separates HTTP handling from business logic
 */

import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service.js';
import { successResponse, createdResponse } from '../utils/response.js';
import { 
  RegisterEmailInput, 
  RegisterPhoneInput, 
  VerifyOtpInput,
  LoginEmailInput 
} from '../validators/auth.validator.js';

export class AuthController {
  /**
   * POST /auth/register/email
   * Register with email and password
   */
  registerWithEmail = async (
    req: Request<{}, {}, RegisterEmailInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await authService.registerWithEmail(email, password);
      createdResponse(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /auth/register/phone
   * Send OTP to phone for registration
   */
  registerWithPhone = async (
    req: Request<{}, {}, RegisterPhoneInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { phone } = req.body;
      const result = await authService.sendPhoneOtp(phone);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /auth/login/email
   * Login with email and password
   */
  loginWithEmail = async (
    req: Request<{}, {}, LoginEmailInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await authService.loginWithEmail(email, password);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /auth/login/phone
   * Send OTP to phone for login
   */
  loginWithPhone = async (
    req: Request<{}, {}, RegisterPhoneInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { phone } = req.body;
      const result = await authService.sendPhoneOtp(phone);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /auth/verify-otp
   * Verify OTP and complete login/registration
   */
  verifyOtp = async (
    req: Request<{}, {}, VerifyOtpInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { phone, email, otp } = req.body;
      const result = await authService.verifyOtp({ phone, email }, otp);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /auth/refresh
   * Refresh access token
   */
  refreshToken = async (
    req: Request<{}, {}, { refreshToken: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /auth/logout
   * Logout current session
   */
  logout = async (
    req: Request<{}, {}, { refreshToken?: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      successResponse(res, { message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /auth/me
   * Get current user info
   */
  getCurrentUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const user = await authService.getUserById(userId);
      
      if (!user) {
        successResponse(res, null);
        return;
      }

      // Don't send password hash
      successResponse(res, {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
export default authController;