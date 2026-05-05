import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
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
    loadComponent: () => import('./pages/teacher-list/teacher-list.page').then( m => m.TeacherListPage)
  },
  {
    path: 'teacher-detail',
    loadComponent: () => import('./pages/teacher-detail/teacher-detail.page').then( m => m.TeacherDetailPage)
  },
];
