import { Component } from '@angular/core';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
  standalone: true
})
export class Toast {
  constructor(public toastService: ToastService) {}
}
