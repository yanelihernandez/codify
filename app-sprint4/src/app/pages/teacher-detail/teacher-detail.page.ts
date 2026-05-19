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
  IonCol,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonImg,
  IonButton,
} from '@ionic/angular/standalone';

import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterLink } from '@angular/router';
import { ProfessorService } from '../../services/professors.service';
import { Professor } from '../../models/professor';
//import { OpinionCard } from '../../components/opinion-card/opinion-card';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';
//import { BookingService } from '../../services/booking.service';
import { FavoritesService } from '../../services/favorites-sqlite';

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
    IonCol,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonImg,
    IonButton,
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
    private router: Router,
    private favoritesService: FavoritesService,
  ) {}

  authState = this.authService.authState;

  isFavorite = computed(() => {
      this.favoritesService.favoritesVersion();
      return (
        this.authState().loggedIn &&
        this.favoritesService.isFavorite(String(this.professor()?.id))
      );
    });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      this.service.getProfessors().subscribe(profs => {
        const p = profs.find(p => p.id.toString() === id);
        this.professor.set(p ?? null);
      });
    });
  }

  async onFavoriteClick(event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    if (!this.authState().loggedIn) {
      this.toastService.show('Debes iniciar sesión para guardar favoritos');
      sessionStorage.setItem('redirectAfterLogin', this.router.url);
      this.router.navigate(['/sign-in']);
      return;
    }

    const liked = await this.favoritesService.toggleFavorite(String(this.professor()?.id));

    this.toastService.show(
      liked ? 'Añadido a favoritos' : 'Eliminado de favoritos'
    );
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
