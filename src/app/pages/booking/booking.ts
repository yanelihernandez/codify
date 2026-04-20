import {Component, OnInit, signal} from '@angular/core';
import {Professor} from '../../models/professor';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ProfessorService} from '../../services/professors.service';

@Component({
  selector: 'app-booking',
  imports: [
    RouterLink
  ],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
  standalone: true
})
export class Booking implements OnInit {
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
