export type Handler = (payload?: any) => void;

export class EventBus {
  private handlers: Record<string, Handler[]> = {};

  on(event: string, h: Handler) {
    (this.handlers[event] ||= []).push(h);
    return () => this.off(event, h);
  }

  off(event: string, h?: Handler) {
    if (!this.handlers[event]) return;
    if (!h) { delete this.handlers[event]; return; }
    this.handlers[event] = this.handlers[event].filter(x => x !== h);
  }

  emit(event: string, payload?: any) {
    (this.handlers[event] || []).slice().forEach(h => h(payload));
  }
}
// // src/core/EventBus.ts
// export type EventCallback<T = any> = (payload?: T) => void;
// export class EventBus {
//   private listeners: Record<string, EventCallback[]> = {};
//   on(event: string, cb: EventCallback) {
//     if (!this.listeners[event]) this.listeners[event] = [];
//     this.listeners[event].push(cb);
//   }
//   emit(event: string, payload?: any) {
//     (this.listeners[event] || []).forEach(fn => { try { fn(payload); } catch { } });
//   }
// }
// // // src/core/EventBus.ts
// // export type EventCallback<T = any> = (payload?: T) => void;

// // export class EventBus {
// //   private listeners: Record<string, EventCallback[]> = {};

// //   on<T = any>(event: string, cb: EventCallback<T>): void {
// //     if (!this.listeners[event]) this.listeners[event] = [];
// //     this.listeners[event].push(cb as EventCallback);
// //   }

// //   off<T = any>(event: string, cb?: EventCallback<T>): void {
// //     if (!this.listeners[event]) return;
// //     if (!cb) {
// //       delete this.listeners[event];
// //       return;
// //     }
// //     this.listeners[event] = this.listeners[event].filter(fn => fn !== cb);
// //   }

// //   emit<T = any>(event: string, payload?: T): void {
// //     const list = this.listeners[event];
// //     if (!list) return;
// //     // 복사해서 안전하게 순회
// //     [...list].forEach(fn => {
// //       try { fn(payload); } catch (e) { /* ignore individual handler errors */ }
// //     });
// //   }
// // }
