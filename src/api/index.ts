/**
 * API module exports.
 * Provides a unified entry point for all API-related functionality.
 */

// Type definitions
export type {
  ApiResponse,
  PaginatedResponse,
  ApiError as ApiErrorType,
  HttpMethod,
  RequestOptions,
} from './types'

// API client
export { request, ApiError } from './client'

// Configuration
export { getBaseUrl, DEFAULT_SERVICE } from './config'
export type { ServiceName } from './config'
