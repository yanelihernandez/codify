import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TeacherDetailCard } from '../../components/teacher-detail-card/teacher-detail-card';
import { ProfessorService } from '../../services/professors.service';
import { Professor } from '../../models/professor';
import {LanguagesService} from '../../services/languages.service';
import {Language} from '../../models/language';

@Component({
  selector: 'app-language-teachers',
  standalone: true,
  imports: [CommonModule, TeacherDetailCard],
  templateUrl: './language-teachers.html',
  styleUrl: './language-teachers.css',
})
export class LanguageTeachers implements OnInit {
  professors = signal<Professor[]>([]);
  language = signal<Language | null>(null);

  filteredProfessors = computed(() => {
    const lang = this.language();

    if (!lang) return [];

    return this.professors().filter(
      (professor) =>
        (professor.speciality || '').toLowerCase() === lang.name.toLowerCase()
    );
  });

  constructor(
    private route: ActivatedRoute,
    private professorService: ProfessorService,
    private languageService: LanguagesService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug') ?? '';

      this.languageService.getLanguageBySlug(slug).subscribe((lang) => {
        this.language.set(lang);
      });

      this.professorService.getProfessors().subscribe((data) => {
        this.professors.set(data);
      });
    });
  }
}
