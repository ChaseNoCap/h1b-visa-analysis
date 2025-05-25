// Event system package exports
export interface IEventBus {
  emit(event: BaseEvent): void;
}

export interface BaseEvent {
  type: string;
  timestamp: number;
}

export const placeholder = 'event-system';