/**
 * Type definitions for API communication.
 * All types use snake_case naming convention to match backend API.
 */

/**
 * Generic wrapper for successful API responses.
 * @template T - The type of data returned by the API
 */
export interface ApiResponse<T> {
  /** The response data */
  data: T
}

/**
 * Wrapper for paginated list responses.
 * Includes metadata for pagination controls.
 * Matches backend API response format.
 * @template T - The type of items in the items array
 */
export interface PaginatedResponse<T> {
  /** Array of items for the current page */
  items: T[]
  /** Total number of items across all pages */
  total: number
  /** Current page number (1-indexed) */
  page: number
  /** Number of items per page */
  page_size: number
  /** Total number of pages */
  total_page: number
}

/**
 * Structured error information returned by the API.
 * All field names use snake_case to match backend convention.
 */
export interface ApiError {
  /** Machine-readable error code */
  error_code: string
  /** Human-readable error message */
  message: string
  /** Optional additional error details */
  details?: Record<string, unknown>
}

/**
 * HTTP methods supported by the API client.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

/**
 * Options for API requests.
 */
export interface RequestOptions<T = unknown> {
  /** Request body (will be converted to snake_case) */
  body?: T
  /** Query parameters (will be converted to snake_case) */
  params?: Record<string, unknown>
  /** Additional headers */
  headers?: Record<string, string>
  /** Base URL override */
  baseUrl?: string
}
