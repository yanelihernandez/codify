import { Component, Input } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-teacher-compact-card',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './teacher-compact-card.html',
  styleUrl: './teacher-compact-card.css',
})
export class TeacherCompactCardComponent {
  @Input()
  image_alt: string = 'image';
  @Input()
  image_src: string = './assets/images/';
  @Input()
  name: string = 'Best Professor';
  @Input()
  speciality: string = 'Speciality';
  @Input()
  stars: number = 0;
  @Input()
  id: number = 0;
  constructor() {}
}
