import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ChatCard } from '../../components/chat-card/chat-card';
import { Router, RouterLink } from '@angular/router';
import { AuthService, User} from '../../services/auth';
import { FavoritesService } from '../../services/favorites.service';
import { ProfessorService } from '../../services/professors.service';
import { Professor } from '../../models/professor';
import { TeacherCompactCardComponent } from '../../components/teacher-compact-card/teacher-compact-card';
import { BookingService } from '../../services/booking.service';
import { HttpClient } from '@angular/common/http';
import { Firestore, doc, updateDoc, deleteField } from '@angular/fire/firestore';
import { lastValueFrom } from 'rxjs';

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
  private http = inject(HttpClient);
  private firestore = inject(Firestore);

  user = signal<User | null>(null);
  isUploading = signal<boolean>(false);
  showDeleteModal = signal<boolean>(false);

  authState = this.authService.authState;
  allProfessors = signal<Professor[]>([]);
  chatProfessors = signal<ChatProfessor[]>([]);

  favoriteProfessors = computed(() => {
    this.favoritesService.favoritesVersion();
    const favIds = this.favoritesService.getFavorites();
    return this.allProfessors().filter(p => favIds.includes(Number(p.id)));
  });

  openDeleteModal() {
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
  }

  async ngOnInit(): Promise<void> {
    const isLogged = await this.authService.isAuthReady();

    if (!isLogged) {
      sessionStorage.setItem('redirectAfterLogin', '/profile');
      this.router.navigate(['/sign-in']);
      return;
    }

    this.authService.getCurrentUser().then(u => this.user.set(u));

    this.professorService.getProfessors().subscribe(profs => {
      this.allProfessors.set(profs);
      this.loadChatProfessors(profs);
    });
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const authUser = await this.authService.getAuthUser();

    if (!authUser || !authUser.uid) {
      alert('Error: No se ha podido verificar tu sesión.');
      return;
    }

    this.isUploading.set(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'codify_preset');

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dcqaw1j7r/image/upload`;

      // Lo subimos a Cloudinary
      const response: any = await lastValueFrom(this.http.post(cloudinaryUrl, formData));
      const imageUrl = response.secure_url;

      const userDocRef = doc(this.firestore, `users/${authUser.uid}`);
      await updateDoc(userDocRef, { profileImageUrl: imageUrl });

      const currentUser = this.user();
      if (currentUser) {
        this.user.set({ ...currentUser, profileImageUrl: imageUrl });
      }

    } catch (error) {
      console.error('Error al subir la imagen:', error);
      alert('Hubo un error al actualizar la foto de perfil.');
    } finally {
      this.isUploading.set(false);
    }
  }

  async confirmDeleteProfileImage() {
    this.closeDeleteModal();

    const authUser = await this.authService.getAuthUser();

    if (!authUser || !authUser.uid) {
      alert('Error: No se ha podido verificar tu sesión.');
      return;
    }

    this.isUploading.set(true);

    try {
      const userDocRef = doc(this.firestore, `users/${authUser.uid}`);
      await updateDoc(userDocRef, { profileImageUrl: deleteField() });

      const currentUser = this.user();
      if (currentUser) {
        const updatedUser = { ...currentUser };
        delete updatedUser.profileImageUrl;
        this.user.set(updatedUser);
      }

    } catch (error) {
      console.error('Error al borrar la imagen:', error);
      alert('Hubo un error al borrar la foto de perfil.');
    } finally {
      this.isUploading.set(false);
    }
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

  scrollTo(id: string): void {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

}
