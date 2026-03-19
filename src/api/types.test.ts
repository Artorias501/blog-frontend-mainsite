/**
 * Tests for API type definitions.
 * These tests verify the structure and type safety of API interfaces.
 */

import { describe, it, expect } from 'vitest'
import type { ApiResponse, PaginatedResponse, ApiError } from './types'

describe('API Types', () => {
  describe('ApiResponse', () => {
    it('should accept data property with generic type', () => {
      // Type check: ApiResponse should have a data property
      const response: ApiResponse<{ id: number; name: string }> = {
        data: { id: 1, name: 'test' },
      }
      expect(response.data).toEqual({ id: 1, name: 'test' })
    })

    it('should work with different data types', () => {
      // Type check: ApiResponse should work with array data
      const arrayResponse: ApiResponse<string[]> = {
        data: ['item1', 'item2'],
      }
      expect(Array.isArray(arrayResponse.data)).toBe(true)
      expect(arrayResponse.data).toHaveLength(2)
    })
  })

  describe('PaginatedResponse', () => {
    it('should have required pagination metadata', () => {
      const response: PaginatedResponse<{ id: number }> = {
        data: [{ id: 1 }, { id: 2 }],
        total_count: 100,
        offset: 0,
        limit: 10,
      }
      expect(response.total_count).toBe(100)
      expect(response.offset).toBe(0)
      expect(response.limit).toBe(10)
    })

    it('should use snake_case for pagination fields', () => {
      // This test ensures we use snake_case naming convention
      const response: PaginatedResponse<{ id: number }> = {
        data: [],
        total_count: 0,
        offset: 0,
        limit: 10,
      }
      expect(response).toHaveProperty('total_count')
      expect(response).not.toHaveProperty('totalCount')
    })
  })

  describe('ApiError', () => {
    it('should have error_code and message properties', () => {
      const error: ApiError = {
        error_code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
      }
      expect(error.error_code).toBe('VALIDATION_ERROR')
      expect(error.message).toBe('Invalid input data')
    })

    it('should use snake_case for error fields', () => {
      const error: ApiError = {
        error_code: 'NOT_FOUND',
        message: 'Resource not found',
      }
      expect(error).toHaveProperty('error_code')
      expect(error).not.toHaveProperty('errorCode')
    })

    it('should allow optional details property', () => {
      const errorWithDetails: ApiError = {
        error_code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: { field: 'email', reason: 'invalid_format' },
      }
      expect(errorWithDetails.details).toBeDefined()
    })
  })
})
