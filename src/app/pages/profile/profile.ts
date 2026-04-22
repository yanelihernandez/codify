import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ChatCard } from '../../components/chat-card/chat-card';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FavoritesService } from '../../services/favorites.service';
import { ProfessorService } from '../../services/professors.service';
import { Professor } from '../../models/professor';
import { TeacherCompactCardComponent } from '../../components/teacher-compact-card/teacher-compact-card';
import { BookingService } from '../../services/booking.service';

interface ChatProfessor {
  id: number;
  name: string;
  image: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ChatCard, RouterLink, TeacherCompactCardComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private favoritesService = inject(FavoritesService);
  private professorService = inject(ProfessorService);
  private bookingService = inject(BookingService);
  private router = inject(Router);

  authState = this.authService.authState;
  allProfessors = signal<Professor[]>([]);
  chatProfessors = signal<ChatProfessor[]>([]);

  favoriteProfessors = computed(() => {
    this.favoritesService.favoritesVersion();
    const favIds = this.favoritesService.getFavorites();
    return this.allProfessors().filter(p => favIds.includes(Number(p.id)));
  });

  ngOnInit(): void {
    if (!this.authState().loggedIn) {
      sessionStorage.setItem('redirectAfterLogin', '/profile');
      this.router.navigate(['/sign-in']);
      return;
    }

    this.professorService.getProfessors().subscribe(profs => {
      this.allProfessors.set(profs);
      this.loadChatProfessors(profs);
    });
  }

  private loadChatProfessors(professors: Professor[]): void {
    const auth = this.authService.authState();
    if (!auth.loggedIn || !auth.username) return;

    const userBookings = this.bookingService.getBookingsByUser(auth.username);
    const professorIds = [...new Set(userBookings.map(b => b.professorId))];

    const chats = professorIds.map(profId => {
      const professor = professors.find(p => p.id === profId);
      if (!professor) return null;

      const lastBooking = userBookings
        .filter(b => b.professorId === profId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

      return {
        id: professor.id,
        name: professor.name,
        image: professor.image,
        lastMessage: `Última reserva: ${lastBooking?.date || 'N/A'}`,
        lastMessageTime: lastBooking?.date || ''
      };
    }).filter(chat => chat !== null) as ChatProfessor[];

    this.chatProfessors.set(chats);
  }

  goToChat(professorId: number): void {
    this.router.navigate(['/chat', professorId], {
      state: { from: this.router.url }
    });
  }

  goToTeachers(): void {
    this.router.navigate(['/']);
  }
}
