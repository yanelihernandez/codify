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
import { ChatService } from '../../services/chat.service';
import {ChatUI} from '../../models/chat';

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
  private chatService = inject(ChatService);

  user = signal<User | null>(null);
  isUploading = signal(false);
  showDeleteModal = signal(false);

  authState = this.authService.authState;
  allProfessors = signal<Professor[]>([]);
  chatProfessors = signal<ChatUI[]>([]);

  favoriteProfessors = computed(() => {
    this.favoritesService.favoritesVersion();
    const favIds = this.favoritesService.getFavorites();

    return this.allProfessors().filter((professor) =>
      favIds.includes(String(professor.id))
    );
  });

  async ngOnInit(): Promise<void> {
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
      this.loadChatsFromService();
      },
      error: (error) => {
        console.error('Error cargando profesores:', error);
        this.allProfessors.set([]);
        this.chatProfessors.set([]);
      },
    });
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

  private loadChatsFromService(): void {
    const auth = this.authService.authState();
    const userId = auth.uid;

    if (!auth.loggedIn || !userId) return;

    this.bookingService.getBookingsByUser(userId).subscribe(bookings => {
      const bookedProfessorIds = new Set(bookings.map(b => String(b.professorId).replace('teacher', '')));

      this.chatService.getChats(userId).subscribe(chats => {
        const finalChatsMap = new Map<string, ChatUI>();

        const getDynamicMessage = (teacherId: string, professor: Professor | undefined) => {
          const normalizedId = teacherId.replace('teacher', '');
          const booking = bookings.find(b => String(b.professorId).replace('teacher', '') === normalizedId);

          if (!booking) return 'Reserva confirmada'; // Por si acaso

          const dateObj = new Date(booking.date + 'T00:00:00');
          const formattedDate = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
          const lang = professor?.speciality || 'la materia';

          return `¡Hola! Veo que reservaste una clase para el ${formattedDate} a las ${booking.time}. ¿En qué puedo ayudarte con ${lang}?`;
        };

        chats.forEach(chat => {
          const hasMessage = chat.lastMessage && chat.lastMessage.trim() !== '';
          const teacherId = String(chat.teacherId);
          const normalizedId = teacherId.replace('teacher', '');

          if (hasMessage || bookedProfessorIds.has(normalizedId)) {
            const professor = this.allProfessors().find(
              p => String(p.id).replace('teacher', '') === normalizedId
            );

            finalChatsMap.set(teacherId, {
              id: teacherId,
              name: professor?.name ?? 'Profesor',
              image: professor?.image ?? '',
              lastMessage: hasMessage ? chat.lastMessage : getDynamicMessage(teacherId, professor),
              lastMessageTime: chat.lastMessageDate ? chat.lastMessageDate.toDate?.() ?? null : null
            });
          }
        });

        bookedProfessorIds.forEach(normalizedId => {
          const alreadyAdded = Array.from(finalChatsMap.keys()).some(k => k.replace('teacher', '') === normalizedId);

          if (!alreadyAdded) {
            const professor = this.allProfessors().find(
              p => String(p.id).replace('teacher', '') === normalizedId
            );

            const bookingData = bookings.find(b => String(b.professorId).replace('teacher', '') === normalizedId);
            const originalId = bookingData ? String(bookingData.professorId) : normalizedId;

            finalChatsMap.set(originalId, {
              id: originalId,
              name: professor?.name ?? bookingData?.professorName ?? 'Profesor',
              image: professor?.image ?? bookingData?.professorImage ?? '',
              lastMessage: getDynamicMessage(originalId, professor),
              lastMessageTime: null
            });
          }
        });

        const sortedChats = Array.from(finalChatsMap.values()).sort((a, b) => {
          const dateA = a.lastMessageTime?.getTime() ?? 0;
          const dateB = b.lastMessageTime?.getTime() ?? 0;
          return dateB - dateA;
        });

        this.chatProfessors.set(sortedChats);
      });
    });
  }

  goToChat(professorId: string): void {
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
