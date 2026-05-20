import {Component, computed, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonList
} from '@ionic/angular/standalone';
import {Professor} from "../../models/professor";
import {Language} from "../../models/language";
import {ActivatedRoute, Router} from "@angular/router";
import {ProfessorService} from "../../services/professors.service";
import {TeacherDetailCard} from "../../components/teacher-detail-card/teacher-detail-card.component";
import {LanguagesService} from "../../services/language.service";
import {HeaderComponent} from "../../components/header/header.component";
import {FooterComponent} from "../../components/footer/footer.component";

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.page.html',
  styleUrls: ['./teacher-list.page.scss'],
  standalone: true,
  imports: [IonContent,
    CommonModule, FormsModule, IonList, TeacherDetailCard, HeaderComponent, FooterComponent]
})
export class TeacherListPage implements OnInit {

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
        if (lang && lang.introduction) {
          lang.introduction = lang.introduction.replace(/\\n/g, '\n');
        }
        this.language.set(lang);
      });

      this.professorService.getProfessors().subscribe((data) => {
        this.professors.set(data);
      });
    });
  }

}
