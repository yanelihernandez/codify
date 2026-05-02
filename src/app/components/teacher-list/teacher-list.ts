import { Component, OnInit, signal } from '@angular/core';
import { Professor } from '../../models/professor';
import { ProfessorService } from '../../services/professors.service';
import { TeacherCompactCardComponent } from '../teacher-compact-card/teacher-compact-card';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [TeacherCompactCardComponent],
  templateUrl: './teacher-list.html',
  styleUrl: './teacher-list.css',
})
export class TeacherList implements OnInit {
  professors = signal<Professor[]>([]);

  constructor(private service: ProfessorService) {}

  ngOnInit(): void {
    this.service.getProfessors().subscribe((professors) => {
      const bestThree = [...professors]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);

      this.professors.set(bestThree);
    });
  }
}
