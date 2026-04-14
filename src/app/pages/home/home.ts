import { Component } from '@angular/core';
import {TeacherListComponent} from '../../components/teacher-list/teacher-list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TeacherListComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {}

