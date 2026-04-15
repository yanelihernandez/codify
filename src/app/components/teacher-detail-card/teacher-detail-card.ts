import {Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './teacher-detail-card.html',
  styleUrl: './teacher-detail-card.css',
})
export class TeacherDetailCard {
  @Input()
  image_alt: string = 'image';
  @Input()
  image_src: string = './assets/images/';
  @Input()
  name: string = 'Professor card';
  @Input()
  info: string = 'Info';
  @Input()
  id: number = 0;
  constructor() {}
}
