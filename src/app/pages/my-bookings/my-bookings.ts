import { Component } from '@angular/core';
import {BookingCard} from '../../components/booking-card/booking-card';

@Component({
  selector: 'app-my-bookings',
  imports: [
    BookingCard
  ],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css',
})
export class MyBookings {

}
