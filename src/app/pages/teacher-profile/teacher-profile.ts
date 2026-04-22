import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProfessorService } from '../../services/professors.service';
import { Professor } from '../../models/professor';
import { OpinionCard } from '../../components/opinion-card/opinion-card';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-teacher-profile',
  imports: [OpinionCard, RouterLink],
  templateUrl: './teacher-profile.html',
  styleUrl: './teacher-profile.css',
})
export class TeacherProfileComponent implements OnInit {
  professor = signal<Professor | null>(null);
  isGuest = computed(() => !this.authService.authState().loggedIn);

  constructor(
    private route: ActivatedRoute,
    private service: ProfessorService,
    private authService: AuthService,
    private toastService: ToastService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      this.service.getProfessors().subscribe(profs => {
        const p = profs.find(p => p.id.toString() === id);
        this.professor.set(p ?? null);
      });
    });
  }

  goToChat(event: Event): void {
    const prof = this.professor();
    if (!prof) return;

    if (this.isGuest()) {
      event.preventDefault();
      event.stopPropagation();
      this.toastService.show('Debes iniciar sesión para chatear con el profesor');
      sessionStorage.setItem('redirectAfterLogin', this.router.url);
      this.router.navigate(['/sign-in']);
      return;
    }

    this.router.navigate(['/chat', prof.id], {
      state: { from: this.router.url }
    });
  }

  goToBooking(event: Event): void {
    const prof = this.professor();
    if (!prof) return;

    if (this.isGuest()) {
      event.preventDefault();
      event.stopPropagation();
      this.toastService.show('Debes iniciar sesión para reservar una clase');
      sessionStorage.setItem('redirectAfterLogin', `/booking/${prof.id}`);
      this.router.navigate(['/sign-in']);
      return;
    }

    this.router.navigate(['/booking', prof.id]);
  }
}
