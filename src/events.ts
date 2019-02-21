export type EventHandler = (...args: any[]) => void;
export type EventType = string | symbol;

export interface Events {
  on(event: EventType, handler: EventHandler): this;
  once(event: EventType, handler: EventHandler): this;
  off(event: EventType, handler: EventHandler): this;
  emit(event: EventType, ...args: any[]): boolean;
  removeAllListeners(event?: EventType): this;
}

export class SimpleEvents implements Events {
  private handlers: Map<EventType, EventHandler[]> = new Map();

  on(event: string, handler: EventHandler) {
    const list = this.getListeners(event);
    list.push(handler);
    this.handlers.set(event, list);
    return this;
  }

  once(event: string, handler: EventHandler) {
    const cleaner = () => {
      this.off(event, handler);
      this.off(event, cleaner);
    };
    return this.on(event, handler).on(event, cleaner);
  }

  off(event: string, handler: EventHandler) {
    const list = this.getListeners(event);
    const p = list.indexOf(handler);
    if (p >= 0) {
      list.splice(p, 1);
      if (list.length === 0) {
        this.handlers.delete(event);
      } else {
        this.handlers.set(event, list);
      }
    }
    return this;
  }

  emit(event: string, ...args: any[]) {
    const list = this.getListeners(event);
    list.forEach((h) => h(...args));
    return list.length > 0;
  }

  removeAllListeners(event?: EventType) {
    if (event) {
      this.handlers.delete(event);
    } else {
      this.handlers.clear();
    }
    return this;
  }

  private getListeners(event: string) {
    return this.handlers.get(event) || [];
  }
}
