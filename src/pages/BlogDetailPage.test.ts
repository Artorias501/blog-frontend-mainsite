/**
 * Tests for BlogDetailPage component.
 * These tests verify the BlogDetailPage component works with async data loading.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import BlogDetailPage from '@/pages/BlogDetailPage.vue'
import { useBlogStore } from '@/stores/blog'

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    params: { id: '1' },
  })),
}))

// Mock the blog store
vi.mock('@/stores/blog', () => ({
  useBlogStore: vi.fn(),
}))

describe('BlogDetailPage Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Loading State', () => {
    it('should display loading indicator when loading is true', () => {
      const mockStore = {
        posts: [],
        loading: true,
        error: null,
        fetchPostById: vi.fn(),
      }
      vi.mocked(useBlogStore).mockReturnValue(mockStore as any)

      const wrapper = mount(BlogDetailPage)

      // Should show loading indicator
      expect(
        wrapper.find('.loading-indicator').exists() ||
          wrapper.text().includes('加载中') ||
          wrapper.text().includes('Loading'),
      ).toBe(true)
    })

    it('should not display loading indicator when loading is false', async () => {
      const mockStore = {
        posts: [],
        loading: false,
        error: null,
        fetchPostById: vi.fn().mockResolvedValue({
          id: 1,
          title: 'Test',
          content: 'Content',
          summary: 'Summary',
          tags: [],
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          published_at: '2024-01-01',
        }),
      }
      vi.mocked(useBlogStore).mockReturnValue(mockStore as any)

      const wrapper = mount(BlogDetailPage)
      await flushPromises()

      // Should not show loading indicator after data is loaded
      expect(wrapper.find('.loading-indicator').exists()).toBe(false)
    })
  })

  describe('Error Handling', () => {
    it('should display error message when post not found', async () => {
      const mockStore = {
        posts: [],
        loading: false,
        error: null,
        fetchPostById: vi.fn().mockResolvedValue(null),
      }
      vi.mocked(useBlogStore).mockReturnValue(mockStore as any)

      const wrapper = mount(BlogDetailPage)
      await flushPromises()

      // Should show error message
      const text = wrapper.text()
      expect(text.includes('404') || text.includes('未找到')).toBe(true)
    })
  })

  describe('Data Fetching', () => {
    it('should call fetchPostById with route param on mount', async () => {
      const mockFetchPostById = vi.fn().mockResolvedValue({
        id: 1,
        title: 'Test Post',
        content: 'Test content',
        summary: 'Test summary',
        tags: [],
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-16T10:30:00Z',
        published_at: '2024-01-17T10:30:00Z',
      })
      const mockStore = {
        posts: [],
        loading: false,
        error: null,
        fetchPostById: mockFetchPostById,
      }
      vi.mocked(useBlogStore).mockReturnValue(mockStore as any)

      mount(BlogDetailPage)

      // fetchPostById should be called with route param
      expect(mockFetchPostById).toHaveBeenCalledWith('1')
    })
  })

  describe('Snake_case Field Names', () => {
    it('should display created_at field instead of createdAt', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Post',
        content: 'Test content',
        summary: 'Test summary',
        tags: [],
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-16T10:30:00Z',
        published_at: '2024-01-17T10:30:00Z',
      }
      const mockStore = {
        posts: [],
        loading: false,
        error: null,
        fetchPostById: vi.fn().mockResolvedValue(mockPost),
      }
      vi.mocked(useBlogStore).mockReturnValue(mockStore as any)

      const wrapper = mount(BlogDetailPage)
      await flushPromises()
      const html = wrapper.html()

      // Should use created_at (formatted date)
      expect(html).toContain('2024')
    })

    it('should display ai_summary field when present', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Post',
        content: 'Test content',
        summary: 'Test summary',
        tags: [],
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-16T10:30:00Z',
        published_at: '2024-01-17T10:30:00Z',
        ai_summary: 'AI generated summary of the post',
      }
      const mockStore = {
        posts: [],
        loading: false,
        error: null,
        fetchPostById: vi.fn().mockResolvedValue(mockPost),
      }
      vi.mocked(useBlogStore).mockReturnValue(mockStore as any)

      const wrapper = mount(BlogDetailPage)
      await flushPromises()
      const html = wrapper.html()

      // Should display ai_summary
      expect(html).toContain('AI generated summary')
    })
  })

  describe('Tags as Objects', () => {
    it('should display tag.name instead of tag string', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Post',
        content: 'Test content',
        summary: 'Test summary',
        tags: [
          { id: 1, name: 'typescript' },
          { id: 2, name: 'vue' },
        ],
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-16T10:30:00Z',
        published_at: '2024-01-17T10:30:00Z',
      }
      const mockStore = {
        posts: [],
        loading: false,
        error: null,
        fetchPostById: vi.fn().mockResolvedValue(mockPost),
      }
      vi.mocked(useBlogStore).mockReturnValue(mockStore as any)

      const wrapper = mount(BlogDetailPage)
      await flushPromises()
      const html = wrapper.html()

      // Should display tag names
      expect(html).toContain('typescript')
      expect(html).toContain('vue')
    })
  })

  describe('ReadTime Removal', () => {
    it('should not display readTime field', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Post',
        content: 'Test content',
        summary: 'Test summary',
        tags: [],
        created_at: '2024-01-15T10:30:00Z',
      }
      const mockStore = {
        posts: [],
        loading: false,
        error: null,
        fetchPostById: vi.fn().mockResolvedValue(mockPost),
      }
      vi.mocked(useBlogStore).mockReturnValue(mockStore as any)

      const wrapper = mount(BlogDetailPage)
      await flushPromises()
      const html = wrapper.html()

      // Should not contain readTime or "min" text
      expect(html).not.toContain('readTime')
      expect(html).not.toContain('分钟阅读')
    })
  })
})
