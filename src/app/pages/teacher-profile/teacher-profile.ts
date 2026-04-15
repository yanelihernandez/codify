import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProfessorService} from '../../services/professors.service';
import {Professor} from '../../models/professor';

@Component({
  selector: 'app-teacher-profile',
  imports: [],
  templateUrl: './teacher-profile.html',
  styleUrl: './teacher-profile.css',
})
export class TeacherProfileComponent implements OnInit {

  professor = signal<Professor | null>(null);

  constructor(
    private route: ActivatedRoute,
    private service: ProfessorService
  ) {}


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      this.service.getProfessors().subscribe(profs => {
        const p = profs.find(p => p.id.toString() === id);
        this.professor.set(p ?? null);
      });
    });
  }

}
