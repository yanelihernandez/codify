import { Component } from '@angular/core';
import { BookingCard } from '../../components/booking-card/booking-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-bookings',
  imports: [BookingCard, RouterLink],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css',
})
export class MyBookings {

}
