/**
 * Tests for API client request function.
 * These tests verify HTTP request handling and error processing.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { request, ApiError } from './client'
import type { ApiResponse, PaginatedResponse } from './types'

// Mock global fetch
const mockFetch = vi.fn()
;(globalThis as Record<string, unknown>).fetch = mockFetch

// Helper to create mock response
function createMockResponse(data: unknown, status = 200, contentType = 'application/json') {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: {
      get: (name: string) => (name === 'content-type' ? contentType : null),
    },
    json: () => Promise.resolve(data),
  }
}

describe('API Client', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('GET requests', () => {
    it('should make GET request and return typed response', async () => {
      const mockResponse: ApiResponse<{ id: number; title: string }> = {
        data: { id: 1, title: 'Test Post' },
      }
      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse))

      const result = await request<{ id: number; title: string }>('GET', '/posts/1')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/posts/1'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        }),
      )
      expect(result.data).toEqual({ id: 1, title: 'Test Post' })
    })

    it('should include query parameters in GET request', async () => {
      const mockResponse: PaginatedResponse<{ id: number }> = {
        data: [{ id: 1 }],
        total_count: 1,
        offset: 0,
        limit: 10,
      }
      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse))

      await request<{ id: number }[]>('GET', '/posts', { params: { page: 1, limit: 10 } })

      const calledUrl = mockFetch.mock.calls[0]?.[0] as string
      expect(calledUrl).toContain('page=1')
      expect(calledUrl).toContain('limit=10')
    })
  })

  describe('POST requests', () => {
    it('should make POST request with JSON body', async () => {
      const mockResponse: ApiResponse<{ id: number }> = {
        data: { id: 1 },
      }
      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse, 201))

      const body = { title: 'New Post', content: 'Content' }
      const result = await request<{ id: number }>('POST', '/posts', { body })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/posts'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(body),
        }),
      )
      expect(result.data.id).toBe(1)
    })
  })

  describe('PUT requests', () => {
    it('should make PUT request with JSON body', async () => {
      const mockResponse: ApiResponse<{ id: number; updated: boolean }> = {
        data: { id: 1, updated: true },
      }
      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse))

      const body = { title: 'Updated Title' }
      await request<{ id: number; updated: boolean }>('PUT', '/posts/1', { body })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/posts/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(body),
        }),
      )
    })
  })

  describe('DELETE requests', () => {
    it('should make DELETE request', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({}, 204))

      await request<void>('DELETE', '/posts/1')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/posts/1'),
        expect.objectContaining({
          method: 'DELETE',
        }),
      )
    })
  })

  describe('Error handling', () => {
    it('should throw ApiError on HTTP error', async () => {
      const errorResponse = {
        error_code: 'NOT_FOUND',
        message: 'Post not found',
      }
      mockFetch.mockResolvedValueOnce(createMockResponse(errorResponse, 404))

      await expect(request('GET', '/posts/999')).rejects.toThrow(ApiError)
    })

    it('should include error details in thrown ApiError', async () => {
      const errorResponse = {
        error_code: 'VALIDATION_ERROR',
        message: 'Invalid data',
        details: { field: 'title' },
      }
      mockFetch.mockResolvedValueOnce(createMockResponse(errorResponse, 400))

      try {
        await request('GET', '/posts')
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError)
        const apiError = error as ApiError
        expect(apiError.error_code).toBe('VALIDATION_ERROR')
        expect(apiError.message).toBe('Invalid data')
      }
    })
  })

  describe('Snake case conversion', () => {
    it('should convert camelCase body to snake_case for backend', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ data: {} }, 201))

      // Input in camelCase, should be converted to snake_case
      const body = { createdAt: '2024-01-01', userId: 1 }
      await request('POST', '/posts', { body })

      const callArgs = mockFetch.mock.calls[0]?.[1] as Record<string, unknown> | undefined
      const sentBody = JSON.parse(callArgs?.body as string)
      expect(sentBody).toHaveProperty('created_at')
      expect(sentBody).toHaveProperty('user_id')
      expect(sentBody).not.toHaveProperty('createdAt')
    })
  })
})
