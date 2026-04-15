import {Component, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Language } from '../../models/language';
import {LanguagesService} from '../../services/languages.service';
import {Professor} from '../../models/professor';
import {ProfessorService} from '../../services/professors.service';
import {TeacherDetailCard} from '../../components/teacher-detail-card/teacher-detail-card';


@Component({
  standalone: true,
  selector: 'app-language-teachers',
  imports: [CommonModule, TeacherDetailCard],
  templateUrl: './language-teachers.html',
  styleUrl: './language-teachers.css',
})
export class LanguageTeachers implements OnInit {
  professors = signal<Professor[]>([]);
  language = signal<Language | null>(null);

  constructor(
    private route: ActivatedRoute,
    private languageService: LanguagesService,
    private professorService: ProfessorService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      this.languageService.getLanguages().subscribe(languages => {
        const lang = languages.find(l => l.id.toString() === id);
        this.language.set(lang ?? null);

        if (lang) {
          this.professorService.getProfessors().subscribe(profs => {
            this.professors.set(
              profs.filter(p => p.speciality === lang.name)
            );
          });
        }
      });
    });
  }

}
