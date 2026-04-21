import { Component, OnInit, signal, computed } from '@angular/core';
import {
  FormGroup, FormControl, Validators,
  AbstractControl, ValidationErrors, ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';
import { ProfessorService } from '../../services/professors.service';
import { Professor } from '../../models/professor';

function noFechaPasada(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  const selected = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected < today ? { fechaPasada: true } : null;
}

@Component({
  selector: 'app-booking',
  imports: [ReactiveFormsModule],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
  standalone: true
})
export class Booking implements OnInit {

  professor = signal<Professor | null>(null);

  fullName = new FormControl('', Validators.required);
  date = new FormControl('', [Validators.required, noFechaPasada]);
  time = new FormControl('', Validators.required);
  hours = new FormControl('', Validators.required);
  isGroup = new FormControl(false);

  bookingForm = new FormGroup({
    fullName: this.fullName,
    date: this.date,
    time: this.time,
    hours: this.hours,
    isGroup: this.isGroup
  });

  precio = computed(() => {
    const prof = this.professor();
    if (!prof) return 0;
    const h = parseInt(this.hours.value ?? '0');
    if (isNaN(h) || h <= 0) return 0;
    let price = h * prof.hour_price;
    if (this.isGroup.value) price *= (1 - (prof.group_discount ?? 0) / 100);
    return Math.round(price);
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
    private service: ProfessorService
  ) {}

  ngOnInit(): void {
    const auth = this.authService.authState();
    if (!auth.loggedIn) {
      this.toastService.show('Debes iniciar sesión para reservar');
      setTimeout(() => this.router.navigate(['/sign-in']), 1000);
      return;
    }

    this.fullName.setValue(auth.fullName ?? '');

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.service.getProfessors().subscribe(profs => {
        const p = profs.find(p => p.id.toString() === id);
        this.professor.set(p ?? null);
      });
    });

    this.hours.valueChanges.subscribe(() => {});
    this.isGroup.valueChanges.subscribe(() => {});
  }

  handleSubmit(): void {
    this.bookingForm.markAllAsTouched();
    if (this.bookingForm.invalid) {
      this.toastService.show('Por favor, rellena todos los campos obligatorios');
      return;
    }

    const auth = this.authService.authState();
    const prof = this.professor();
    if (!prof) return;

    const booking = {
      id: Date.now(),
      professorId: prof.id,
      professorName: prof.name,
      professorImage: prof.image,
      studentName: this.fullName.value!.trim(),
      studentUsername: auth.username,
      date: this.date.value!,
      time: this.time.value!,
      hours: parseInt(this.hours.value!),
      isGroup: this.isGroup.value,
      price: `${this.precio()}€`,
      bookingDate: new Date().toISOString(),
      status: 'active'
    };

    const storageKey = `codify_bookings_${auth.username}`;
    const existing = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    existing.push(booking);
    localStorage.setItem(storageKey, JSON.stringify(existing));

    this.toastService.show('¡Reserva confirmada!');
    setTimeout(() => this.router.navigate(['/my-bookings']), 1000);
  }

  goBack(): void {
    const prof = this.professor();
    if (prof) {
      this.router.navigate(['/teacher-profile', prof.id]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
