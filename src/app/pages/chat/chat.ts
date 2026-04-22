import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfessorService } from '../../services/professors.service';
import { Professor } from '../../models/professor';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';

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
  messages = signal<ChatMessage[]>([]);
  newMessage = '';
  private professorId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private professorService: ProfessorService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const auth = this.authService.authState();
    const profId = this.route.snapshot.paramMap.get('id');

    if (!auth.loggedIn || !auth.username) {
      this.toastService.show('Inicia sesión para poder enviar mensajes');
      this.router.navigate(['/sign-in']);
      return;
    }

    if (!profId) {
      this.toastService.show('Profesor no válido');
      this.router.navigate(['/']);
      return;
    }

    this.professorId = Number(profId);

    this.professorService.getProfessors().subscribe(profs => {
      const prof = profs.find(p => p.id.toString() === profId);
      this.professor.set(prof ?? null);
    });

    this.loadMessages();
  }

  private storageKey(): string {
    const auth = this.authService.authState();
    return `chat_${auth.username}_${this.professorId}`;
  }

  private loadMessages(): void {
    const raw = localStorage.getItem(this.storageKey());

    if (raw) {
      this.messages.set(JSON.parse(raw));
      return;
    }

    const initialMessages: ChatMessage[] = [
      {
        id: crypto.randomUUID(),
        text: 'Hola, gracias por tu interés. ¿En qué puedo ayudarte?',
        sender: 'professor',
        time: this.currentTime()
      }
    ];

    this.messages.set(initialMessages);
    localStorage.setItem(this.storageKey(), JSON.stringify(initialMessages));
  }

  private saveMessages(): void {
    localStorage.setItem(this.storageKey(), JSON.stringify(this.messages()));
  }

  private currentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  sendMessage(): void {
    const text = this.newMessage.trim();
    if (!text) return;

    const updated = [
      ...this.messages(),
      {
        id: crypto.randomUUID(),
        text,
        sender: 'user' as const,
        time: this.currentTime()
      }
    ];

    this.messages.set(updated);
    this.saveMessages();
    this.newMessage = '';
  }

  goBack(): void {
    const from = history.state?.from;
    if (from) {
      this.router.navigateByUrl(from);
      return;
    }

    this.location.back();
  }
}
