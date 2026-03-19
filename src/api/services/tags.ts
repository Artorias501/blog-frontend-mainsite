/**
 * Tags API service module.
 * Provides methods to fetch tag list and individual tag details.
 */

import { request } from '../client'
import type { PaginatedResponse } from '../types'

/**
 * Tag type definition.
 * Represents a tag with its metadata.
 */
export interface Tag {
  /** Unique identifier for the tag */
  id: number
  /** Name of the tag */
  name: string
  /** ISO 8601 timestamp when the tag was created */
  created_at: string
}

/**
 * Parameters for getTags function.
 */
export interface GetTagsParams {
  /** Maximum number of items per page */
  limit?: number
  /** Offset in the result set */
  offset?: number
}

/**
 * Parameters for searchTags function.
 */
export interface SearchTagsParams {
  /** Maximum number of items per page */
  limit?: number
  /** Offset in the result set */
  offset?: number
}

/**
 * Fetch paginated list of tags.
 * @param params - Pagination parameters
 * @returns Paginated response with tags data
 */
export async function getTags(params?: GetTagsParams): Promise<PaginatedResponse<Tag>> {
  const response = await request<PaginatedResponse<Tag>>('GET', '/tags', { params })
  return response.data
}

/**
 * Fetch a single tag by its ID.
 * @param id - The tag ID (number or string)
 * @returns The tag data
 * @throws ApiError if the tag is not found
 */
export async function getTagById(id: number | string): Promise<{ data: Tag }> {
  return request<Tag>('GET', `/tags/${id}`)
}

/**
 * Search tags by keyword.
 * @param keyword - The search keyword
 * @param params - Optional pagination parameters
 * @returns Paginated response with matching tags
 */
export async function searchTags(
  keyword: string,
  params?: SearchTagsParams,
): Promise<PaginatedResponse<Tag>> {
  const response = await request<PaginatedResponse<Tag>>('GET', '/tags/search', {
    params: { keyword, ...params },
  })
  return response.data
}
