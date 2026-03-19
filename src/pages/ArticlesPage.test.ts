/**
 * Tests for ArticlesPage component.
 * These tests verify the ArticlesPage component works with async data loading.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ArticlesPage from '@/pages/ArticlesPage.vue'
import { useBlogStore } from '@/stores/blog'

// Mock the blog store
vi.mock('@/stores/blog', () => ({
  useBlogStore: vi.fn(),
}))

describe('ArticlesPage Component', () => {
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
        fetchPosts: vi.fn(),
      }
      vi.mocked(useBlogStore).mockReturnValue(mockStore as any)

      const wrapper = mount(ArticlesPage)

      // Should show loading indicator
      expect(
        wrapper.find('.loading-indicator').exists() ||
          wrapper.text().includes('加载中') ||
          wrapper.text().includes('Loading'),
      ).toBe(true)
    })

    it('should not display loading indicator when loading is false', () => {
      const mockStore = {
        posts: [{ id: 1, title: 'Test', summary: 'Test', created_at: '2024-01-01' }],
        loading: false,
        error: null,
        fetchPosts: vi.fn(),
      }
      vi.mocked(useBlogStore).mockReturnValue(mockStore as any)

      const wrapper = mount(ArticlesPage)

      // Should not show loading indicator
      expect(wrapper.find('.loading-indicator').exists()).toBe(false)
    })
  })

  describe('Data Fetching', () => {
    it('should call fetchPosts on mount', async () => {
      const mockFetchPosts = vi.fn()
      const mockStore = {
        posts: [],
        loading: false,
        error: null,
        fetchPosts: mockFetchPosts,
      }
      vi.mocked(useBlogStore).mockReturnValue(mockStore as any)

      mount(ArticlesPage)

      // fetchPosts should be called on mount
      expect(mockFetchPosts).toHaveBeenCalled()
    })
  })

  describe('Snake_case Field Names', () => {
    it('should display created_at field instead of createdAt', () => {
      const mockStore = {
        posts: [
          {
            id: 1,
            title: 'Test Post',
            summary: 'Test summary',
            tags: [],
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-16T10:30:00Z',
            published_at: '2024-01-17T10:30:00Z',
          },
        ],
        loading: false,
        error: null,
        fetchPosts: vi.fn(),
      }
      vi.mocked(useBlogStore).mockReturnValue(mockStore as any)

      const wrapper = mount(ArticlesPage)
      const html = wrapper.html()

      // Should use created_at (formatted date)
      expect(html).toContain('2024')
    })
  })

  describe('Tags as Objects', () => {
    it('should display tag.name instead of tag string', () => {
      const mockStore = {
        posts: [
          {
            id: 1,
            title: 'Test Post',
            summary: 'Test summary',
            tags: [
              { id: 1, name: 'typescript' },
              { id: 2, name: 'vue' },
            ],
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-16T10:30:00Z',
            published_at: '2024-01-17T10:30:00Z',
          },
        ],
        loading: false,
        error: null,
        fetchPosts: vi.fn(),
      }
      vi.mocked(useBlogStore).mockReturnValue(mockStore as any)

      const wrapper = mount(ArticlesPage)
      const html = wrapper.html()

      // Should display tag names
      expect(html).toContain('typescript')
      expect(html).toContain('vue')
    })
  })

  describe('ReadTime Removal', () => {
    it('should not display readTime field', () => {
      const mockStore = {
        posts: [
          {
            id: 1,
            title: 'Test Post',
            summary: 'Test summary',
            tags: [],
            created_at: '2024-01-15T10:30:00Z',
          },
        ],
        loading: false,
        error: null,
        fetchPosts: vi.fn(),
      }
      vi.mocked(useBlogStore).mockReturnValue(mockStore as any)

      const wrapper = mount(ArticlesPage)
      const html = wrapper.html()

      // Should not contain readTime or "min" text
      expect(html).not.toContain('readTime')
      expect(html).not.toContain('分钟阅读')
    })
  })
})
