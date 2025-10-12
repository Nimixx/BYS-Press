/**
 * Error Handler Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  handleComponentError,
  configureErrorHandler,
  handleAsyncError,
  safeFunction,
  logWarning,
  logInfo,
  getUserFriendlyErrorMessage,
  ErrorSeverity,
} from './errorHandler';

describe('errorHandler', () => {
  beforeEach(() => {
    // Reset console mocks
    vi.clearAllMocks();

    // Configure for testing
    configureErrorHandler({
      isProduction: false,
      enableConsoleLog: true,
      enableErrorTracking: false,
    });
  });

  describe('handleComponentError', () => {
    it('should handle error with context', () => {
      const consoleGroupSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const consoleGroupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

      const error = new Error('Test error');
      const context = {
        componentName: 'TestComponent',
        action: 'Test action',
      };

      handleComponentError(error, context, ErrorSeverity.HIGH);

      expect(consoleGroupSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Message:', 'Test error');
      expect(consoleGroupEndSpy).toHaveBeenCalled();

      consoleGroupSpy.mockRestore();
      consoleErrorSpy.mockRestore();
      consoleGroupEndSpy.mockRestore();
    });

    it('should call custom onError handler', () => {
      const onError = vi.fn();

      configureErrorHandler({
        isProduction: false,
        enableConsoleLog: false,
        enableErrorTracking: false,
        onError,
      });

      const error = new Error('Test error');
      const context = { componentName: 'TestComponent' };

      handleComponentError(error, context);

      expect(onError).toHaveBeenCalledWith(error, context);
    });
  });

  describe('handleAsyncError', () => {
    it('should handle successful promise', async () => {
      const promise = Promise.resolve('success');
      const [error, result] = await handleAsyncError(promise);

      expect(error).toBeNull();
      expect(result).toBe('success');
    });

    it('should handle rejected promise', async () => {
      const consoleGroupSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const consoleGroupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

      const promise = Promise.reject(new Error('Async error'));
      const [error, result] = await handleAsyncError(promise, {
        componentName: 'AsyncComponent',
      });

      expect(error).toBeInstanceOf(Error);
      expect(result).toBeNull();
      expect(consoleGroupSpy).toHaveBeenCalled();

      consoleGroupSpy.mockRestore();
      consoleErrorSpy.mockRestore();
      consoleGroupEndSpy.mockRestore();
    });
  });

  describe('safeFunction', () => {
    it('should execute function normally when no error', () => {
      const fn = vi.fn((x: number) => x * 2);
      const safeFn = safeFunction(fn);

      const result = safeFn(5);

      expect(fn).toHaveBeenCalledWith(5);
      expect(result).toBe(10);
    });

    it('should catch and handle errors', () => {
      const consoleGroupSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const consoleGroupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

      const fn = () => {
        throw new Error('Function error');
      };
      const safeFn = safeFunction(fn, { componentName: 'SafeComponent' });

      const result = safeFn();

      expect(result).toBeUndefined();
      expect(consoleGroupSpy).toHaveBeenCalled();

      consoleGroupSpy.mockRestore();
      consoleErrorSpy.mockRestore();
      consoleGroupEndSpy.mockRestore();
    });
  });

  describe('logWarning', () => {
    it('should log warning with context', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      logWarning('Test warning', {
        componentName: 'TestComponent',
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Warning'),
        expect.stringContaining('Test warning'),
        expect.any(Object),
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('logInfo', () => {
    it('should log info message', () => {
      const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

      logInfo('Test info', { data: 'test' });

      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringContaining('Test info'),
        expect.any(Object),
      );

      consoleInfoSpy.mockRestore();
    });
  });

  describe('getUserFriendlyErrorMessage', () => {
    it('should return generic message in production', () => {
      configureErrorHandler({
        isProduction: true,
        enableConsoleLog: false,
        enableErrorTracking: false,
      });

      const error = new Error('Technical error message');
      const message = getUserFriendlyErrorMessage(error);

      expect(message).toBe('Something went wrong. Please try again later.');
    });

    it('should return detailed message in development', () => {
      configureErrorHandler({
        isProduction: false,
        enableConsoleLog: true,
        enableErrorTracking: false,
      });

      const error = new Error('Technical error message');
      const message = getUserFriendlyErrorMessage(error);

      expect(message).toBe('Technical error message');
    });
  });

  describe('ErrorSeverity', () => {
    it('should have correct severity values', () => {
      expect(ErrorSeverity.LOW).toBe('low');
      expect(ErrorSeverity.MEDIUM).toBe('medium');
      expect(ErrorSeverity.HIGH).toBe('high');
      expect(ErrorSeverity.CRITICAL).toBe('critical');
    });
  });
});
