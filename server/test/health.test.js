/**
 * Health Module Tests
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import {
  getHealthReport,
  getHealthStatus,
  isHealthy,
  selfTest
} from '../health.js';

describe('Health Module', () => {
  describe('getHealthStatus', () => {
    it('should return health status object', () => {
      const status = getHealthStatus();
      assert.ok(status);
      assert.ok(typeof status.healthy === 'boolean');
      assert.ok(status.timestamp);
      assert.ok(status.checks);
    });

    it('should include memory check', () => {
      const status = getHealthStatus();
      assert.ok(status.checks.memory);
      assert.ok(typeof status.checks.memory.healthy === 'boolean');
      assert.ok(typeof status.checks.memory.heapUsedMB === 'number');
    });

    it('should include event loop check', () => {
      const status = getHealthStatus();
      assert.ok(status.checks.eventLoop);
      assert.ok(typeof status.checks.eventLoop.healthy === 'boolean');
    });
  });

  describe('isHealthy', () => {
    it('should return boolean', () => {
      const healthy = isHealthy();
      assert.ok(typeof healthy === 'boolean');
    });

    it('should be healthy in normal conditions', () => {
      const healthy = isHealthy();
      assert.strictEqual(healthy, true);
    });
  });

  describe('getHealthReport', () => {
    it('should return detailed health report', () => {
      const report = getHealthReport();
      assert.ok(report);
      assert.ok(report.status);
      assert.ok(report.timestamp);
      assert.ok(report.node);
      assert.ok(report.checks);
    });

    it('should include node info', () => {
      const report = getHealthReport();
      assert.ok(report.node.id);
      assert.ok(report.node.version);
    });
  });

  describe('selfTest', () => {
    it('should perform self test', async () => {
      const result = await selfTest();
      assert.ok(result);
      assert.ok(typeof result.success === 'boolean');
    });
  });
});
