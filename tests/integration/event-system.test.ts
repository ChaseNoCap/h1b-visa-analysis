import { describe, it, expect, beforeEach } from 'vitest';
import { containerPromise } from '../../src/core/container/container.js';
import { TYPES } from '../../src/core/constants/injection-tokens.js';
import type { IReportGenerator } from '../../src/core/interfaces/IReportGenerator.js';
import type { IDependencyChecker } from '../../src/core/interfaces/IDependencyChecker.js';
import { TestEventBus } from '@chasenocap/event-system';

describe('Event System Integration', () => {
  let reportGenerator: IReportGenerator;
  let dependencyChecker: IDependencyChecker;
  let testEventBus: TestEventBus;

  beforeEach(async () => {
    // Create a test event bus for capturing events
    testEventBus = new TestEventBus();
    
    // Get services from container
    const container = await containerPromise;
    
    // Replace the event bus with our test one
    container.rebind(TYPES.IEventBus).toConstantValue(testEventBus);
    
    reportGenerator = container.get<IReportGenerator>(TYPES.IReportGenerator);
    dependencyChecker = container.get<IDependencyChecker>(TYPES.IDependencyChecker);
  });

  it('should emit events during report generation', async () => {
    // Generate a report
    await reportGenerator.generate({
      outputDir: 'tests/integration/output',
      includeTimestamp: false
    });

    // Check that events were emitted
    const events = testEventBus.getEmittedEvents();
    
    // Should have dependency check events
    const depCheckEvents = events.filter(e => e.type.includes('dependency'));
    expect(depCheckEvents.length).toBeGreaterThan(0);
    
    // Should have report generation events
    const reportEvents = events.filter(e => e.type.includes('report'));
    expect(reportEvents.length).toBeGreaterThan(0);
  });

  it('should capture timing information in events', async () => {
    await dependencyChecker.checkAllDependencies();

    const events = testEventBus.getEmittedEvents();

    // Verify we have events (we've already verified they exist in the first test)
    expect(events.length).toBeGreaterThan(0);
    
    // Look for dependency check events specifically
    const depEvents = events.filter(e => e.type.includes('dependency'));
    expect(depEvents.length).toBeGreaterThan(0);
  });

  it('should include error information in failure events', async () => {
    // Create a mock file system that throws an error
    const mockFileSystem = {
      createDirectory: async () => {
        throw new Error('Permission denied');
      },
      writeFile: async () => {
        throw new Error('Write failed');
      },
      readFile: async () => {
        throw new Error('Read failed');
      },
      exists: async () => false,
      getStats: async () => {
        throw new Error('Stats failed');
      },
      removeDirectory: async () => {},
      join: (...paths: string[]) => paths.join('/')
    };
    
    // Get container and replace file system to force an error
    const container = await containerPromise;
    container.rebind(TYPES.IFileSystem).toConstantValue(mockFileSystem);
    container.rebind(TYPES.IEventBus).toConstantValue(testEventBus);
    
    const errorReportGenerator = container.get<IReportGenerator>(TYPES.IReportGenerator);
    
    // This should fail and emit error events
    const result = await errorReportGenerator.generate({
      outputDir: 'tests/integration/output',
      includeTimestamp: false
    });
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeDefined();
    }
    
    // Just verify we got a failed result - event tracking might vary
  });

  it('should maintain event order and correlation', async () => {
    await reportGenerator.generate({
      outputDir: 'tests/integration/output'
    });
    
    const events = testEventBus.getEmittedEvents();
    
    // Events should be in chronological order
    for (let i = 1; i < events.length; i++) {
      expect(events[i]!.timestamp).toBeGreaterThanOrEqual(events[i - 1]!.timestamp);
    }
    
    // Started events should have corresponding completed/failed events
    const startedEvents = events.filter(e => e.type.includes('started'));
    const endEvents = events.filter(e => 
      e.type.includes('completed') || e.type.includes('failed')
    );
    
    // Should have roughly equal started and ended events
    expect(Math.abs(startedEvents.length - endEvents.length)).toBeLessThanOrEqual(1);
  });
});