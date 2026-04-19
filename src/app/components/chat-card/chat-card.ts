import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-chat-card',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './chat-card.html',
  styleUrl: './chat-card.css',
})
export class ChatCard {

}
