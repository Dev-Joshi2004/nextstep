// Error handling utilities and custom error classes

export class MLBackendError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any,
  ) {
    super(message)
    this.name = "MLBackendError"
  }
}

export class QuizValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message)
    this.name = "QuizValidationError"
  }
}

export class DatabaseError extends Error {
  constructor(
    message: string,
    public operation?: string,
  ) {
    super(message)
    this.name = "DatabaseError"
  }
}

export class NetworkError extends Error {
  constructor(
    message: string,
    public isOffline?: boolean,
  ) {
    super(message)
    this.name = "NetworkError"
  }
}

// Error message helpers
export const errorMessages = {
  network: {
    offline: "You appear to be offline. Please check your internet connection and try again.",
    timeout: "The request timed out. Please try again.",
    serverError: "Our servers are experiencing issues. Please try again in a few minutes.",
    notFound: "The requested resource was not found.",
  },
  quiz: {
    invalidAnswers: "Please answer all questions before submitting.",
    invalidScore: "Please select a valid rating (1-5) for each question.",
    sessionExpired: "Your quiz session has expired. Please start over.",
  },
  ml: {
    processingFailed: "Failed to process your quiz results. Please try again.",
    noRecommendations: "We couldn't generate recommendations at this time. Please try again later.",
    invalidResponse: "Received invalid response from recommendation service.",
  },
  auth: {
    notAuthenticated: "Please log in to access this feature.",
    sessionExpired: "Your session has expired. Please log in again.",
  },
  general: {
    unexpected: "An unexpected error occurred. Please try again.",
    maintenance: "The system is currently under maintenance. Please try again later.",
  },
} as const

// Error classification helper
export function classifyError(error: unknown): {
  type: keyof typeof errorMessages
  message: string
  isRetryable: boolean
  shouldReport: boolean
} {
  if (error instanceof MLBackendError) {
    return {
      type: "ml",
      message: error.message,
      isRetryable: error.statusCode !== 400,
      shouldReport: true,
    }
  }

  if (error instanceof QuizValidationError) {
    return {
      type: "quiz",
      message: error.message,
      isRetryable: false,
      shouldReport: false,
    }
  }

  if (error instanceof NetworkError) {
    return {
      type: "network",
      message: error.message,
      isRetryable: true,
      shouldReport: !error.isOffline,
    }
  }

  if (error instanceof DatabaseError) {
    return {
      type: "general",
      message: error.message,
      isRetryable: true,
      shouldReport: true,
    }
  }

  // Handle fetch errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      type: "network",
      message: errorMessages.network.offline,
      isRetryable: true,
      shouldReport: false,
    }
  }

  // Default case
  return {
    type: "general",
    message: errorMessages.general.unexpected,
    isRetryable: true,
    shouldReport: true,
  }
}
