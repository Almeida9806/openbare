/**
 * Registry Database Tests
 */

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Test with in-memory database
process.env.DATABASE_PATH = ':memory:';

describe('Database Module', () => {
  let db;

  beforeEach(async () => {
    // Fresh import for each test
    delete require.cache[require.resolve('../db.js')];
    db = require('../db.js');
    await db.initialize();
  });

  describe('initialize', () => {
    it('should create database successfully', async () => {
      assert.ok(db);
    });
  });

  describe('registerNode', () => {
    it('should register a new node', () => {
      const node = {
        url: 'https://bare1.example.com',
        nodeId: 'test-node-1',
        region: 'us-east',
        owner: 'test@example.com',
        version: '1.0.0'
      };
      
      const result = db.registerNode(node);
      assert.ok(result);
      assert.strictEqual(result.id, 'test-node-1');
    });

    it('should update existing node on re-registration', () => {
      const node = {
        url: 'https://bare1.example.com',
        nodeId: 'test-node-1',
        region: 'us-east',
        version: '1.0.0'
      };
      
      db.registerNode(node);
      node.region = 'eu-west';
      const result = db.registerNode(node);
      
      assert.strictEqual(result.region, 'eu-west');
    });
  });

  describe('getNode', () => {
    it('should retrieve registered node', () => {
      const node = {
        url: 'https://bare1.example.com',
        nodeId: 'test-node-1',
        region: 'us-east',
        version: '1.0.0'
      };
      
      db.registerNode(node);
      const retrieved = db.getNode('test-node-1');
      
      assert.ok(retrieved);
      assert.strictEqual(retrieved.url, node.url);
    });

    it('should return null for non-existent node', () => {
      const result = db.getNode('non-existent');
      assert.strictEqual(result, null);
    });
  });

  describe('getAllNodes', () => {
    it('should return all registered nodes', () => {
      db.registerNode({ url: 'https://bare1.example.com', nodeId: 'node-1', region: 'us-east', version: '1.0.0' });
      db.registerNode({ url: 'https://bare2.example.com', nodeId: 'node-2', region: 'eu-west', version: '1.0.0' });
      
      const nodes = db.getAllNodes();
      assert.strictEqual(nodes.length, 2);
    });

    it('should return empty array when no nodes', () => {
      const nodes = db.getAllNodes();
      assert.ok(Array.isArray(nodes));
      assert.strictEqual(nodes.length, 0);
    });
  });

  describe('getHealthyNodes', () => {
    it('should return only healthy nodes', () => {
      db.registerNode({ url: 'https://bare1.example.com', nodeId: 'node-1', region: 'us-east', version: '1.0.0' });
      db.registerNode({ url: 'https://bare2.example.com', nodeId: 'node-2', region: 'eu-west', version: '1.0.0' });
      
      db.updateNodeStatus('node-1', 'healthy');
      db.updateNodeStatus('node-2', 'unhealthy');
      
      const healthy = db.getHealthyNodes();
      assert.strictEqual(healthy.length, 1);
      assert.strictEqual(healthy[0].id, 'node-1');
    });
  });

  describe('updateNodeStatus', () => {
    it('should update node status', () => {
      db.registerNode({ url: 'https://bare1.example.com', nodeId: 'node-1', region: 'us-east', version: '1.0.0' });
      
      db.updateNodeStatus('node-1', 'healthy');
      const node = db.getNode('node-1');
      
      assert.strictEqual(node.status, 'healthy');
    });
  });

  describe('recordHeartbeat', () => {
    it('should update last heartbeat time', () => {
      db.registerNode({ url: 'https://bare1.example.com', nodeId: 'node-1', region: 'us-east', version: '1.0.0' });
      
      const before = db.getNode('node-1').last_heartbeat;
      db.recordHeartbeat('node-1');
      const after = db.getNode('node-1').last_heartbeat;
      
      assert.ok(after >= before || before === null);
    });
  });

  describe('deleteNode', () => {
    it('should delete a node', () => {
      db.registerNode({ url: 'https://bare1.example.com', nodeId: 'node-1', region: 'us-east', version: '1.0.0' });
      
      db.deleteNode('node-1');
      const node = db.getNode('node-1');
      
      assert.strictEqual(node, null);
    });
  });

  describe('getNodesByRegion', () => {
    it('should filter nodes by region', () => {
      db.registerNode({ url: 'https://bare1.example.com', nodeId: 'node-1', region: 'us-east', version: '1.0.0' });
      db.registerNode({ url: 'https://bare2.example.com', nodeId: 'node-2', region: 'us-east', version: '1.0.0' });
      db.registerNode({ url: 'https://bare3.example.com', nodeId: 'node-3', region: 'eu-west', version: '1.0.0' });
      
      const usEast = db.getNodesByRegion('us-east');
      assert.strictEqual(usEast.length, 2);
    });
  });

  describe('getStats', () => {
    it('should return statistics', () => {
      db.registerNode({ url: 'https://bare1.example.com', nodeId: 'node-1', region: 'us-east', version: '1.0.0' });
      db.updateNodeStatus('node-1', 'healthy');
      
      const stats = db.getStats();
      assert.ok(stats);
      assert.ok(typeof stats.total === 'number');
      assert.ok(typeof stats.healthy === 'number');
    });
  });
});
