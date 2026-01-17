/**
 * Discovery Module Tests
 */

import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { Discovery } from '../src/discovery.js';

describe('Discovery', () => {
  let discovery;

  describe('constructor', () => {
    it('should create discovery with registry URL', () => {
      discovery = new Discovery({
        registryUrl: 'https://registry.openbare.dev'
      });
      assert.ok(discovery);
    });

    it('should accept refresh interval option', () => {
      discovery = new Discovery({
        registryUrl: 'https://registry.openbare.dev',
        refreshInterval: 60000
      });
      assert.ok(discovery);
    });
  });

  describe('getNodes', () => {
    beforeEach(() => {
      discovery = new Discovery({
        registryUrl: 'https://registry.openbare.dev',
        refreshInterval: 30000
      });
    });

    it('should return array', () => {
      const nodes = discovery.getNodes();
      assert.ok(Array.isArray(nodes));
    });

    it('should return empty array initially', () => {
      const nodes = discovery.getNodes();
      assert.strictEqual(nodes.length, 0);
    });
  });

  describe('getHealthyNodes', () => {
    beforeEach(() => {
      discovery = new Discovery({
        registryUrl: 'https://registry.openbare.dev'
      });
    });

    it('should return array', () => {
      const nodes = discovery.getHealthyNodes();
      assert.ok(Array.isArray(nodes));
    });
  });

  describe('getRandomNode', () => {
    beforeEach(() => {
      discovery = new Discovery({
        registryUrl: 'https://registry.openbare.dev'
      });
    });

    it('should return null when no nodes', () => {
      const node = discovery.getRandomNode();
      assert.strictEqual(node, null);
    });
  });

  describe('stop', () => {
    it('should stop refresh timer', () => {
      discovery = new Discovery({
        registryUrl: 'https://registry.openbare.dev',
        autoRefresh: true,
        refreshInterval: 1000
      });
      assert.doesNotThrow(() => discovery.stop());
    });
  });
});
