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
export class TeacherListComponent implements OnInit {
  professors = signal<Professor[]>([]);

  constructor(private service: ProfessorService) {}

  ngOnInit(): void {
    this.getProfessors();
  }

  getProfessors(): void {
    this.service.getProfessors().subscribe(professors => {
      const fixedProfessors = professors.map(professor => {
        const data = professor as any;

        return {
          ...professor,
          stars: Number(data.stars ?? data.rating ?? 0)
        };
      });

      const top3 = fixedProfessors
        .sort((a, b) => b.stars - a.stars)
        .slice(0, 3);

      this.professors.set(top3);
    });
  }
}
