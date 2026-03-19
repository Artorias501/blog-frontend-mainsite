/**
 * Tests for posts API service.
 * These tests verify the posts API service functions.
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
import { getPosts, getPostById, searchPosts, type Post, type Tag } from './posts'

describe('Posts API Service', () => {
  const mockRequest = vi.mocked(request)

  beforeEach(() => {
    mockRequest.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Post and Tag Types', () => {
    it('should export Post interface with all required fields', () => {
      // Type check: Post should have all required fields
      const post: Post = {
        id: 1,
        title: 'Test Post',
        content: 'Test content',
        summary: 'Test summary',
        tags: [{ id: 1, name: 'test' }],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        published_at: '2024-01-03T00:00:00Z',
      }
      expect(post.id).toBe(1)
      expect(post.title).toBe('Test Post')
      expect(post.content).toBe('Test content')
      expect(post.summary).toBe('Test summary')
      expect(post.tags).toHaveLength(1)
      expect(post.created_at).toBe('2024-01-01T00:00:00Z')
      expect(post.updated_at).toBe('2024-01-02T00:00:00Z')
      expect(post.published_at).toBe('2024-01-03T00:00:00Z')
    })

    it('should export Tag interface with id and name fields', () => {
      const tag: Tag = {
        id: 1,
        name: 'typescript',
      }
      expect(tag.id).toBe(1)
      expect(tag.name).toBe('typescript')
    })

    it('should have Post.tags as array of Tag objects', () => {
      const post: Post = {
        id: 1,
        title: 'Test',
        content: 'Content',
        summary: 'Summary',
        tags: [
          { id: 1, name: 'tag1' },
          { id: 2, name: 'tag2' },
        ],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        published_at: '2024-01-01T00:00:00Z',
      }
      expect(Array.isArray(post.tags)).toBe(true)
      expect(post.tags[0]?.name).toBe('tag1')
    })

    it('should use snake_case for date fields', () => {
      const post: Post = {
        id: 1,
        title: 'Test',
        content: 'Content',
        summary: 'Summary',
        tags: [],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        published_at: '2024-01-01T00:00:00Z',
      }
      expect(post).toHaveProperty('created_at')
      expect(post).toHaveProperty('updated_at')
      expect(post).toHaveProperty('published_at')
      expect(post).not.toHaveProperty('createdAt')
    })
  })

  describe('getPosts', () => {
    it('should return paginated list of posts', async () => {
      const mockResponse: PaginatedResponse<Post> = {
        data: [
          {
            id: 1,
            title: 'Post 1',
            content: 'Content 1',
            summary: 'Summary 1',
            tags: [],
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
            published_at: '2024-01-01T00:00:00Z',
          },
        ],
        total_count: 1,
        offset: 0,
        limit: 10,
      }
      mockRequest.mockResolvedValueOnce({ data: mockResponse })

      const result = await getPosts()

      expect(mockRequest).toHaveBeenCalledWith('GET', '/posts', expect.any(Object))
      expect(result.data).toHaveLength(1)
      expect(result.total_count).toBe(1)
    })

    it('should include pagination parameters in request', async () => {
      const mockResponse: PaginatedResponse<Post> = {
        data: [],
        total_count: 0,
        offset: 10,
        limit: 20,
      }
      mockRequest.mockResolvedValueOnce({ data: mockResponse })

      await getPosts({ limit: 20, offset: 10 })

      expect(mockRequest).toHaveBeenCalledWith(
        'GET',
        '/posts',
        expect.objectContaining({
          params: expect.objectContaining({
            limit: 20,
            offset: 10,
          }),
        }),
      )
    })

    it('should include tag filter in request', async () => {
      const mockResponse: PaginatedResponse<Post> = {
        data: [],
        total_count: 0,
        offset: 0,
        limit: 10,
      }
      mockRequest.mockResolvedValueOnce({ data: mockResponse })

      await getPosts({ tag: 'typescript' })

      expect(mockRequest).toHaveBeenCalledWith(
        'GET',
        '/posts',
        expect.objectContaining({
          params: expect.objectContaining({
            tag: 'typescript',
          }),
        }),
      )
    })

    it('should handle empty response correctly', async () => {
      const mockResponse: PaginatedResponse<Post> = {
        data: [],
        total_count: 0,
        offset: 0,
        limit: 10,
      }
      mockRequest.mockResolvedValueOnce({ data: mockResponse })

      const result = await getPosts()

      expect(result.data).toHaveLength(0)
      expect(result.total_count).toBe(0)
    })
  })

  describe('getPostById', () => {
    it('should return a post with matching ID', async () => {
      const mockPost: Post = {
        id: 1,
        title: 'Test Post',
        content: 'Test content',
        summary: 'Test summary',
        tags: [],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        published_at: '2024-01-01T00:00:00Z',
      }
      mockRequest.mockResolvedValueOnce({ data: mockPost })

      const result = await getPostById(1)

      expect(mockRequest).toHaveBeenCalledWith('GET', '/posts/1')
      expect(result.data.id).toBe(1)
      expect(result.data.title).toBe('Test Post')
    })

    it('should work with string ID', async () => {
      const mockPost: Post = {
        id: 123,
        title: 'Test Post',
        content: 'Test content',
        summary: 'Test summary',
        tags: [],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        published_at: '2024-01-01T00:00:00Z',
      }
      mockRequest.mockResolvedValueOnce({ data: mockPost })

      const result = await getPostById('123')

      expect(mockRequest).toHaveBeenCalledWith('GET', '/posts/123')
      expect(result.data.id).toBe(123)
    })

    it('should throw ApiError when post not found', async () => {
      mockRequest.mockRejectedValueOnce(
        new ApiError({ error_code: 'NOT_FOUND', message: 'Post not found' }, 404),
      )

      await expect(getPostById(999)).rejects.toThrow(ApiError)
    })
  })

  describe('searchPosts', () => {
    it('should return matching posts', async () => {
      const mockResponse: PaginatedResponse<Post> = {
        data: [
          {
            id: 1,
            title: 'Test Post',
            content: 'Test content',
            summary: 'Test summary',
            tags: [],
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
            published_at: '2024-01-01T00:00:00Z',
          },
        ],
        total_count: 1,
        offset: 0,
        limit: 10,
      }
      mockRequest.mockResolvedValueOnce({ data: mockResponse })

      const result = await searchPosts('test')

      expect(result.data).toHaveLength(1)
      expect(result.data[0]?.title).toBe('Test Post')
    })

    it('should include keyword as query parameter', async () => {
      const mockResponse: PaginatedResponse<Post> = {
        data: [],
        total_count: 0,
        offset: 0,
        limit: 10,
      }
      mockRequest.mockResolvedValueOnce({ data: mockResponse })

      await searchPosts('typescript')

      expect(mockRequest).toHaveBeenCalledWith(
        'GET',
        '/posts/search',
        expect.objectContaining({
          params: expect.objectContaining({
            keyword: 'typescript',
          }),
        }),
      )
    })

    it('should handle empty keyword', async () => {
      const mockResponse: PaginatedResponse<Post> = {
        data: [],
        total_count: 0,
        offset: 0,
        limit: 10,
      }
      mockRequest.mockResolvedValueOnce({ data: mockResponse })

      const result = await searchPosts('')

      expect(result.data).toHaveLength(0)
      expect(result.total_count).toBe(0)
    })

    it('should work with pagination parameters', async () => {
      const mockResponse: PaginatedResponse<Post> = {
        data: [],
        total_count: 100,
        offset: 20,
        limit: 10,
      }
      mockRequest.mockResolvedValueOnce({ data: mockResponse })

      await searchPosts('test', { limit: 10, offset: 20 })

      expect(mockRequest).toHaveBeenCalledWith(
        'GET',
        '/posts/search',
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
