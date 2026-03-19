/**
 * Tests for tags API service.
 * These tests verify the tags API service functions.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { request, ApiError } from '../client'
import type { PaginatedResponse } from '../types'

// Mock the request function
vi.mock('../client', () => ({
  request: vi.fn(),
  ApiError: class ApiError extends Error {
    error_code: string
    status: number
    constructor(response: { error_code: string; message: string }, status: number) {
      super(response.message)
      this.name = 'ApiError'
      this.error_code = response.error_code
      this.status = status
    }
  },
}))

// Import after mocking
import { getTags, getTagById, searchTags, type Tag } from './tags'

describe('Tags API Service', () => {
  const mockRequest = vi.mocked(request)

  beforeEach(() => {
    mockRequest.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Tag Type', () => {
    it('should export Tag interface with all required fields', () => {
      // Type check: Tag should have all required fields
      const tag: Tag = {
        id: 1,
        name: 'typescript',
        created_at: '2024-01-01T00:00:00Z',
      }
      expect(tag.id).toBe(1)
      expect(tag.name).toBe('typescript')
      expect(tag.created_at).toBe('2024-01-01T00:00:00Z')
    })

    it('should use snake_case for created_at field', () => {
      const tag: Tag = {
        id: 1,
        name: 'typescript',
        created_at: '2024-01-01T00:00:00Z',
      }
      expect(tag).toHaveProperty('created_at')
      expect(tag).not.toHaveProperty('createdAt')
    })
  })

  describe('getTags', () => {
    it('should return paginated list of tags', async () => {
      const mockResponse: PaginatedResponse<Tag> = {
        data: [
          {
            id: 1,
            name: 'typescript',
            created_at: '2024-01-01T00:00:00Z',
          },
          {
            id: 2,
            name: 'javascript',
            created_at: '2024-01-02T00:00:00Z',
          },
        ],
        total_count: 2,
        offset: 0,
        limit: 10,
      }
      mockRequest.mockResolvedValueOnce({ data: mockResponse })

      const result = await getTags()

      expect(mockRequest).toHaveBeenCalledWith('GET', '/tags', expect.any(Object))
      expect(result.data).toHaveLength(2)
      expect(result.total_count).toBe(2)
    })

    it('should include pagination parameters in request', async () => {
      const mockResponse: PaginatedResponse<Tag> = {
        data: [],
        total_count: 0,
        offset: 10,
        limit: 20,
      }
      mockRequest.mockResolvedValueOnce({ data: mockResponse })

      await getTags({ limit: 20, offset: 10 })

      expect(mockRequest).toHaveBeenCalledWith(
        'GET',
        '/tags',
        expect.objectContaining({
          params: expect.objectContaining({
            limit: 20,
            offset: 10,
          }),
        }),
      )
    })

    it('should handle empty response correctly', async () => {
      const mockResponse: PaginatedResponse<Tag> = {
        data: [],
        total_count: 0,
        offset: 0,
        limit: 10,
      }
      mockRequest.mockResolvedValueOnce({ data: mockResponse })

      const result = await getTags()

      expect(result.data).toHaveLength(0)
      expect(result.total_count).toBe(0)
    })
  })

  describe('getTagById', () => {
    it('should return a tag with matching ID', async () => {
      const mockTag: Tag = {
        id: 1,
        name: 'typescript',
        created_at: '2024-01-01T00:00:00Z',
      }
      mockRequest.mockResolvedValueOnce({ data: mockTag })

      const result = await getTagById(1)

      expect(mockRequest).toHaveBeenCalledWith('GET', '/tags/1')
      expect(result.data.id).toBe(1)
      expect(result.data.name).toBe('typescript')
    })

    it('should work with string ID', async () => {
      const mockTag: Tag = {
        id: 123,
        name: 'typescript',
        created_at: '2024-01-01T00:00:00Z',
      }
      mockRequest.mockResolvedValueOnce({ data: mockTag })

      const result = await getTagById('123')

      expect(mockRequest).toHaveBeenCalledWith('GET', '/tags/123')
      expect(result.data.id).toBe(123)
    })

    it('should throw ApiError when tag not found', async () => {
      mockRequest.mockRejectedValueOnce(
        new ApiError({ error_code: 'NOT_FOUND', message: 'Tag not found' }, 404),
      )

      await expect(getTagById(999)).rejects.toThrow(ApiError)
    })
  })

  describe('searchTags', () => {
    it('should return matching tags', async () => {
      const mockResponse: PaginatedResponse<Tag> = {
        data: [
          {
            id: 1,
            name: 'typescript',
            created_at: '2024-01-01T00:00:00Z',
          },
        ],
        total_count: 1,
        offset: 0,
        limit: 10,
      }
      mockRequest.mockResolvedValueOnce({ data: mockResponse })

      const result = await searchTags('type')

      expect(result.data).toHaveLength(1)
      expect(result.data[0]?.name).toBe('typescript')
    })

    it('should include keyword as query parameter', async () => {
      const mockResponse: PaginatedResponse<Tag> = {
        data: [],
        total_count: 0,
        offset: 0,
        limit: 10,
      }
      mockRequest.mockResolvedValueOnce({ data: mockResponse })

      await searchTags('script')

      expect(mockRequest).toHaveBeenCalledWith(
        'GET',
        '/tags/search',
        expect.objectContaining({
          params: expect.objectContaining({
            keyword: 'script',
          }),
        }),
      )
    })

    it('should handle empty keyword', async () => {
      const mockResponse: PaginatedResponse<Tag> = {
        data: [],
        total_count: 0,
        offset: 0,
        limit: 10,
      }
      mockRequest.mockResolvedValueOnce({ data: mockResponse })

      const result = await searchTags('')

      expect(result.data).toHaveLength(0)
      expect(result.total_count).toBe(0)
    })

    it('should work with pagination parameters', async () => {
      const mockResponse: PaginatedResponse<Tag> = {
        data: [],
        total_count: 100,
        offset: 20,
        limit: 10,
      }
      mockRequest.mockResolvedValueOnce({ data: mockResponse })

      await searchTags('test', { limit: 10, offset: 20 })

      expect(mockRequest).toHaveBeenCalledWith(
        'GET',
        '/tags/search',
        expect.objectContaining({
          params: expect.objectContaining({
            keyword: 'test',
            limit: 10,
            offset: 20,
          }),
        }),
      )
    })
  })
})
