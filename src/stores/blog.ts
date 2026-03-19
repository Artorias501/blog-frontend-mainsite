/**
 * Blog store module.
 * Provides reactive state management for blog posts with API integration.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getPosts, getPostById, type Post, type GetPostsParams } from '@/api/services/posts'
import type { ApiError } from '@/api/client'

export const useBlogStore = defineStore('blog', () => {
  // State
  const posts = ref<Post[]>([])
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  // Computed
  const recentPosts = computed(() => posts.value.slice(0, 3))

  // Actions
  /**
   * Fetch posts from the API and update state.
   * @param params - Optional pagination and filter parameters
   */
  async function fetchPosts(params?: GetPostsParams): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await getPosts(params)
      posts.value = response.data
    } catch (err) {
      error.value = err as ApiError
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch a single post by ID from the API.
   * @param id - The post ID (number or string)
   * @returns The post data or null if not found
   */
  async function fetchPostById(id: number | string): Promise<Post | null> {
    loading.value = true
    error.value = null

    try {
      const response = await getPostById(id)
      return response.data
    } catch (err) {
      error.value = err as ApiError
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    posts,
    loading,
    error,
    // Computed
    recentPosts,
    // Actions
    fetchPosts,
    fetchPostById,
  }
})
