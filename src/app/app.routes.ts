import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LanguageTeachers } from './pages/language-teachers/language-teachers';
import { TeacherProfileComponent } from './pages/teacher-profile/teacher-profile';
import { Profile } from './pages/profile/profile';
import { MyBookings } from './pages/my-bookings/my-bookings';
import { Chat } from './pages/chat/chat';
import { Booking } from './pages/booking/booking';
import { SignInComponent } from './pages/sign-in/sign-in';
import { SignUpComponent } from './pages/sign-up/sign-up';
import { EditProfileComponent } from './pages/edit-profile/edit-profile';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Rutas públicas
  { path: '', component: HomeComponent },
  { path: 'language-teachers/:slug', component: LanguageTeachers },
  { path: 'teacher-profile/:id', component: TeacherProfileComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },

  // Rutas protegidas por el Guard
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'my-bookings', component: MyBookings, canActivate: [authGuard] },
  { path: 'chat/:id', component: Chat, canActivate: [authGuard] },
  { path: 'booking/:id', component: Booking, canActivate: [authGuard] },
  { path: 'edit-profile', component: EditProfileComponent, canActivate: [authGuard] },
];
