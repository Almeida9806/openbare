/**
 * OpenBare Client Tests
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { OpenBareClient } from '../src/index.js';

describe('OpenBareClient', () => {
  let client;

  describe('constructor', () => {
    it('should create client with default options', () => {
      client = new OpenBareClient();
      assert.ok(client);
    });

    it('should accept servers array', () => {
      client = new OpenBareClient({
        servers: ['https://bare1.example.com', 'https://bare2.example.com']
      });
      assert.ok(client);
    });

    it('should accept timeout option', () => {
      client = new OpenBareClient({
        timeout: 10000
      });
      assert.ok(client);
    });

    it('should accept retries option', () => {
      client = new OpenBareClient({
        retries: 5
      });
      assert.ok(client);
    });

    it('should accept strategy option', () => {
      client = new OpenBareClient({
        strategy: 'round-robin'
      });
      assert.ok(client);
    });

    it('should accept registry URL for discovery', () => {
      client = new OpenBareClient({
        registryUrl: 'https://registry.openbare.dev',
        autoDiscover: true
      });
      assert.ok(client);
    });
  });

  describe('addServer', () => {
    beforeEach(() => {
      client = new OpenBareClient();
    });

    it('should add server and return client for chaining', () => {
      const result = client.addServer('https://bare1.example.com');
      assert.strictEqual(result, client);
    });

    it('should add multiple servers', () => {
      client
        .addServer('https://bare1.example.com')
        .addServer('https://bare2.example.com')
        .addServer('https://bare3.example.com');
      
      const servers = client.getServers();
      assert.strictEqual(servers.length, 3);
    });

    it('should accept priority parameter', () => {
      client.addServer('https://bare1.example.com', 1);
      const servers = client.getServers();
      assert.strictEqual(servers.length, 1);
    });
  });

  describe('removeServer', () => {
    beforeEach(() => {
      client = new OpenBareClient({
        servers: ['https://bare1.example.com', 'https://bare2.example.com']
      });
    });

    it('should remove server', () => {
      client.removeServer('https://bare1.example.com');
      const servers = client.getServers();
      assert.strictEqual(servers.length, 1);
      assert.strictEqual(servers[0].url, 'https://bare2.example.com');
    });
  });

  describe('getServers', () => {
    it('should return empty array when no servers', () => {
      client = new OpenBareClient();
      const servers = client.getServers();
      assert.ok(Array.isArray(servers));
      assert.strictEqual(servers.length, 0);
    });

    it('should return added servers', () => {
      client = new OpenBareClient({
        servers: ['https://bare1.example.com']
      });
      const servers = client.getServers();
      assert.strictEqual(servers.length, 1);
    });
  });

  describe('getHealthyServers', () => {
    beforeEach(() => {
      client = new OpenBareClient({
        servers: ['https://bare1.example.com', 'https://bare2.example.com']
      });
    });

    it('should return healthy servers', () => {
      const healthy = client.getHealthyServers();
      assert.ok(Array.isArray(healthy));
    });
  });

  describe('destroy', () => {
    it('should clean up resources', () => {
      client = new OpenBareClient({
        servers: ['https://bare1.example.com'],
        autoHealthCheck: true
      });
      assert.doesNotThrow(() => client.destroy());
    });
  });
});
