import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ChatCard } from '../../components/chat-card/chat-card';
import { Router, RouterLink } from '@angular/router';
import { AuthService, User } from '../../services/auth';
import { FavoritesService } from '../../services/favorites.service';
import { ProfessorService } from '../../services/professors.service';
import { Professor } from '../../models/professor';
import { TeacherCompactCardComponent } from '../../components/teacher-compact-card/teacher-compact-card';
import { BookingItem, BookingService } from '../../services/booking.service';
import { HttpClient } from '@angular/common/http';
import { Firestore, deleteField, doc, updateDoc } from '@angular/fire/firestore';
import { lastValueFrom } from 'rxjs';

interface ChatProfessor {
  id: string;
  name: string;
  image: string;
  lastMessage: string;
  lastMessageTime: string;
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
  isUploading = signal(false);
  showDeleteModal = signal(false);

  authState = this.authService.authState;
  allProfessors = signal<Professor[]>([]);
  chatProfessors = signal<ChatProfessor[]>([]);

  favoriteProfessors = computed(() => {
    this.favoritesService.favoritesVersion();
    const favIds = this.favoritesService.getFavorites();

    return this.allProfessors().filter((professor) =>
      favIds.includes(String(professor.id))
    );
  });

  async ngOnInit(): Promise<void> {
    const isLogged = await this.authService.isAuthReady();

    if (!isLogged) {
      sessionStorage.setItem('redirectAfterLogin', '/profile');
      this.router.navigate(['/sign-in']);
      return;
    }

    this.favoritesService.loadFavoritesForCurrentUser();

    const currentUser = await this.authService.getCurrentUser();
    this.user.set(currentUser);

    this.professorService.getProfessors().subscribe({
      next: (professors) => {
        const fixedProfessors: Professor[] = professors.map((professor) => ({
          ...professor,
          id: String(professor.id),
          rating: Number(professor.rating ?? 0),
        }));

        this.allProfessors.set(fixedProfessors);
        this.loadChatProfessors(fixedProfessors);
      },
      error: (error) => {
        console.error('Error cargando profesores:', error);
        this.allProfessors.set([]);
        this.chatProfessors.set([]);
      },
    });
  }

  get profileImage(): string {
    const data = this.user() as any;
    return data?.profileImageUrl || data?.profileImage || 'images/perfil.jpg';
  }

  openDeleteModal(): void {
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const authUser = await this.authService.getAuthUser();

    if (!authUser?.uid) {
      alert('Error: No se ha podido verificar tu sesión.');
      return;
    }

    this.isUploading.set(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'codify_preset');

      const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dcqaw1j7r/image/upload';

      const response: any = await lastValueFrom(
        this.http.post(cloudinaryUrl, formData)
      );

      const imageUrl = response.secure_url;

      const userDocRef = doc(this.firestore, `users/${authUser.uid}`);
      await updateDoc(userDocRef, { profileImageUrl: imageUrl });

      const currentUser = this.user();

      if (currentUser) {
        this.user.set({
          ...currentUser,
          profileImageUrl: imageUrl,
        } as User);
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      alert('Hubo un error al actualizar la foto de perfil.');
    } finally {
      this.isUploading.set(false);
    }
  }

  async confirmDeleteProfileImage(): Promise<void> {
    this.closeDeleteModal();

    const authUser = await this.authService.getAuthUser();

    if (!authUser?.uid) {
      alert('Error: No se ha podido verificar tu sesión.');
      return;
    }

    this.isUploading.set(true);

    try {
      const userDocRef = doc(this.firestore, `users/${authUser.uid}`);
      await updateDoc(userDocRef, { profileImageUrl: deleteField() });

      const currentUser = this.user();

      if (currentUser) {
        const updatedUser = { ...(currentUser as any) };
        delete updatedUser.profileImageUrl;
        this.user.set(updatedUser as User);
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

    if (!auth.loggedIn || !auth.uid) {
      this.chatProfessors.set([]);
      return;
    }

    this.bookingService.getBookingsByUser(auth.uid).subscribe({
      next: (userBookings: BookingItem[]) => {
        const professorIds = [
          ...new Set(userBookings.map((booking) => String(booking.professorId))),
        ];

        const chats: ChatProfessor[] = professorIds
          .map((profId): ChatProfessor | null => {
            const professor = professors.find(
              (p) => String(p.id) === String(profId)
            );

            if (!professor) return null;

            const lastBooking = userBookings
              .filter((booking) => String(booking.professorId) === String(profId))
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )[0];

            return {
              id: String(professor.id),
              name: professor.name,
              image: professor.image,
              lastMessage: `Reserva confirmada para el ${lastBooking?.date || 'N/A'} a las ${lastBooking?.time || ''}`,
              lastMessageTime: lastBooking?.date || '',
            };
          })
          .filter((chat): chat is ChatProfessor => chat !== null);

        this.chatProfessors.set(chats);
      },
      error: (error) => {
        console.error('Error cargando chats desde reservas:', error);
        this.chatProfessors.set([]);
      },
    });
  }

  goToChat(professorId: string | number): void {
    this.router.navigate(['/chat', professorId], {
      state: { from: this.router.url },
    });
  }

  goToTeachers(): void {
    this.router.navigate(['/']);
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
