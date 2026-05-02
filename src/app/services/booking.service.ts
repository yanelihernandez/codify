import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  query,
  serverTimestamp,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface BookingItem {
  id: string;
  userId: string;
  professorId: string;
  professorName: string;
  professorImage: string;
  fullName: string;
  date: string;
  time: string;
  hours: number;
  isGroup: boolean;
  price: number;
  createdAt?: unknown;
}

export type NewBookingItem = Omit<BookingItem, 'id' | 'createdAt'>;

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private firestore = inject(Firestore);
  private bookingsCollection = collection(this.firestore, 'bookings');

  getBookingsByUser(userId: string): Observable<BookingItem[]> {
    const q = query(this.bookingsCollection, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<BookingItem[]>;
  }

  async createBooking(booking: NewBookingItem): Promise<void> {
    await addDoc(this.bookingsCollection, {
      ...booking,
      createdAt: serverTimestamp(),
    });
  }

  async deleteBooking(bookingId: string): Promise<void> {
    await deleteDoc(doc(this.firestore, `bookings/${bookingId}`));
  }
}
