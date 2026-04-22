import { Injectable, signal } from '@angular/core';

export interface ToastItem {
  id: number;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  toasts = signal<ToastItem[]>([]);

  show(message: string, duration = 2200): void {
    const id = this.nextId++;
    this.toasts.update(items => [...items, { id, message }]);
    window.setTimeout(() => this.dismiss(id), duration);
  }

  dismiss(id: number): void {
    this.toasts.update(items => items.filter(t => t.id !== id));
  }
}
