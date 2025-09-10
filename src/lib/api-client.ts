// Enhanced API client with retry logic and error handling

import { config } from "./config"
import { MLBackendError, NetworkError } from "./errors"

interface RetryOptions {
  attempts: number
  delay: number
  backoff?: boolean
}

export class APIClient {
  private baseUrl: string
  private timeout: number
  private defaultRetry: RetryOptions

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || config.mlBackend.baseUrl
    this.timeout = config.mlBackend.timeout
    this.defaultRetry = {
      attempts: config.mlBackend.retryAttempts,
      delay: config.mlBackend.retryDelay,
      backoff: true,
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === "AbortError") {
        throw new NetworkError("Request timed out")
      }
      throw error
    }
  }

  private async retryFetch(
    url: string,
    options: RequestInit,
    retryOptions: RetryOptions = this.defaultRetry,
  ): Promise<Response> {
    let lastError: Error

    for (let attempt = 1; attempt <= retryOptions.attempts; attempt++) {
      try {
        console.log(`[v0] API attempt ${attempt}/${retryOptions.attempts}: ${url}`)
        const response = await this.fetchWithTimeout(url, options)

        // Don't retry on client errors (4xx)
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          const errorText = await response.text()
          throw new MLBackendError(`Client error: ${response.status}`, response.status, errorText)
        }

        // Don't retry on successful responses
        if (response.ok) {
          return response
        }

        // Retry on server errors (5xx) and rate limiting (429)
        if (response.status >= 500 || response.status === 429) {
          const errorText = await response.text()
          lastError = new MLBackendError(`Server error: ${response.status}`, response.status, errorText)
        } else {
          const errorText = await response.text()
          throw new MLBackendError(`HTTP error: ${response.status}`, response.status, errorText)
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Unknown error")

        // Don't retry on network errors that aren't timeouts
        if (error instanceof TypeError && error.message.includes("fetch")) {
          throw new NetworkError("Network error - please check your connection", navigator.onLine === false)
        }
      }

      // Wait before retrying (with exponential backoff if enabled)
      if (attempt < retryOptions.attempts) {
        const delay = retryOptions.backoff ? retryOptions.delay * Math.pow(2, attempt - 1) : retryOptions.delay
        console.log(`[v0] Retrying in ${delay}ms...`)
        await this.delay(delay)
      }
    }

    throw lastError!
  }

  async post<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    }

    try {
      const response = await this.retryFetch(url, requestOptions)
      const result = await response.json()
      return result
    } catch (error) {
      console.error("[v0] API client error:", error)
      throw error
    }
  }

  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const requestOptions: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await this.retryFetch(url, requestOptions)
      const result = await response.json()
      return result
    } catch (error) {
      console.error("[v0] API client error:", error)
      throw error
    }
  }
}

// Default API client instance
export const apiClient = new APIClient()
