import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  id: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {

  toasts = signal<Toast[]>([]);

  show(message: string, duration = 2500): void {
    const id = Date.now();
    this.toasts.update(t => [...t, { message, id }]);

    setTimeout(() => {
      this.toasts.update(t => t.filter(toast => toast.id !== id));
    }, duration);
  }
}
