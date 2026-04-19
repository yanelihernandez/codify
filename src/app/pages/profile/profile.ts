import { Component } from '@angular/core';
import {TeacherListComponent} from "../../components/teacher-list/teacher-list";
import {ChatCard} from '../../components/chat-card/chat-card';

@Component({
  selector: 'app-profile',
  standalone: true,
    imports: [
        TeacherListComponent,
        ChatCard
    ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

}
