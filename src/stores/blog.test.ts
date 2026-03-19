/**
 * Tests for blog store.
 * These tests verify the blog store's API integration and state management.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { getPosts, getPostById } from '@/api/services/posts'
import { ApiError } from '@/api/client'

// Mock the posts API service
vi.mock('@/api/services/posts', () => ({
  getPosts: vi.fn(),
  getPostById: vi.fn(),
}))

// Mock the API client
vi.mock('@/api/client', () => ({
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
import { useBlogStore } from './blog'

describe('Blog Store', () => {
  const mockGetPosts = vi.mocked(getPosts)
  const mockGetPostById = vi.mocked(getPostById)

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Initial State', () => {
    it('should have empty posts array initially', () => {
      const store = useBlogStore()
      expect(store.posts).toEqual([])
    })

    it('should have loading ref set to false initially', () => {
      const store = useBlogStore()
      expect(store.loading).toBe(false)
    })

    it('should have error ref set to null initially', () => {
      const store = useBlogStore()
      expect(store.error).toBeNull()
    })

    it('should not contain hardcoded test data', () => {
      const store = useBlogStore()
      // Verify posts is empty, not hardcoded
      expect(store.posts.length).toBe(0)
    })
  })

  describe('fetchPosts Action', () => {
    it('should fetch posts and update state on success', async () => {
      const mockPosts = [
        {
          id: 1,
          title: 'Test Post 1',
          content: 'Content 1',
          summary: 'Summary 1',
          tags: [{ id: 1, name: 'test' }],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          published_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 2,
          title: 'Test Post 2',
          content: 'Content 2',
          summary: 'Summary 2',
          tags: [],
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
          published_at: '2024-01-02T00:00:00Z',
        },
      ]

      mockGetPosts.mockResolvedValueOnce({
        data: mockPosts,
        total_count: 2,
        offset: 0,
        limit: 10,
      })

      const store = useBlogStore()
      await store.fetchPosts()

      expect(mockGetPosts).toHaveBeenCalled()
      expect(store.posts).toHaveLength(2)
      expect(store.posts[0]?.title).toBe('Test Post 1')
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should set loading state during fetch', async () => {
      let resolvePromise: (value: unknown) => void
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve
      })

      mockGetPosts.mockReturnValueOnce(pendingPromise as Promise<ReturnType<typeof getPosts>>)

      const store = useBlogStore()
      const fetchPromise = store.fetchPosts()

      // Loading should be true during the fetch
      expect(store.loading).toBe(true)

      // Resolve the promise
      resolvePromise!({
        data: [],
        total_count: 0,
        offset: 0,
        limit: 10,
      })

      await fetchPromise

      // Loading should be false after fetch completes
      expect(store.loading).toBe(false)
    })

    it('should set error state on API failure', async () => {
      const apiError = new ApiError({ error_code: 'NETWORK_ERROR', message: 'Network error' }, 500)
      mockGetPosts.mockRejectedValueOnce(apiError)

      const store = useBlogStore()
      await store.fetchPosts()

      expect(store.error).not.toBeNull()
      expect(store.error?.message).toBe('Network error')
      expect(store.loading).toBe(false)
    })

    it('should handle empty response gracefully', async () => {
      mockGetPosts.mockResolvedValueOnce({
        data: [],
        total_count: 0,
        offset: 0,
        limit: 10,
      })

      const store = useBlogStore()
      await store.fetchPosts()

      expect(store.posts).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should pass pagination parameters to API', async () => {
      mockGetPosts.mockResolvedValueOnce({
        data: [],
        total_count: 0,
        offset: 10,
        limit: 5,
      })

      const store = useBlogStore()
      await store.fetchPosts({ limit: 5, offset: 10 })

      expect(mockGetPosts).toHaveBeenCalledWith({ limit: 5, offset: 10 })
    })
  })

  describe('fetchPostById Action', () => {
    it('should fetch single post and return it', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Post',
        content: 'Test content',
        summary: 'Test summary',
        tags: [{ id: 1, name: 'test' }],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        published_at: '2024-01-01T00:00:00Z',
      }

      mockGetPostById.mockResolvedValueOnce({ data: mockPost })

      const store = useBlogStore()
      const result = await store.fetchPostById(1)

      expect(mockGetPostById).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockPost)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should set loading state during fetch', async () => {
      let resolvePromise: (value: unknown) => void
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve
      })

      mockGetPostById.mockReturnValueOnce(pendingPromise as Promise<ReturnType<typeof getPostById>>)

      const store = useBlogStore()
      const fetchPromise = store.fetchPostById(1)

      // Loading should be true during the fetch
      expect(store.loading).toBe(true)

      // Resolve the promise
      resolvePromise!({
        data: {
          id: 1,
          title: 'Test',
          content: 'Content',
          summary: 'Summary',
          tags: [],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          published_at: '2024-01-01T00:00:00Z',
        },
      })

      await fetchPromise

      // Loading should be false after fetch completes
      expect(store.loading).toBe(false)
    })

    it('should set error state on API failure', async () => {
      const apiError = new ApiError({ error_code: 'NOT_FOUND', message: 'Post not found' }, 404)
      mockGetPostById.mockRejectedValueOnce(apiError)

      const store = useBlogStore()
      const result = await store.fetchPostById(999)

      expect(result).toBeNull()
      expect(store.error).not.toBeNull()
      expect(store.error?.message).toBe('Post not found')
      expect(store.loading).toBe(false)
    })

    it('should work with string ID', async () => {
      const mockPost = {
        id: 123,
        title: 'Test Post',
        content: 'Test content',
        summary: 'Test summary',
        tags: [],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        published_at: '2024-01-01T00:00:00Z',
      }

      mockGetPostById.mockResolvedValueOnce({ data: mockPost })

      const store = useBlogStore()
      const result = await store.fetchPostById('123')

      expect(mockGetPostById).toHaveBeenCalledWith('123')
      expect(result?.id).toBe(123)
    })
  })

  describe('recentPosts Computed', () => {
    it('should return first 3 posts from fetched data', async () => {
      const mockPosts = [
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
        {
          id: 2,
          title: 'Post 2',
          content: 'Content 2',
          summary: 'Summary 2',
          tags: [],
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
          published_at: '2024-01-02T00:00:00Z',
        },
        {
          id: 3,
          title: 'Post 3',
          content: 'Content 3',
          summary: 'Summary 3',
          tags: [],
          created_at: '2024-01-03T00:00:00Z',
          updated_at: '2024-01-03T00:00:00Z',
          published_at: '2024-01-03T00:00:00Z',
        },
        {
          id: 4,
          title: 'Post 4',
          content: 'Content 4',
          summary: 'Summary 4',
          tags: [],
          created_at: '2024-01-04T00:00:00Z',
          updated_at: '2024-01-04T00:00:00Z',
          published_at: '2024-01-04T00:00:00Z',
        },
      ]

      mockGetPosts.mockResolvedValueOnce({
        data: mockPosts,
        total_count: 4,
        offset: 0,
        limit: 10,
      })

      const store = useBlogStore()
      await store.fetchPosts()

      expect(store.recentPosts).toHaveLength(3)
      expect(store.recentPosts[0]?.id).toBe(1)
      expect(store.recentPosts[1]?.id).toBe(2)
      expect(store.recentPosts[2]?.id).toBe(3)
    })

    it('should return all posts if less than 3', async () => {
      const mockPosts = [
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
        {
          id: 2,
          title: 'Post 2',
          content: 'Content 2',
          summary: 'Summary 2',
          tags: [],
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
          published_at: '2024-01-02T00:00:00Z',
        },
      ]

      mockGetPosts.mockResolvedValueOnce({
        data: mockPosts,
        total_count: 2,
        offset: 0,
        limit: 10,
      })

      const store = useBlogStore()
      await store.fetchPosts()

      expect(store.recentPosts).toHaveLength(2)
    })

    it('should return empty array when no posts', () => {
      const store = useBlogStore()
      expect(store.recentPosts).toEqual([])
    })
  })

  describe('Snake Case Naming Convention', () => {
    it('should use snake_case for date fields in posts', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Post',
        content: 'Test content',
        summary: 'Test summary',
        tags: [],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        published_at: '2024-01-03T00:00:00Z',
      }

      mockGetPosts.mockResolvedValueOnce({
        data: [mockPost],
        total_count: 1,
        offset: 0,
        limit: 10,
      })

      const store = useBlogStore()
      await store.fetchPosts()

      const post = store.posts[0]
      expect(post).toHaveProperty('created_at')
      expect(post).toHaveProperty('updated_at')
      expect(post).toHaveProperty('published_at')
      expect(post).not.toHaveProperty('createdAt')
    })
  })
})
