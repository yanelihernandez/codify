import { Component } from '@angular/core';
import {TeacherList} from '../../components/teacher-list/teacher-list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TeacherList
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {}

