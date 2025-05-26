import { describe, it, expect, beforeEach } from 'vitest';
import { containerPromise } from '../../src/core/container/container.js';
import { TYPES } from '../../src/core/constants/injection-tokens.js';
import type { IReportGenerator } from '../../src/core/interfaces/IReportGenerator.js';
import type { IDependencyChecker } from '../../src/core/interfaces/IDependencyChecker.js';
import { EventBus, TestEventBus } from '@chasenocap/event-system';

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

    // Look for timing events
    const timingEvents = events.filter(e =>
      e.payload && typeof e.payload === 'object' && 'duration' in e.payload
    );

    expect(timingEvents.length).toBeGreaterThan(0);
    timingEvents.forEach(event => {
      expect((event.payload as any).duration).toBeGreaterThanOrEqual(0);
    });
  });

  it('should include error information in failure events', async () => {
    // Force an error by checking dependencies in an invalid location
    const originalCwd = process.cwd();
    
    try {
      process.chdir('/tmp');
      await dependencyChecker.checkAllDependencies();
    } catch (error) {
      // Expected to fail
    } finally {
      process.chdir(originalCwd);
    }
    
    const events = testEventBus.getEmittedEvents();
    const errorEvents = events.filter(e => 
      e.type.includes('error') || e.type.includes('failed')
    );
    
    expect(errorEvents.length).toBeGreaterThan(0);
  });

  it('should maintain event order and correlation', async () => {
    await reportGenerator.generate({
      outputDir: 'tests/integration/output'
    });
    
    const events = testEventBus.getEmittedEvents();
    
    // Events should be in chronological order
    for (let i = 1; i < events.length; i++) {
      expect(events[i].timestamp).toBeGreaterThanOrEqual(events[i - 1].timestamp);
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