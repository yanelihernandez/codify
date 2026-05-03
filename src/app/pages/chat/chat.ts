import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ProfessorService} from '../../services/professors.service';
import {Professor} from '../../models/professor';
import {AuthService, AuthState} from '../../services/auth';
import {ToastService} from '../../services/toast.service';
import {ChatService} from '../../services/chat.service';
import {Message} from '../../models/chat';
import {FieldValue, serverTimestamp, Timestamp} from 'firebase/firestore';
import { BookingService } from '../../services/booking.service';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'professor';
  time: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit {
  professor = signal<Professor | null>(null);
  messages = signal<Message[]>([]);
  newMessage = '';
  private professorId: string | null = null;

  private chatId: string | null = null;
  protected auth: AuthState;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private professorService: ProfessorService,
    private authService: AuthService,
    private toastService: ToastService,
    private chatService: ChatService,
    private bookingService: BookingService
  ) {
    this.auth = this.authService.authState();
  }

  ngOnInit(): void {
    const profId = this.route.snapshot.paramMap.get('id');

    if (!profId) {
      this.toastService.show('Profesor no válido');
      this.router.navigate(['/']);
      return;
    }

    this.professorId = profId;

    this.professorService.getProfessors().subscribe(profs => {
      const prof = profs.find(p => p.id.toString() === profId);
      this.professor.set(prof ?? null);
    });

    this.initChat();
  }

  private async initChat(): Promise<void> {
    const auth = this.authService.authState();
    const userId = auth.uid!;
    const teacherId = this.professorId!;

    // Recuperar o crear chat
    this.chatId = await this.chatService.getOrCreateChat(userId, teacherId);

    // Listener: mensajes en tiempo real
    this.chatService.getMessages(this.chatId).subscribe(msgs => {

      // Consultamos las reservas para crear el mensaje inicial de bienvenida
      this.bookingService.getBookingsByUser(userId).subscribe(bookings => {
        const normalizedTeacherId = teacherId.replace('teacher', '');
        const booking = bookings.find(b => String(b.professorId).replace('teacher', '') === normalizedTeacherId);

        if (booking) {
          const dateObj = new Date(booking.date + 'T00:00:00');
          const formattedDate = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
          const prof = this.professor();
          const lang = prof?.speciality || 'la materia';

          const welcomeMsg: Message = {
            id: 'fake-welcome-msg',
            senderId: teacherId,
            text: `¡Hola! Veo que reservaste una clase para el ${formattedDate} a las ${booking.time}. ¿En qué puedo ayudarte con ${lang}?`,
            createdAt: Timestamp.fromDate(new Date(booking.date + 'T' + booking.time))
          };

          this.messages.set([welcomeMsg, ...msgs]);
        } else {
          this.messages.set(msgs);
        }
      });

    });
  }

  async sendMessage(): Promise<void> {
    const text = this.newMessage.trim();
    if (!text || !this.chatId) return;

    const auth = this.authService.authState();

    const message: Message = {
      senderId: auth.uid!,
      text: text,
      createdAt: serverTimestamp()
    };

    this.chatService.sendMessage(this.chatId, message);

    this.newMessage = '';

    setTimeout(() => {
      if (!this.chatId || !this.professorId) return;

      const autoReply: Message = {
        senderId: this.professorId,
        text: "Gracias por tu mensaje. Te responderé lo antes posible.",
        createdAt: serverTimestamp()
      };

      this.chatService.sendMessage(this.chatId, autoReply);
    }, 1500);
  }


  goBack(): void {
    const from = history.state?.from;
    if (from) {
      this.router.navigateByUrl(from);
      return;
    }

    this.location.back();
  }

  protected toDate(time: Timestamp | FieldValue) {
    if (time instanceof Timestamp) {
      const date = time.toDate();
      return date.toLocaleString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
    return time;
  }
}
