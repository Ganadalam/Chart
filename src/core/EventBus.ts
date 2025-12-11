// src/core/EventBus.ts
export type EventCallback<T = any> = (payload?: T) => void;

export class EventBus {
  private listeners: Record<string, EventCallback[]> = {};

  on<T = any>(event: string, cb: EventCallback<T>): void {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(cb as EventCallback);
  }

  off<T = any>(event: string, cb?: EventCallback<T>): void {
    if (!this.listeners[event]) return;
    if (!cb) {
      delete this.listeners[event];
      return;
    }
    this.listeners[event] = this.listeners[event].filter(fn => fn !== cb);
  }

  emit<T = any>(event: string, payload?: T): void {
    const list = this.listeners[event];
    if (!list) return;
    // 복사해서 안전하게 순회
    [...list].forEach(fn => {
      try { fn(payload); } catch (e) { /* ignore individual handler errors */ }
    });
  }
}
