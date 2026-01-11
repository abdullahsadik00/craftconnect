/**
 * API Response Utilities
 * 
 * WHAT: Standardized API response format
 * WHY:
 *   1. Consistent response structure
 *   2. Frontend knows what to expect
 *   3. Easy to add metadata (pagination)
 */

import { Response } from 'express';
import { ApiSuccessResponse, ApiErrorResponse } from '../types/index.js';

/**
 * Send success response
 */
export const successResponse = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  meta?: ApiSuccessResponse<T>['meta']
): Response => {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(meta && { meta }),
  };

  return res.status(statusCode).json(response);
};

/**
 * Send created response (201)
 */
export const createdResponse = <T>(res: Response, data: T): Response => {
  return successResponse(res, data, 201);
};

/**
 * Send no content response (204)
 */
export const noContentResponse = (res: Response): Response => {
  return res.status(204).send();
};

/**
 * Send paginated response
 */
export const paginatedResponse = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number
): Response => {
  return successResponse(res, data, 200, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
};

/**
 * Send error response
 */
export const errorResponse = (
  res: Response,
  statusCode: number,
  code: number,
  message: string,
  errors?: Record<string, string[]>
): Response => {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(errors && { errors }),
    },
  };

  return res.status(statusCode).json(response);
};

export default {
  successResponse,
  createdResponse,
  noContentResponse,
  paginatedResponse,
  errorResponse,
};