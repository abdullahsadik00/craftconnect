import { Router } from "express";
import authController from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.middleware.js';
import {
    registerEmailSchema,
    registerPhoneSchema,
    verifyOtpSchema,
    loginEmailSchema,
    refreshTokenSchema,
} from '../validators/auth.validator.js';

const router = Router();

// Public routes (with rate limiting)
router.post(
    '/register/email',
    authRateLimiter,
    validate(registerEmailSchema),
    authController.registerWithEmail
);

router.post(
    '/register/phone',
    authRateLimiter,
    validate(registerPhoneSchema),
    authController.registerWithPhone
);

router.post(
    '/login/email',
    authRateLimiter,
    validate(loginEmailSchema),
    authController.loginWithEmail
);

router.post(
    'login/phone',
    authRateLimiter,
    authController.loginWithPhone
);

router.post(
    '/verify-otp',
    authRateLimiter,
    validate(verifyOtpSchema),
    authController.verifyOtp
);

router.post(
    '/refresh-token',
    authRateLimiter,
    validate(refreshTokenSchema),
    authController.refreshToken
);

router.post('/logout', authController.logout);

// Protected routes (require authentication)
router.get(
    '/me',
    authMiddleware,
    authController.getCurrentUser
);

export default router;