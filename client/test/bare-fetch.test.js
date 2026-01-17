/**
 * Bare Fetch Tests
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BareError } from '../src/bare-fetch.js';

describe('BareError', () => {
  describe('constructor', () => {
    it('should create error with message', () => {
      const error = new BareError('Test error');
      assert.strictEqual(error.message, 'Test error');
    });

    it('should create error with status', () => {
      const error = new BareError('Not found', 404);
      assert.strictEqual(error.status, 404);
    });

    it('should be instance of Error', () => {
      const error = new BareError('Test');
      assert.ok(error instanceof Error);
    });

    it('should have name property', () => {
      const error = new BareError('Test');
      assert.strictEqual(error.name, 'BareError');
    });
  });
});

describe('bareFetch', () => {
  // Note: These tests require a running bare server
  // In a real test suite, you would mock the fetch calls
  
  it('should export bareFetch function', async () => {
    const { bareFetch } = await import('../src/bare-fetch.js');
    assert.ok(typeof bareFetch === 'function');
  });
});
