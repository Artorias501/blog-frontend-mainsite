/**
 * Tests for Post type ai_summary field.
 * These tests verify the Post interface includes optional ai_summary field.
 */

import { describe, it, expect } from 'vitest'
import { type Post, type Tag } from './posts'

describe('Post Type ai_summary Field', () => {
  it('should allow Post with ai_summary field', () => {
    const post: Post = {
      id: 1,
      title: 'Test Post',
      content: 'Test content',
      summary: 'Test summary',
      tags: [],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      published_at: '2024-01-01T00:00:00Z',
      ai_summary: 'AI generated summary',
    }
    expect(post.ai_summary).toBe('AI generated summary')
  })

  it('should allow Post without ai_summary field (optional)', () => {
    const post: Post = {
      id: 1,
      title: 'Test Post',
      content: 'Test content',
      summary: 'Test summary',
      tags: [],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      published_at: '2024-01-01T00:00:00Z',
    }
    expect(post.ai_summary).toBeUndefined()
  })

  it('should use snake_case for ai_summary field name', () => {
    const post: Post = {
      id: 1,
      title: 'Test',
      content: 'Content',
      summary: 'Summary',
      tags: [],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      published_at: '2024-01-01T00:00:00Z',
      ai_summary: 'Summary',
    }
    expect(post).toHaveProperty('ai_summary')
    expect(post).not.toHaveProperty('aiSummary')
  })
})
