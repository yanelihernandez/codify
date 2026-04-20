import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home';
import {LanguageTeachers} from './pages/language-teachers/language-teachers';
import {TeacherProfileComponent} from './pages/teacher-profile/teacher-profile';
import {Profile} from './pages/profile/profile';
import {MyBookings} from './pages/my-bookings/my-bookings';
import {Chat} from './pages/chat/chat';
import {Booking} from './pages/booking/booking';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'language-teachers/:id', component: LanguageTeachers },
  { path: 'teacher-profile/:id', component: TeacherProfileComponent },
  { path: 'profile', component: Profile },
  { path: 'my-bookings', component: MyBookings },
  { path: 'chat', component: Chat },
  { path: 'booking/:id', component: Booking },
];
