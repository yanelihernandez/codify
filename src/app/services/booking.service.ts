import { Injectable } from '@angular/core';

export interface BookingItem {
  id: string;
  userId: string;
  professorId: number;
  professorName: string;
  professorImage: string;
  fullName: string;
  date: string;
  time: string;
  hours: number;
  isGroup: boolean;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly STORAGE_KEY = 'codify_bookings';

  private readAll(): BookingItem[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveAll(bookings: BookingItem[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookings));
  }

  getAllBookings(): BookingItem[] {
    return this.readAll();
  }

  createBooking(booking: Omit<BookingItem, 'id'>): BookingItem {
    const newBooking: BookingItem = {
      ...booking,
      id: crypto.randomUUID()
    };

    const all = this.readAll();
    all.push(newBooking);
    this.saveAll(all);

    return newBooking;
  }

  getBookingsByUser(userId: string): BookingItem[] {
    return this.readAll().filter(b => b.userId === userId);
  }

  hasBookingWithProfessor(userId: string, professorId: number): boolean {
    return this.readAll().some(
      b => b.userId === userId && Number(b.professorId) === Number(professorId)
    );
  }

  deleteBooking(bookingId: string): void {
    const allBookings = this.readAll();
    const updated = allBookings.filter(b => b.id !== bookingId);
    this.saveAll(updated);
    console.log('Reserva eliminada:', bookingId);
  }
}
