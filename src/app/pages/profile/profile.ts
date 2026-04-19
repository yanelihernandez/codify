import { Component } from '@angular/core';
import {TeacherListComponent} from "../../components/teacher-list/teacher-list";

@Component({
  selector: 'app-profile',
    imports: [
        TeacherListComponent
    ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

}
