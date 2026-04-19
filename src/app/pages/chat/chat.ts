import { Component } from '@angular/core';
import {ChatMessage} from '../../components/chat-message/chat-message';

@Component({
  selector: 'app-chat',
  imports: [
    ChatMessage
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {

}
