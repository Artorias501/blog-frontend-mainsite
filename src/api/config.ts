/**
 * API configuration loader.
 * Exports service base URLs for use by the API client.
 *
 * Configuration is loaded from config.yaml at build time via Vite's yaml plugin.
 * This module provides type-safe access to service URLs.
 */

// Import config.yaml - Vite will parse this as JSON
import config from '../../config.yaml'

/**
 * Service configuration schema.
 */
interface ServiceConfig {
  host: string
  port: number
  base_url: string
}

/**
 * Config file schema.
 */
interface ConfigSchema {
  services: {
    'blog-service': ServiceConfig
    [key: string]: ServiceConfig
  }
}

/**
 * Service name type for type-safe URL access.
 */
export type ServiceName = 'blog-service'

/**
 * Parsed configuration object.
 */
const parsedConfig = config as unknown as ConfigSchema

/**
 * Get the base URL for a specific service.
 * @param serviceName - The name of the service (e.g., 'blog-service')
 * @returns The base URL for the service (includes /api/v1 prefix)
 * @throws Error if the service name is not found
 */
export function getBaseUrl(serviceName: ServiceName): string {
  const service = parsedConfig.services[serviceName]
  if (!service) {
    throw new Error(`Unknown service: ${serviceName}`)
  }
  return service.base_url
}

/**
 * Default service to use for API calls.
 */
export const DEFAULT_SERVICE: ServiceName = 'blog-service'
