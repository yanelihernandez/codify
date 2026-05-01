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

  async ngOnInit(): Promise<void> {
    const isLogged = await this.authService.isAuthReady();
    const auth = this.authService.authState();

    if (!isLogged || !auth.username) {
      this.router.navigate(['/sign-in']);
      return;
    }

    const userBookings = this.bookingService.getBookingsByUser(auth.username);
    this.bookings.set(userBookings);
  }
}
