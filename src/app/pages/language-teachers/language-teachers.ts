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


/*

  languageName = computed(() => {
    const id = this.languageId();

    const map: Record<string, string> = {
      '1': 'Profesores de Python',
      '2': 'Profesores de Java',
      '3': 'Profesores de C',
      '4': 'Profesores de Assembly',
      python: 'Profesores de Python',
      java: 'Profesores de Java',
      c: 'Profesores de C',
      assembly: 'Profesores de Assembly'
    };

    return map[id.toLowerCase()] ?? `Profesores de ${id}`;
  });

  filteredProfessors = computed(() => {
    const id = this.languageId().toLowerCase().trim();

    const keywordMap: Record<string, string> = {
      '1': 'python',
      '2': 'java',
      '3': 'c',
      '4': 'assembly'
    };

    const keyword = keywordMap[id] ?? id;

    return this.professors().filter((professor) => {
      const info = (professor.info || '').toLowerCase();
      const name = (professor.name || '').toLowerCase();

      const professorLanguages = Array.isArray((professor as any).languages)
        ? (professor as any).languages.map((l: string) => l.toLowerCase())
        : [];

      const professorSpecialties = Array.isArray((professor as any).specialties)
        ? (professor as any).specialties.map((s: string) => s.toLowerCase())
        : [];

      const professorLanguage = ((professor as any).language || '').toLowerCase();
      const professorCategory = ((professor as any).category || '').toLowerCase();

      return (
        professorLanguages.includes(keyword) ||
        professorSpecialties.includes(keyword) ||
        professorLanguage === keyword ||
        professorCategory === keyword ||
        info.includes(keyword) ||
        name.includes(keyword)
      );
    });
  });
   */

