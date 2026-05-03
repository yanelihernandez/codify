import { Component, inject } from '@angular/core';
import { TeacherList } from '../../components/teacher-list/teacher-list';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TeacherList],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {

  private authService = inject(AuthService);

  authState = this.authService.authState;

}
