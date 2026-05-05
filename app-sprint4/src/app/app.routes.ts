import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./pages/sign-in/sign-in.page').then( m => m.SignInPage)
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./pages/sign-up/sign-up.page').then( m => m.SignUpPage)
  },
  {
    path: 'teacher-list',
    loadComponent: () => import('./pages/teacher-list/teacher-list.page').then( m => m.TeacherListPage),
    canActivate: [authGuard]
  },
  {
    path: 'teacher-detail',
    loadComponent: () => import('./pages/teacher-detail/teacher-detail.page').then( m => m.TeacherDetailPage),
    canActivate: [authGuard]
  },
];
