import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debugLog, getApiEndpoint, fetchFromWP, API_CONFIG } from './config';

describe('Config Module', () => {
  describe('debugLog', () => {
    let consoleLogSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleLogSpy.mockRestore();
    });

    it('logs messages with [Core Theme] prefix', () => {
      debugLog('Test message');

      expect(consoleLogSpy).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('[Core Theme]', 'Test message');
    });

    it('handles multiple arguments', () => {
      const testData = { foo: 'bar' };
      debugLog('Test', 123, testData);

      expect(consoleLogSpy).toHaveBeenCalledWith('[Core Theme]', 'Test', 123, testData);
    });
  });

  describe('getApiEndpoint', () => {
    it('constructs endpoint URL correctly', () => {
      const result = getApiEndpoint('wp/v2/posts');

      expect(result).toContain('/wp/v2/posts');
      expect(result).toMatch(/wp-json/);
    });

    it('handles path with leading slash', () => {
      const result = getApiEndpoint('/wp/v2/posts');

      expect(result).toContain('/wp/v2/posts');
    });

    it('removes trailing slash from base URL', () => {
      const result = getApiEndpoint('posts');

      expect(result).toContain('posts');
    });

    it('handles empty path', () => {
      const result = getApiEndpoint('');

      expect(result).toMatch(/\/$/);
    });

    it('handles path without leading slash', () => {
      const result = getApiEndpoint('categories');

      expect(result).toContain('categories');
    });
  });

  describe('fetchFromWP', () => {
    beforeEach(() => {
      // Mock global fetch
      global.fetch = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('fetches data successfully', async () => {
      const mockData = { id: 1, title: 'Test Post' };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await fetchFromWP('wp/v2/posts/1');

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/wp/v2/posts/1'),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('throws error on HTTP error response', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchFromWP('wp/v2/posts/999')).rejects.toThrow('HTTP error! status: 404');
    });

    it('throws error on network failure', async () => {
      const networkError = new Error('Network error');
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(networkError);

      await expect(fetchFromWP('wp/v2/posts')).rejects.toThrow('Network error');
    });

    it('logs error to console on failure', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const networkError = new Error('Network error');
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(networkError);

      try {
        await fetchFromWP('wp/v2/posts');
      } catch (error) {
        // Expected to throw
      }

      expect(consoleErrorSpy).toHaveBeenCalledWith('API Error:', networkError);
      consoleErrorSpy.mockRestore();
    });

    it('sets correct Content-Type header', async () => {
      const mockData = {};
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await fetchFromWP('wp/v2/posts');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });
  });

  describe('API_CONFIG', () => {
    it('has default baseUrl', () => {
      expect(API_CONFIG.baseUrl).toBeDefined();
      expect(typeof API_CONFIG.baseUrl).toBe('string');
    });

    it('has default version', () => {
      expect(API_CONFIG.version).toBeDefined();
      expect(typeof API_CONFIG.version).toBe('string');
    });

    it('has timeout configured', () => {
      expect(API_CONFIG.timeout).toBe(10000);
    });
  });
});
