/**
 * Tests for API configuration loader.
 * These tests verify that service URLs are properly loaded from config.yaml.
 */

import { describe, it, expect } from 'vitest'
import { getBaseUrl, SERVICE_URLS } from './config'

describe('API Config', () => {
  describe('SERVICE_URLS', () => {
    it('should export blog service URL', () => {
      expect(SERVICE_URLS).toHaveProperty('blogService')
      expect(SERVICE_URLS.blogService).toBe('http://localhost:8080')
    })
  })

  describe('getBaseUrl', () => {
    it('should return blog service base URL', () => {
      const url = getBaseUrl('blogService')
      expect(url).toBe('http://localhost:8080')
    })

    it('should throw error for unknown service', () => {
      // Cast to ServiceName to bypass TypeScript check for testing error handling
      expect(() => getBaseUrl('unknownService' as 'blogService')).toThrow()
    })
  })
})
