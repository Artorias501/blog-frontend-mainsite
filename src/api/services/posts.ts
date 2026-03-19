/**
 * Posts API service module.
 * Provides methods to fetch post list and individual post details.
 */

import { request } from '../client'
import type { PaginatedResponse } from '../types'

/**
 * Tag type definition.
 * Represents a tag associated with a post.
 */
export interface Tag {
  /** Unique identifier for the tag */
  id: number
  /** Name of the tag */
  name: string
}

/**
 * Post type definition.
 * Represents a blog post with all its metadata.
 */
export interface Post {
  /** Unique identifier for the post */
  id: number
  /** Title of the post */
  title: string
  /** Full content of the post in markdown format */
  content: string
  /** Short summary/excerpt of the post */
  summary: string
  /** Tags associated with the post */
  tags: Tag[]
  /** ISO 8601 timestamp when the post was created */
  created_at: string
  /** ISO 8601 timestamp when the post was last updated */
  updated_at: string
  /** ISO 8601 timestamp when the post was published */
  published_at: string
  /** AI-generated summary of the post (optional) */
  ai_summary?: string
}

/**
 * Parameters for getPosts function.
 */
export interface GetPostsParams {
  /** Maximum number of items per page */
  limit?: number
  /** Offset in the result set */
  offset?: number
  /** Filter by tag name */
  tag?: string
  [key: string]: unknown
}

/**
 * Parameters for searchPosts function.
 */
export interface SearchPostsParams {
  /** Maximum number of items per page */
  limit?: number
  /** Offset in the result set */
  offset?: number
  [key: string]: unknown
}

/**
 * Fetch paginated list of posts with optional filtering.
 * @param params - Pagination and filter parameters
 * @returns Paginated response with posts data
 */
export async function getPosts(params?: GetPostsParams): Promise<PaginatedResponse<Post>> {
  const response = await request<{
    items: Post[]
    total: number
    page: number
    page_size: number
    total_page: number
  }>('GET', '/posts', { params })
  return response.data
}

/**
 * Fetch a single post by its ID.
 * @param id - The post ID (number or string)
 * @returns The post data
 * @throws ApiError if the post is not found
 */
export async function getPostById(id: number | string): Promise<{ data: Post }> {
  return request<Post>('GET', `/posts/${id}`)
}

/**
 * Search posts by keyword.
 * @param keyword - The search keyword
 * @param params - Optional pagination parameters
 * @returns Paginated response with matching posts
 */
export async function searchPosts(
  keyword: string,
  params?: SearchPostsParams,
): Promise<PaginatedResponse<Post>> {
  const response = await request<{
    items: Post[]
    total: number
    page: number
    page_size: number
    total_page: number
  }>('GET', '/posts/search', {
    params: { keyword, ...params },
  })
  return response.data
}
