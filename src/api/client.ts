/**
 * API client with request wrapper and error handling.
 * Provides a unified interface for making HTTP requests to backend services.
 */

import type { ApiResponse, ApiError as ApiErrorType, HttpMethod, RequestOptions } from './types'
import { getBaseUrl, DEFAULT_SERVICE } from './config'

/**
 * Custom error class for API errors.
 * Wraps the backend error response with additional context.
 */
export class ApiError extends Error {
  /** Machine-readable error code from backend */
  error_code: string
  /** HTTP status code */
  status: number
  /** Optional additional error details */
  details?: Record<string, unknown>

  constructor(response: ApiErrorType, status: number) {
    super(response.message)
    this.name = 'ApiError'
    this.error_code = response.error_code
    this.status = status
    this.details = response.details
  }
}

/**
 * Convert a camelCase string to snake_case.
 * @param str - The camelCase string to convert
 * @returns The snake_case version of the string
 */
function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

/**
 * Recursively convert all keys in an object from camelCase to snake_case.
 * @param obj - The object to convert
 * @returns A new object with snake_case keys
 */
function toSnakeCase<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => toSnakeCase(item)) as T
  }

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = camelToSnakeCase(key)
    result[snakeKey] = toSnakeCase(value)
  }
  return result as T
}

/**
 * Build a URL with query parameters.
 * @param baseUrl - The base URL
 * @param path - The API path
 * @param params - Query parameters (will be converted to snake_case)
 * @returns The full URL with query string
 */
function buildUrl(baseUrl: string, path: string, params?: Record<string, unknown>): string {
  const url = new URL(path, baseUrl)

  if (params) {
    const snakeParams = toSnakeCase(params)
    for (const [key, value] of Object.entries(snakeParams)) {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    }
  }

  return url.toString()
}

/**
 * Make an HTTP request to the backend API.
 * @template T - The expected response data type
 * @param method - HTTP method (GET, POST, PUT, DELETE)
 * @param path - API endpoint path
 * @param options - Request options
 * @returns The API response with typed data
 * @throws ApiError if the request fails
 */
export async function request<T>(
  method: HttpMethod,
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { body, params, headers, baseUrl } = options

  // Use provided baseUrl or default service URL
  const serviceUrl = baseUrl ?? getBaseUrl(DEFAULT_SERVICE)
  const url = buildUrl(serviceUrl, path, params)

  // Prepare request headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  }

  // Prepare request body (convert to snake_case)
  const requestBody = body ? JSON.stringify(toSnakeCase(body)) : undefined

  // Make the fetch request
  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: requestBody,
  })

  // Handle error responses
  if (!response.ok) {
    const errorData: ApiErrorType = await response.json()
    throw new ApiError(errorData, response.status)
  }

  // Handle empty responses (e.g., 204 No Content)
  const contentType = response.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    return { data: undefined as T }
  }

  // Parse and return JSON response
  const data: ApiResponse<T> = await response.json()
  return data
}
