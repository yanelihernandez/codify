import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-chat-message',
  imports: [
    NgClass
  ],
  templateUrl: './chat-message.html',
  styleUrl: './chat-message.css',
})
export class ChatMessage {
  @Input() type: 'profesor' | 'alumno' = 'profesor';
  @Input() text: string = '';
  @Input() time: string = '';
  @Input() avatar: string = '';
}
