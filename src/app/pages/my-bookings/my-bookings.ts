import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BookingCard } from '../../components/booking-card/booking-card';
import { BookingItem, BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [RouterLink, BookingCard],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css',
})
export class MyBookings implements OnInit {
  bookings = signal<BookingItem[]>([]);

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      const auth = this.authService.authState();

      if (!auth.loggedIn || !auth.uid) {
        this.router.navigate(['/sign-in']);
        return;
      }

      this.bookingService.getBookingsByUser(auth.uid).subscribe({
        next: (userBookings: BookingItem[]) => {
          this.bookings.set(userBookings);
        },
        error: (error) => {
          console.error('Error cargando reservas:', error);
          this.bookings.set([]);
        },
      });
    }, 300);
  }

  removeBookingFromView(bookingId: string): void {
    this.bookings.update((bookings) =>
      bookings.filter((booking) => booking.id !== bookingId)
    );
  }
}
