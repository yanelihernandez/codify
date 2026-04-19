import { Component } from '@angular/core';
import {TeacherListComponent} from "../../components/teacher-list/teacher-list";
import {ChatCard} from '../../components/chat-card/chat-card';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    TeacherListComponent,
    ChatCard,
    RouterLink
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

}
