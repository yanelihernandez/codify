import { Component, OnInit, signal } from '@angular/core';
import { Professor } from '../../models/professor';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProfessorService } from '../../services/professors.service';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';
import { BookingService } from '../../services/booking.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './booking.html',
  styleUrl: './booking.css'
})
export class Booking implements OnInit {
  professor = signal<Professor | null>(null);
  bookingForm!: FormGroup;
  saving = signal(false);

  constructor(
    private route: ActivatedRoute,
    private service: ProfessorService,
    private authService: AuthService,
    private toastService: ToastService,
    private bookingService: BookingService,
    private router: Router,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.loadProfessor();
  }

  private initForm(): void {
    this.bookingForm = this.fb.group({
      fullName: ['', Validators.required],
      date: ['', [Validators.required, this.fechaPasadaValidator]],
      time: ['', Validators.required],
      hours: ['', Validators.required],
      isGroup: [false]
    });
  }
  private loadProfessor(): void {
    const profId = this.route.snapshot.paramMap.get('id');

    if (!profId) {
      this.professor.set(null);
      return;
    }

    this.service.getProfessors().subscribe({
      next: (profs) => {
        const foundProfessor = profs.find(
          (p) => String(p.id) === String(profId)
        );

        this.professor.set(foundProfessor ?? null);

        if (!foundProfessor) {
          console.warn('No se encontró profesor con id:', profId);
        }
      },
      error: (error) => {
        console.error('Error cargando profesor:', error);
        this.professor.set(null);
        this.toastService.show('No se pudo cargar el profesor');
      }
    });
  }

  fechaPasadaValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaSeleccionada = new Date(control.value);
    fechaSeleccionada.setHours(0, 0, 0, 0);

    return fechaSeleccionada < hoy ? { fechaPasada: true } : null;
  }

  get fullName() {
    return this.bookingForm.get('fullName')!;
  }

  get date() {
    return this.bookingForm.get('date')!;
  }

  get time() {
    return this.bookingForm.get('time')!;
  }

  get hours() {
    return this.bookingForm.get('hours')!;
  }

  get isGroup() {
    return this.bookingForm.get('isGroup')!;
  }

  onGroupChange(): void {
    this.precio();
  }

  precio(): number {
    const prof = this.professor();
    if (!prof) return 0;

    const horasNum = Number(this.hours.value);
    if (isNaN(horasNum) || horasNum <= 0) return 0;

    const precioHora = Number(prof.hour_price);
    if (isNaN(precioHora)) return 0;

    let total = precioHora * horasNum;

    if (this.isGroup.value === true) {
      const descuento = Number(prof.group_discount) || 0;
      total = total * (1 - descuento / 100);
    }

    return Math.round(total);
  }

  async handleSubmit(): Promise<void> {
    console.log('handleSubmit ejecutado');

    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      this.toastService.show('Revisa los campos obligatorios');
      console.warn('Formulario inválido:', this.bookingForm.value);
      return;
    }

    const prof = this.professor();

    if (!prof) {
      this.toastService.show('No se ha podido identificar al profesor');
      console.warn('Profesor null al reservar');
      return;
    }

    const auth = this.authService.authState();

    if (!auth.loggedIn || !auth.uid) {
      this.toastService.show('Debes iniciar sesión para reservar');
      this.router.navigate(['/sign-in']);
      console.warn('Usuario sin sesión al reservar:', auth);
      return;
    }

    const bookingData = {
      userId: auth.uid,
      professorId: String(prof.id),
      professorName: prof.name,
      professorImage: prof.image,
      fullName: this.fullName.value,
      date: this.date.value,
      time: this.time.value,
      hours: Number(this.hours.value),
      isGroup: !!this.isGroup.value,
      price: this.precio()
    };

    console.log('AUTH AL RESERVAR:', auth);
    console.log('PROFESOR AL RESERVAR:', prof);
    console.log('DATOS RESERVA:', bookingData);

    try {
      this.saving.set(true);

      await this.bookingService.createBooking(bookingData);

      this.toastService.show('Reserva realizada correctamente');
      this.router.navigate(['/my-bookings']);
    } catch (error) {
      console.error('Error creando reserva:', error);
      this.toastService.show('No se pudo guardar la reserva');
    } finally {
      this.saving.set(false);
    }
  }
}
