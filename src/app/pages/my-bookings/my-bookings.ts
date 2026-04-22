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
    const auth = this.authService.authState();
    console.log('Auth state:', auth);

    if (!auth.loggedIn || !auth.username) {
      this.router.navigate(['/sign-in']);
      return;
    }

    const userBookings = this.bookingService.getBookingsByUser(auth.username);
    console.log('Reservas cargadas:', userBookings);
    console.log('Número de reservas:', userBookings.length);

    this.bookings.set(userBookings);
  }
}
