import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home';
import {LanguageTeachers} from './pages/language-teachers/language-teachers';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'language-teachers/:id', component: LanguageTeachers },
];
