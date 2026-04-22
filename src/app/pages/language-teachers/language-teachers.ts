import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TeacherDetailCard } from '../../components/teacher-detail-card/teacher-detail-card';
import { ProfessorService } from '../../services/professors.service';
import { Professor } from '../../models/professor';

@Component({
  selector: 'app-language-teachers',
  standalone: true,
  imports: [CommonModule, TeacherDetailCard],
  templateUrl: './language-teachers.html',
  styleUrl: './language-teachers.css',
})
export class LanguageTeachers implements OnInit {
  professors = signal<Professor[]>([]);
  languageId = signal<string>('');

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

  constructor(
    private route: ActivatedRoute,
    private professorService: ProfessorService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') ?? '';
      this.languageId.set(id);

      this.professorService.getProfessors().subscribe((data) => {
        this.professors.set(data);
      });
    });
  }
}
