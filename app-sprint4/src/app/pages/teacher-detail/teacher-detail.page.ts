import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonImg,
  IonButton,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';

import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterLink } from '@angular/router';
import { ProfessorService } from '../../services/professors.service';
import { Professor } from '../../models/professor';
//import { OpinionCard } from '../../components/opinion-card/opinion-card';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';
//import { BookingService } from '../../services/booking.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonImg,
    IonButton,
    IonFab,
    IonFabButton,
  ],
  templateUrl: './teacher-detail.page.html',
  styleUrls: ['./teacher-detail.page.scss']
})
export class TeacherDetailPage implements OnInit {
  professor = signal<Professor | null>(null);
  isGuest = computed(() => !this.authService.authState().loggedIn);

  constructor(
    private route: ActivatedRoute,
    private service: ProfessorService,
    private authService: AuthService,
    private toastService: ToastService,
    //private bookingService: BookingService,
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

/*
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
*/

}
