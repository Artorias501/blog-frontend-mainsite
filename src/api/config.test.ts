/**
 * Tests for API configuration loader.
 * These tests verify that service URLs are properly loaded from config.yaml.
 */

import { describe, it, expect } from 'vitest'
import { getBaseUrl } from './config'

describe('API Config', () => {
  describe('getBaseUrl', () => {
    it('should return blog service base URL with /api/v1 prefix', () => {
      const url = getBaseUrl('blog-service')
      expect(url).toBe('http://localhost:8080/api/v1')
    })

    it('should throw error for unknown service', () => {
      // Cast to ServiceName to bypass TypeScript check for testing error handling
      expect(() => getBaseUrl('unknown-service' as 'blog-service')).toThrow()
    })
  })
})
