/**
 * Server Pool Tests
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { ServerPool } from '../src/server-pool.js';

describe('ServerPool', () => {
  let pool;

  beforeEach(() => {
    pool = new ServerPool({
      strategy: 'fastest',
      healthCheckInterval: 30000,
      timeout: 5000
    });
  });

  describe('constructor', () => {
    it('should create pool with default options', () => {
      const p = new ServerPool();
      assert.ok(p);
    });

    it('should accept custom options', () => {
      const p = new ServerPool({
        strategy: 'round-robin',
        timeout: 10000
      });
      assert.ok(p);
    });
  });

  describe('addServer', () => {
    it('should add a server to the pool', () => {
      pool.addServer('https://bare1.example.com');
      const servers = pool.getAllServers();
      assert.strictEqual(servers.length, 1);
      assert.strictEqual(servers[0].url, 'https://bare1.example.com');
    });

    it('should add multiple servers', () => {
      pool.addServer('https://bare1.example.com');
      pool.addServer('https://bare2.example.com');
      pool.addServer('https://bare3.example.com');
      const servers = pool.getAllServers();
      assert.strictEqual(servers.length, 3);
    });

    it('should not add duplicate servers', () => {
      pool.addServer('https://bare1.example.com');
      pool.addServer('https://bare1.example.com');
      const servers = pool.getAllServers();
      assert.strictEqual(servers.length, 1);
    });

    it('should accept priority', () => {
      pool.addServer('https://bare1.example.com', 10);
      pool.addServer('https://bare2.example.com', 1);
      const servers = pool.getAllServers();
      assert.strictEqual(servers.length, 2);
    });
  });

  describe('removeServer', () => {
    it('should remove a server from the pool', () => {
      pool.addServer('https://bare1.example.com');
      pool.addServer('https://bare2.example.com');
      pool.removeServer('https://bare1.example.com');
      const servers = pool.getAllServers();
      assert.strictEqual(servers.length, 1);
      assert.strictEqual(servers[0].url, 'https://bare2.example.com');
    });

    it('should handle removing non-existent server', () => {
      pool.addServer('https://bare1.example.com');
      pool.removeServer('https://nonexistent.com');
      const servers = pool.getAllServers();
      assert.strictEqual(servers.length, 1);
    });
  });

  describe('getServer', () => {
    it('should return null when pool is empty', () => {
      const server = pool.getServer();
      assert.strictEqual(server, null);
    });

    it('should return a server when available', () => {
      pool.addServer('https://bare1.example.com');
      const server = pool.getServer();
      assert.ok(server);
      assert.strictEqual(server.url, 'https://bare1.example.com');
    });
  });

  describe('getHealthyServers', () => {
    it('should return empty array when no servers', () => {
      const healthy = pool.getHealthyServers();
      assert.ok(Array.isArray(healthy));
      assert.strictEqual(healthy.length, 0);
    });

    it('should return servers (all healthy by default)', () => {
      pool.addServer('https://bare1.example.com');
      pool.addServer('https://bare2.example.com');
      const healthy = pool.getHealthyServers();
      assert.strictEqual(healthy.length, 2);
    });
  });

  describe('markUnhealthy', () => {
    it('should mark server as unhealthy', () => {
      pool.addServer('https://bare1.example.com');
      pool.markUnhealthy('https://bare1.example.com');
      const servers = pool.getAllServers();
      assert.strictEqual(servers[0].healthy, false);
    });
  });

  describe('markHealthy', () => {
    it('should mark server as healthy', () => {
      pool.addServer('https://bare1.example.com');
      pool.markUnhealthy('https://bare1.example.com');
      pool.markHealthy('https://bare1.example.com');
      const servers = pool.getAllServers();
      assert.strictEqual(servers[0].healthy, true);
    });
  });

  describe('updateLatency', () => {
    it('should update server latency', () => {
      pool.addServer('https://bare1.example.com');
      pool.updateLatency('https://bare1.example.com', 150);
      const servers = pool.getAllServers();
      assert.strictEqual(servers[0].latency, 150);
    });
  });

  describe('getAllServers', () => {
    it('should return all servers', () => {
      pool.addServer('https://bare1.example.com');
      pool.addServer('https://bare2.example.com');
      const servers = pool.getAllServers();
      assert.strictEqual(servers.length, 2);
    });

    it('should return server objects with expected properties', () => {
      pool.addServer('https://bare1.example.com');
      const servers = pool.getAllServers();
      assert.ok(servers[0].url);
      assert.ok(typeof servers[0].healthy === 'boolean');
      assert.ok(typeof servers[0].latency === 'number');
    });
  });
});
