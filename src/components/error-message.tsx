"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, X } from "lucide-react"
import { classifyError } from "@/lib/errors"

interface ErrorMessageProps {
  error: unknown
  onRetry?: () => void
  onDismiss?: () => void
  className?: string
}

export function ErrorMessage({ error, onRetry, onDismiss, className }: ErrorMessageProps) {
  const { type, message, isRetryable } = classifyError(error)

  return (
    <Alert variant="destructive" className={className}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="flex items-center justify-between">
        Error
        {onDismiss && (
          <Button variant="ghost" size="sm" onClick={onDismiss} className="h-auto p-1">
            <X className="h-3 w-3" />
          </Button>
        )}
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">{message}</p>
        {isRetryable && onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="w-3 h-3 mr-2" />
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
