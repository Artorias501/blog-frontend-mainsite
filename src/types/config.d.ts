/**
 * Type definitions for config.yaml schema.
 * These types provide TypeScript support for the service configuration.
 */

/**
 * Configuration for a single backend service.
 */
export interface ServiceConfig {
  /** Service host address */
  host: string
  /** Service port number */
  port: number
  /** Full base URL for the service */
  base_url: string
}

/**
 * Root configuration object containing all service definitions.
 * This structure is extensible to support multiple services.
 */
export interface AppConfig {
  services: {
    /** Blog service backend configuration */
    blog_service: ServiceConfig
    // Future services can be added here, e.g.:
    // auth_service: ServiceConfig
    // notification_service: ServiceConfig
  }
}

/**
 * Type for the services object to allow dynamic service keys.
 * Use this when you need to iterate over services dynamically.
 */
export type ServicesMap = Record<string, ServiceConfig>
