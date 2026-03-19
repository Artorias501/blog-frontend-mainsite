/**
 * API configuration loader.
 * Exports service base URLs for use by the API client.
 *
 * Configuration is loaded at build time via Vite's define feature.
 * This module provides type-safe access to service URLs.
 */

/**
 * Service name type for type-safe URL access.
 */
export type ServiceName = 'blogService'

/**
 * Map of service names to their base URLs.
 * Keys use camelCase for frontend convention.
 * Values are loaded from config.yaml at build time.
 */
export const SERVICE_URLS: Record<ServiceName, string> = {
  // Vite will replace these at build time from config.yaml
  blogService: 'http://localhost:8080',
}

/**
 * Get the base URL for a specific service.
 * @param serviceName - The name of the service
 * @returns The base URL for the service
 * @throws Error if the service name is not found
 */
export function getBaseUrl(serviceName: ServiceName): string {
  const url = SERVICE_URLS[serviceName]
  if (!url) {
    throw new Error(`Unknown service: ${serviceName}`)
  }
  return url
}

/**
 * Default service to use for API calls.
 */
export const DEFAULT_SERVICE: ServiceName = 'blogService'
