import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat-card',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="chat-card">
      <img [src]="professorImage" [alt]="professorName" class="chat-card-avatar">
      <div class="chat-card-info">
        <h3 class="chat-card-name">{{ professorName }}</h3>
        <p class="chat-card-last-message">{{ lastMessage }}</p>
      </div>
      <span class="chat-card-time">{{ lastMessageTime | date:'shortDate' }}</span>
    </div>
  `,
  styleUrls: ['./chat-card.css']
})
export class ChatCard {
  @Input() professorName: string = '';
  @Input() professorImage: string = '';
  @Input() lastMessage: string = '';
  @Input() lastMessageTime: string = '';
}
