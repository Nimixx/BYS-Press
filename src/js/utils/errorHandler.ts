/**
 * Error Handler Utility
 *
 * Provides centralized error handling for the application
 * with support for error tracking services and development logging
 */

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Error context information
 */
export interface ErrorContext {
  componentName?: string;
  action?: string;
  userId?: string | number;
  metadata?: Record<string, any>;
}

/**
 * Error handler configuration
 */
interface ErrorHandlerConfig {
  isProduction: boolean;
  enableConsoleLog: boolean;
  enableErrorTracking: boolean;
  onError?: (error: Error, context: ErrorContext) => void;
}

/**
 * Default configuration
 */
const defaultConfig: ErrorHandlerConfig = {
  isProduction: import.meta.env.PROD,
  enableConsoleLog: import.meta.env.DEV,
  enableErrorTracking: import.meta.env.PROD,
};

let config: ErrorHandlerConfig = { ...defaultConfig };

/**
 * Configure error handler
 *
 * @param userConfig - User configuration
 */
export function configureErrorHandler(userConfig: Partial<ErrorHandlerConfig>): void {
  config = { ...config, ...userConfig };
}

/**
 * Handle component errors
 *
 * @param error - The error object
 * @param context - Error context
 * @param severity - Error severity level
 */
export function handleComponentError(
  error: Error,
  context: ErrorContext = {},
  severity: ErrorSeverity = ErrorSeverity.MEDIUM,
): void {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    severity,
    context,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  };

  // Console logging (development)
  if (config.enableConsoleLog) {
    const componentLabel = context.componentName ? ` in ${context.componentName}` : '';
    console.group(`🔴 Error${componentLabel} [${severity}]`);
    console.error('Message:', error.message);
    console.error('Error:', error);
    if (context.componentName) {
      console.info('Component:', context.componentName);
    }
    if (context.action) {
      console.info('Action:', context.action);
    }
    if (context.metadata) {
      console.info('Metadata:', context.metadata);
    }
    if (error.stack) {
      console.groupCollapsed('Stack Trace');
      console.error(error.stack);
      console.groupEnd();
    }
    console.groupEnd();
  }

  // Send to error tracking service (production)
  if (config.enableErrorTracking && config.isProduction) {
    sendToErrorTracker(errorInfo);
  }

  // Custom error handler
  if (config.onError) {
    try {
      config.onError(error, context);
    } catch (handlerError) {
      console.error('Error in custom error handler:', handlerError);
    }
  }
}

/**
 * Send error to tracking service
 *
 * Replace this with your actual error tracking service (Sentry, Bugsnag, etc.)
 *
 * @param errorInfo - Error information
 */
function sendToErrorTracker(errorInfo: any): void {
  // Example: Send to Sentry
  // if (window.Sentry) {
  //   window.Sentry.captureException(errorInfo);
  // }

  // Example: Send to custom API endpoint
  // fetch('/wp-json/core-theme/v1/log-error', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(errorInfo),
  // }).catch(err => console.error('Failed to send error to tracker:', err));

  // For now, just log that we would send it
  if (config.enableConsoleLog) {
    console.info('📊 Would send to error tracker:', errorInfo);
  }
}

/**
 * Handle async errors
 *
 * @param promise - Promise to handle
 * @param context - Error context
 */
export async function handleAsyncError<T>(
  promise: Promise<T>,
  context: ErrorContext = {},
): Promise<[Error | null, T | null]> {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    handleComponentError(error as Error, context);
    return [error as Error, null];
  }
}

/**
 * Create a safe function wrapper
 *
 * Wraps a function to catch and handle errors
 *
 * @param fn - Function to wrap
 * @param context - Error context
 */
export function safeFunction<T extends (...args: any[]) => any>(
  fn: T,
  context: ErrorContext = {},
): T {
  return ((...args: any[]) => {
    try {
      return fn(...args);
    } catch (error) {
      handleComponentError(error as Error, {
        ...context,
        action: context.action || fn.name || 'anonymous function',
      });
      return undefined;
    }
  }) as T;
}

/**
 * Handle global errors
 */
export function setupGlobalErrorHandlers(): void {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    handleComponentError(
      new Error(event.reason?.message || String(event.reason)),
      {
        componentName: 'Global',
        action: 'Unhandled Promise Rejection',
        metadata: { reason: event.reason },
      },
      ErrorSeverity.HIGH,
    );
  });

  // Handle global errors
  window.addEventListener('error', (event) => {
    handleComponentError(
      event.error || new Error(event.message),
      {
        componentName: 'Global',
        action: 'Uncaught Error',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      },
      ErrorSeverity.HIGH,
    );
  });
}

/**
 * Handle network errors
 *
 * @param error - Network error
 * @param url - Request URL
 * @param context - Additional context
 */
export function handleNetworkError(
  error: Error,
  url: string,
  context: ErrorContext = {},
): void {
  handleComponentError(
    error,
    {
      ...context,
      action: 'Network Request',
      metadata: {
        ...context.metadata,
        url,
        online: navigator.onLine,
      },
    },
    ErrorSeverity.MEDIUM,
  );
}

/**
 * Log warning (non-critical issues)
 *
 * @param message - Warning message
 * @param context - Warning context
 */
export function logWarning(message: string, context: ErrorContext = {}): void {
  if (config.enableConsoleLog) {
    const componentLabel = context.componentName ? ` [${context.componentName}]` : '';
    console.warn(`⚠️ Warning${componentLabel}:`, message, context);
  }
}

/**
 * Log info message
 *
 * @param message - Info message
 * @param data - Additional data
 */
export function logInfo(message: string, data?: any): void {
  if (config.enableConsoleLog) {
    console.info(`ℹ️ ${message}`, data || '');
  }
}

/**
 * Get error message for display
 *
 * Returns user-friendly error messages for production
 *
 * @param error - The error object
 */
export function getUserFriendlyErrorMessage(error: Error): string {
  if (config.isProduction) {
    // Generic message for production
    return 'Something went wrong. Please try again later.';
  }
  // Detailed message for development
  return error.message;
}
