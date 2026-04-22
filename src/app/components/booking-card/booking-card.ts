import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingItem } from '../../services/booking.service';
import { BookingService } from '../../services/booking.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-card.html',
  styleUrls: ['./booking-card.css']
})
export class BookingCard {
  @Input() booking!: BookingItem;

  showModal = signal<boolean>(false);

  private bookingService = inject(BookingService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  get formattedDate(): string {
    return new Date(this.booking.date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  openModal(): void {
    console.log('Abriendo modal para cancelar reserva');
    this.showModal.set(true);
  }

  closeModal(): void {
    console.log('Cerrando modal');
    this.showModal.set(false);
  }

  closeModalOnBackdrop(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('confirm-modal')) {
      this.closeModal();
    }
  }
  
  confirmCancel(): void {
    console.log('Cancelando reserva:', this.booking.id);

    const auth = this.authService.authState();
    if (auth.username) {
      this.bookingService.deleteBooking(this.booking.id);
      this.toastService.show('Reserva cancelada correctamente');
      this.closeModal();

      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }
}
