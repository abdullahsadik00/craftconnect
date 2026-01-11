import { Router } from 'express';
// import ProviderController from '../controllers/provider.controller.js';
import providerController from '../controllers/provider.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware.js';
import {
  createProviderSchema,
  updateProviderSchema,
  getProviderBySlugSchema,
  listProvidersSchema,
} from '../validators/provider.validator.js';

const router = Router();

// Public routes
router.get(
  '/',
  validate(listProvidersSchema),
  providerController.list

);

router.get(
  '/slug/:slug',
  validate(getProviderBySlugSchema),
  optionalAuthMiddleware,
  providerController.getBySlug
);

// Protected routes
router.get(
  '/me',
  authMiddleware,
  providerController.getMe
);

router.post(
  '/',
  authMiddleware,
  validate(createProviderSchema),
  providerController.create
);

router.put(
  '/me',
  authMiddleware,
  validate(updateProviderSchema),
  providerController.update
);

router.delete(
  '/me',
  authMiddleware,
  providerController.delete
);

router.post(
  '/me/toggle-active',
  authMiddleware,
  providerController.toggleActive
);

export default router;